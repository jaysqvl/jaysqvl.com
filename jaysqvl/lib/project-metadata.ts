import type { ProjectItem } from './projects';

type ProjectMetadata = Pick<ProjectItem, 'id' | 'languages' | 'updatedAt'>;

// The catalogue owns selection, order, copy, and links. GitHub and old browser
// snapshots can supply only the metadata that is meant to update automatically.
export function applyProjectMetadata(
  catalogue: readonly ProjectItem[],
  metadata: readonly ProjectMetadata[],
  { includeMissing = false }: { includeMissing?: boolean } = {},
): ProjectItem[] {
  const byId = new Map(metadata.map((project) => [project.id, project]));

  return catalogue.flatMap((project) => {
    const update = byId.get(project.id);
    if (!update) return includeMissing ? [project] : [];

    return [{
      ...project,
      languages: [...update.languages],
      updatedAt: update.updatedAt,
    }];
  });
}

export function resolveProjectRefresh(
  catalogue: readonly ProjectItem[],
  response: { projects: readonly ProjectItem[]; source: 'github' | 'fallback' },
  saved: readonly ProjectItem[] | null,
): { projects: ProjectItem[]; snapshot: ProjectItem[] | null } {
  if (response.source === 'github') {
    const projects = applyProjectMetadata(catalogue, response.projects);
    return { projects, snapshot: projects };
  }

  // An outage may reuse metadata, but cannot renew its successful-fetch age.
  return {
    projects: applyProjectMetadata(catalogue, saved ?? response.projects, { includeMissing: true }),
    snapshot: null,
  };
}
