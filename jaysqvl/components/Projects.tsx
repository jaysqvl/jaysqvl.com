import { ArrowUpRight, Code2, Github } from 'lucide-react';
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
    title: 'ExpensAI',
    type: 'Android + AI finance tool',
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
    title: 'Buntzen Pass Bot',
    type: 'Practical automation',
    description:
      'A Selenium/NTP automation project for reserving park passes at the exact release window, built from a real family problem.',
    technologies: ['Python', 'Selenium', 'NTP', 'Automation'],
    github: 'https://github.com/jaysqvl/buntzen-pass-bot',
  },
  {
    title: 'Wi-Fi QR Generator',
    type: 'Homelab utility',
    description:
      'Interactive shell utility for generating Wi-Fi QR codes across WPA/WEP/open networks with validation and multiple output formats.',
    technologies: ['Shell', 'qrencode', 'PNG/SVG', 'CLI'],
    github: 'https://github.com/jaysqvl/wifi-qrcode-generator',
  },
  {
    title: 'SnapScreen.ai',
    type: 'Resume screening platform',
    description:
      'Open-source platform prototype for student hiring workflows with authentication, dashboard UI, and planned service-backed document handling.',
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
    type: 'Portfolio system',
    description:
      'This site: a rollback-safe Next.js portfolio on Vercel, now redesigned around work, projects, and homelab texture.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind', 'Vercel'],
    github: 'https://github.com/jaysqvl/jaysqvl.com',
    demo: 'https://jaysqvl.com',
  },
  {
    title: 'Cardiolo',
    type: 'Mobile activity tracking',
    description:
      'Cardio tracking app with automatic activity classification, Google Maps route views, and asynchronous Android UI flows.',
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
            <div className="section-kicker">
              <Code2 className="size-4" />
              selected work
            </div>
            <h2 className="section-title">Projects that feel like tools, not thumbnails.</h2>
          </div>
          <Button asChild variant="outline" className="w-fit gap-2">
            <a href="https://github.com/jaysqvl?tab=repositories" target="_blank" rel="noopener noreferrer">
              <Github className="size-4" />
              More on GitHub
            </a>
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
                    <Github className="size-4" />
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
