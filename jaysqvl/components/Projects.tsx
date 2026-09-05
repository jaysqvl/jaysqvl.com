import { ArrowUpRight, GitBranch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProjectItem {
  title: string;
  type: string;
  description: string;
  technologies: string[];
  github: string;
  demo?: string;
}

const projects: ProjectItem[] = [
  {
    title: 'Buntzen Pass Bot',
    type: 'Browser automation',
    description:
      'I built this to help my family reserve Buntzen Lake park passes when bookings open. It automates the reservation process in a browser.',
    technologies: ['Go', 'Browser automation', 'Docker'],
    github: 'https://github.com/jaysqvl/buntzen-pass-bot',
  },
  {
    title: 'Wi-Fi QR Generator',
    type: 'Homelab utility',
    description:
      'A command-line tool that creates Wi-Fi QR codes so guests can join a network without typing the password. Exports PNG and SVG files.',
    technologies: ['Shell', 'qrencode', 'PNG/SVG', 'CLI'],
    github: 'https://github.com/jaysqvl/wifi-qrcode-generator',
  },
  {
    title: 'ExpensAI',
    type: 'Android app',
    description:
      'Expense tracking app with receipt scanning, Firebase-backed sync, OpenAI Vision classification, and cloud functions for image/text processing.',
    technologies: ['Kotlin', 'Firebase', 'GCP', 'OpenAI Vision'],
    github: 'https://github.com/jaysqvl/ExpensAI',
  },
  {
    title: 'Impersonator',
    type: 'Document chatbot',
    description:
      'PDF-grounded chatbot using LangChain, vector stores, Docker, and a Streamlit interface for querying document collections.',
    technologies: ['Python', 'LangChain', 'Docker', 'Supabase'],
    github: 'https://github.com/jaysqvl/impersonator',
  },
  {
    title: 'SnapScreen.ai',
    type: 'Resume screening platform',
    description:
      'A prototype for student hiring, with authentication and a résumé review dashboard. Still in development.',
    technologies: ['Java', 'Spring', 'Firebase', 'Postgres'],
    github: 'https://github.com/jaysqvl/snapscreen.ai',
  },
  {
    title: 'Divide and Conquer',
    type: 'Networked game',
    description:
      'Java socket-based multiplayer drawing/territory game with a multithreaded server and packet-based client communication.',
    technologies: ['Java', 'Sockets', 'Swing', 'Threads'],
    github: 'https://github.com/jaysqvl/divide-and-conquer-socket-program',
  },
  {
    title: 'Jaysqvl.com',
    type: 'Personal website',
    description:
      'The source for this website, built with Next.js and hosted on Vercel.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind', 'Vercel'],
    github: 'https://github.com/jaysqvl/jaysqvl.com',
    demo: 'https://jaysqvl.com',
  },
  {
    title: 'Cardiolo',
    type: 'Mobile activity tracking',
    description:
      'An Android app that records exercise routes and classifies activities.',
    technologies: ['Kotlin', 'Weka', 'Google Maps', 'Android'],
    github: 'https://github.com/jaysqvl/Cardiolo',
  },
];

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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.title} className="project-card">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {project.type}
                </p>
                <h3 className="mt-3 text-2xl font-semibold">{project.title}</h3>
                <p className="mt-4 leading-7 text-muted-foreground">{project.description}</p>
              </div>

              <div>
                <div className="mb-5 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="badge-soft">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <GitBranch className="size-4" />
                    Code
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      Live
                      <ArrowUpRight className="size-4" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
