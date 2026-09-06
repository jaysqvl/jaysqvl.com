import { ArrowUpRight, GitBranch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ProjectItem } from '@/lib/projects';

const dateFormat = new Intl.DateTimeFormat('en-CA', {
  month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
});

export default function ProjectCards({ projects }: { projects: ProjectItem[] }) {
  if (projects.length === 0) {
    return <p className="text-muted-foreground">No public projects to show right now.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <article key={project.id} className="project-card">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-muted-foreground">
              {project.type && (
                <p className="font-mono text-[11px] uppercase tracking-[0.18em]">{project.type}</p>
              )}
              {project.updatedAt && (
                <time dateTime={project.updatedAt} className="text-xs">
                  Updated {dateFormat.format(new Date(project.updatedAt))}
                </time>
              )}
            </div>
            <h3 className="mt-3 text-2xl font-semibold">{project.title}</h3>
            <p className="mt-4 leading-7 text-muted-foreground">{project.description}</p>
          </div>
          <div>
            {project.languages.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2" aria-label="Programming languages">
                {project.languages.map((language) => (
                  <Badge key={language} variant="outline" className="badge-soft">{language}</Badge>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-muted">
                <GitBranch className="size-4" />
                Code
              </a>
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-muted">
                  Live
                  <ArrowUpRight className="size-4" />
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
