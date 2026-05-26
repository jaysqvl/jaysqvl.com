import { BriefcaseBusiness, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import LogoOrIcon from '@/components/LogoOrIcon';

interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  period: string;
  summary: string;
  outcomes: string[];
  technologies: string[];
  link?: string;
  logoSrc?: string;
}

const experiences: ExperienceItem[] = [
  {
    role: 'Software Engineer',
    company: '2K',
    location: 'Vancouver, BC',
    period: 'Present',
    summary:
      'Software engineering at 2K in Vancouver. The work details stay off the public portfolio, but the role belongs here: production software inside a real game company.',
    outcomes: [
      'Working in a professional game-development engineering environment.',
      'Keeping project specifics private while still showing the current 2K chapter on the site.',
      'Bringing systems, tooling, automation, and backend instincts into a larger software organization.',
    ],
    technologies: ['Software Engineering', 'Games', 'Tooling', 'Production Systems'],
    link: 'https://www.2k.com',
  },
  {
    role: 'Software Engineer',
    company: 'OffroadExpert',
    location: 'Vancouver, BC',
    period: 'June 2024 - before 2K',
    summary:
      'Built the less glamorous parts that make a business move faster: product ingestion, cron controls, API integrations, cloud migration support, and React tooling for internal workflows.',
    outcomes: [
      'Scaled in-store product listings by 300x through automated vendor ingestion from CSVs and hosted vendor files.',
      'Dockerized a React/Tailwind control surface for cron endpoints, logs, and configuration management.',
      'Added REST integrations and an LLM metadata layer for cleaner product display data and SEO consistency.',
      'Supported a private-cloud migration that reduced operating expense by roughly 50%.',
    ],
    technologies: ['Python', 'TypeScript', 'React', 'Docker', 'Bash', 'GCP'],
    link: 'https://offroadexpert.shop',
    logoSrc: '/offroadexpert.jpg',
  },
  {
    role: 'Contract Software Developer',
    company: 'Jaysqvl Solutions',
    location: 'Vancouver, BC / Remote',
    period: 'Sept 2020 - Present',
    summary:
      'Small-business software and technical support across AI integrations, cloud/web apps, networking, virtualization, security, and teaching systems.',
    outcomes: [
      'Built REST APIs, full-stack apps, AI integrations, and operational tools for varied client needs.',
      'Audited, debugged, and tested course content used by 3000+ students across private and public learning platforms.',
      'Tutored university students in mathematics, computer science, and data science.',
    ],
    technologies: ['Python', 'JavaScript', 'React', 'Node.js', 'Docker', 'AI/ML'],
    logoSrc: '/jaysqvl.jpg',
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section-band bg-muted/24">
      <div className="section-shell">
        <div className="section-kicker">
          <BriefcaseBusiness className="size-4" />
          operating history
        </div>

        <div className="mb-10 grid gap-5 lg:grid-cols-[0.72fr_1fr] lg:items-end">
          <h2 className="section-title">Resume work, written like systems work.</h2>
          <p className="max-w-2xl leading-7 text-muted-foreground lg:justify-self-end">
            The thread through the work is practical engineering: take messy inputs, build a repeatable path, give people
            a usable surface, and leave the system easier to run than it was found.
          </p>
        </div>

        <div className="grid gap-4">
          {experiences.map((experience) => (
            <article key={`${experience.company}-${experience.role}`} className="panel p-5 sm:p-6">
              <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-muted">
                      <LogoOrIcon
                        logoSrc={experience.logoSrc || ''}
                        alt={`${experience.company} logo`}
                        icon={<BriefcaseBusiness className="size-5" />}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{experience.role}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{experience.company}</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    <p>{experience.period}</p>
                    <p>{experience.location}</p>
                    {experience.link && (
                      <a
                        href={experience.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-muted-foreground"
                      >
                        Visit
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-pretty leading-7 text-muted-foreground">{experience.summary}</p>
                  <ul className="mt-5 grid gap-3">
                    {experience.outcomes.map((outcome) => (
                      <li key={outcome} className="flex gap-3 leading-7 text-muted-foreground">
                        <span className="mt-3 size-1.5 shrink-0 rounded-full bg-foreground" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {experience.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="badge-soft">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
