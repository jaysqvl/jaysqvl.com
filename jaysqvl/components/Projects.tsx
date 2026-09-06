import { GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectCards from '@/components/ProjectCards';
import ProjectFeed from '@/components/ProjectFeed';
import { fallbackProjects } from '@/lib/projects';

export default function Projects() {
  return (
    <section id="projects" className="section-band">
      <div className="section-shell">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">Projects</h2>
            <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
              Some of the software and tools I work on in my spare time.
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit gap-2">
            <a href="https://github.com/jaysqvl?tab=repositories" target="_blank" rel="noopener noreferrer">
              <GitBranch className="size-4" />
              More on GitHub
            </a>
          </Button>
        </div>
        <ProjectFeed initialProjects={fallbackProjects}>
          <ProjectCards projects={fallbackProjects} />
        </ProjectFeed>
      </div>
    </section>
  );
}
