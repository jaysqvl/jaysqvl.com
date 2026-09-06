import 'server-only';

import { fallbackProjects, githubOwner, isProjectList, type ProjectItem } from './projects';

interface PublicRepository {
  id: string;
  name: string;
  description: string | null;
  language: string | null;
  pushedAt: string | null;
}

interface ProjectsResponse {
  projects: ProjectItem[];
  source: 'github' | 'fallback';
}

const selectedProjects = new Map(fallbackProjects.map((project) => [project.id, project]));
const requestTimeoutMs = 3500;
const refreshTimeoutMs = 8000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

async function githubJson(path: string, signal: AbortSignal): Promise<unknown> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2026-03-10',
    'User-Agent': 'jaysqvl.com-projects',
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const response = await fetch(`https://api.github.com${path}`, {
    headers,
    redirect: 'error',
    signal: AbortSignal.any([signal, AbortSignal.timeout(requestTimeoutMs)]),
    next: { revalidate: 3600 },
  });

  // Next's fetch cache stores successful responses. Rate limits and other HTTP
  // failures are thrown here and never turned into an hour-long fallback cache.
  if (!response.ok) throw new Error('GitHub project data is unavailable');
  return response.json();
}

function publicRepository(value: unknown): PublicRepository | null {
  if (!isRecord(value) || value.private !== false || !isRecord(value.owner)) return null;
  if (
    typeof value.owner.login !== 'string' ||
    value.owner.login.toLowerCase() !== githubOwner ||
    typeof value.name !== 'string' ||
    !/^[a-zA-Z0-9._-]{1,100}$/.test(value.name) ||
    typeof value.full_name !== 'string' ||
    value.full_name.toLowerCase() !== `${githubOwner}/${value.name.toLowerCase()}` ||
    (value.visibility !== undefined && value.visibility !== 'public')
  ) return null;

  const id = value.full_name.toLowerCase();
  if (!selectedProjects.has(id)) return null;

  if (
    (value.description !== null && typeof value.description !== 'string') ||
    (typeof value.description === 'string' && value.description.length > 2048) ||
    (value.language !== null && typeof value.language !== 'string') ||
    (typeof value.language === 'string' && (value.language.length === 0 || value.language.length > 80)) ||
    (value.pushed_at !== null && (
      typeof value.pushed_at !== 'string' ||
      value.pushed_at.length > 40 ||
      !/^\d{4}-\d{2}-\d{2}T/.test(value.pushed_at) ||
      !Number.isFinite(Date.parse(value.pushed_at))
    ))
  ) throw new Error('Invalid GitHub project data');

  return {
    id,
    name: value.name,
    description: typeof value.description === 'string' ? value.description.trim() || null : null,
    language: value.language as string | null,
    pushedAt: value.pushed_at as string | null,
  };
}

async function publicRepositories(signal: AbortSignal): Promise<PublicRepository[]> {
  const repositories = new Map<string, PublicRepository>();

  // One paginated public-user listing supplies all card metadata. Stop as soon
  // as all selected repositories are found; do not make one metadata call/card.
  for (let page = 1; page <= 5; page += 1) {
    const data = await githubJson(
      `/users/${githubOwner}/repos?type=owner&sort=pushed&direction=desc&per_page=100&page=${page}`,
      signal,
    );
    if (!Array.isArray(data) || data.length > 100) throw new Error('Invalid GitHub repository list');

    for (const value of data) {
      if (!isRecord(value)) throw new Error('Invalid GitHub repository list');
      const repository = publicRepository(value);
      if (repository) repositories.set(repository.id, repository);
    }

    if (data.length < 100 || repositories.size === selectedProjects.size) return [...repositories.values()];
  }

  // An incomplete scan must not silently remove selected projects.
  throw new Error('GitHub repository listing exceeded its refresh limit');
}

async function repositoryLanguages(repository: PublicRepository, signal: AbortSignal): Promise<string[]> {
  try {
    const data = await githubJson(`/repos/${githubOwner}/${encodeURIComponent(repository.name)}/languages`, signal);
    if (!isRecord(data)) throw new Error('Invalid GitHub language data');

    const entries = Object.entries(data);
    if (!entries.every(([language, bytes]) => (
      language.length > 0 && language.length <= 80 &&
      typeof bytes === 'number' && Number.isSafeInteger(bytes) && bytes >= 0
    ))) throw new Error('Invalid GitHub language data');

    return (entries as [string, number][])
      .filter(([, bytes]) => bytes > 0)
      .sort(([languageA, bytesA], [languageB, bytesB]) => bytesB - bytesA || languageA.localeCompare(languageB))
      .slice(0, 5)
      .map(([language]) => language);
  } catch {
    return repository.language ? [repository.language] : [];
  }
}

export async function getGithubProjects(): Promise<ProjectsResponse> {
  try {
    const signal = AbortSignal.timeout(refreshTimeoutMs);
    const repositories = await publicRepositories(signal);
    const projects = await Promise.all(repositories.map(async (repository): Promise<ProjectItem> => {
      const saved = selectedProjects.get(repository.id)!;
      return {
        ...saved,
        description: repository.description ?? saved.description,
        languages: await repositoryLanguages(repository, signal),
        github: `https://github.com/${githubOwner}/${repository.name}`,
        updatedAt: repository.pushedAt,
      };
    }));

    projects.sort((a, b) => (
      (b.updatedAt ? Date.parse(b.updatedAt) : 0) - (a.updatedAt ? Date.parse(a.updatedAt) : 0) ||
      a.title.localeCompare(b.title)
    ));
    if (!isProjectList(projects)) throw new Error('Invalid project response');
    return { projects, source: 'github' };
  } catch {
    // The client can keep its last successful public snapshot. Never return
    // upstream responses, credentials, or private repository metadata.
    return { projects: fallbackProjects, source: 'fallback' };
  }
}
