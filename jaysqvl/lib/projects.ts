export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  languages: string[];
  github: string;
  demo?: string;
  releases?: string;
  updatedAt: string | null;
  type?: string;
}

export const githubOwner = 'jaysqvl';

// Homepage order is curated by engineering depth and contribution. GitHub only
// refreshes languages and last-push dates; it cannot replace this copy or order.
export const fallbackProjects: ProjectItem[] = [
  {
    id: 'jaysqvl/buntzen-pass-bot',
    title: 'Buntzen Pass Bot',
    type: 'Backend / browser automation',
    description:
      'A self-hosted service I built to reserve Buntzen Lake passes for my family. A Go backend coordinates scheduled jobs, Python browser workers, manual approval, and booking confirmation.',
    languages: ['Go', 'Python', 'HTML', 'Shell', 'JavaScript'],
    github: 'https://github.com/jaysqvl/buntzen-pass-bot',
    updatedAt: null,
  },
  {
    id: 'jaysqvl/scriberr',
    title: 'Scriberr',
    type: 'Maintained fork',
    description:
      'I maintain a fork of Scriberr, a self-hosted transcription platform. My updates add queued model comparisons, preserved run history, resumable uploads, and controls for long-running jobs.',
    languages: ['Go', 'TypeScript', 'Python', 'MDX', 'CSS'],
    github: 'https://github.com/jaysqvl/Scriberr',
    updatedAt: null,
  },
  {
    id: 'jaysqvl/spider',
    title: 'Spider',
    type: 'Desktop game',
    description:
      'A desktop Spider Solitaire game I built for my dad. It has a deterministic rules engine, SQLite saves, undo/redo, and signed updates for Windows and macOS.',
    languages: ['TypeScript', 'JavaScript', 'CSS', 'Rust', 'HTML'],
    github: 'https://github.com/jaysqvl/spider',
    releases: 'https://github.com/jaysqvl/spider/releases',
    updatedAt: null,
  },
  {
    id: 'jaysqvl/cardiolo',
    title: 'Cardiolo',
    type: 'Android / coursework',
    description:
      'An Android activity tracker combining GPS routes, sensor-based activity classification, and Room storage. A foreground service records workouts while the app is in the background.',
    languages: ['Kotlin', 'Java'],
    github: 'https://github.com/jaysqvl/Cardiolo',
    updatedAt: null,
  },
  {
    id: 'jaysqvl/expensai',
    title: 'ExpensAI',
    type: 'Android / team prototype',
    description:
      'A team-built Android expense tracker. My contributions covered Python cloud functions, receipt-scanning APIs, and camera integration.',
    languages: ['Kotlin', 'Python'],
    github: 'https://github.com/jaysqvl/ExpensAI',
    updatedAt: null,
  },
  {
    id: 'jaysqvl/ev3-robot',
    title: 'LEGO EV3',
    type: 'Robotics experiments',
    description:
      'LEGO EV3 programs for line following and maze navigation using sensor feedback. The project also includes MATLAB analysis of barcode readings captured by the robot.',
    languages: ['C', 'Python', 'MATLAB'],
    github: 'https://github.com/jaysqvl/ev3-robot',
    updatedAt: null,
  },
];

function isText(value: unknown, maxLength: number): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= maxLength;
}

function isDemoUrl(value: unknown): boolean {
  if (!isText(value, 2048)) return false;

  try {
    const url = new URL(value);
    return (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password;
  } catch {
    return false;
  }
}

// Browser storage and API responses are untrusted. Keep the public card contract
// small and reject unexpected destinations before rendering links.
export function isProjectList(value: unknown): value is ProjectItem[] {
  if (!Array.isArray(value) || value.length > 50) return false;

  const ids = new Set<string>();
  return value.every((item: unknown) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
    const project = item as Record<string, unknown>;

    if (
      !isText(project.id, 140) ||
      !/^jaysqvl\/[a-z0-9._-]+$/.test(project.id) ||
      ids.has(project.id) ||
      !isText(project.title, 128) ||
      !isText(project.description, 2048) ||
      !isText(project.github, 256) ||
      !/^https:\/\/github\.com\/jaysqvl\/[a-zA-Z0-9._-]+$/.test(project.github) ||
      project.github.slice('https://github.com/'.length).toLowerCase() !== project.id ||
      !Array.isArray(project.languages) ||
      project.languages.length > 5 ||
      !project.languages.every((language) => isText(language, 80)) ||
      (project.type !== undefined && !isText(project.type, 128)) ||
      (project.demo !== undefined && !isDemoUrl(project.demo)) ||
      (project.releases !== undefined && project.releases !== `${project.github}/releases`) ||
      (project.updatedAt !== null && (
        !isText(project.updatedAt, 40) ||
        !/^\d{4}-\d{2}-\d{2}T/.test(project.updatedAt) ||
        !Number.isFinite(Date.parse(project.updatedAt))
      ))
    ) return false;

    ids.add(project.id);
    return true;
  });
}
