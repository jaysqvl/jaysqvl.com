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
  logoFit?: 'cover' | 'contain';
}

const experiences: ExperienceItem[] = [
  {
    role: 'Software Engineer',
    company: '2K',
    location: 'Vancouver, BC',
    period: 'Present',
    summary:
      'I work on networking and online backend systems.',
    outcomes: [],
    technologies: [],
    link: 'https://www.2k.com',
    logoSrc: '/2k-logo.png',
    logoFit: 'contain',
  },
  {
    role: 'Software Engineer',
    company: 'OffroadExpert',
    location: 'Vancouver, BC',
    period: 'From June 2024',
    summary:
      'Built product import pipelines, API integrations, and internal tools for an automotive parts retailer.',
    outcomes: [
      'Scaled in-store product listings by 300x through automated vendor ingestion from CSVs and hosted vendor files.',
      'Built and containerized a React interface for managing scheduled jobs, logs, and configuration.',
      'Integrated vendor APIs and used an LLM to standardize product metadata.',
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
      'Develop software and provide technical support for small businesses, alongside course development and tutoring.',
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
        <h2 className="section-title mb-10">Experience</h2>

        <div className="grid gap-4">
          {experiences.map((experience) => (
            <article key={`${experience.company}-${experience.role}`} className="panel p-5 sm:p-6">
              <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="company-logo-frame">
                      <LogoOrIcon
                        logoSrc={experience.logoSrc || ''}
                        alt={`${experience.company} logo`}
                        icon={<BriefcaseBusiness className="size-5" />}
                        fit={experience.logoFit}
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
                  {experience.outcomes.length > 0 && (
                    <ul className="mt-5 grid gap-3">
                      {experience.outcomes.map((outcome) => (
                        <li key={outcome} className="flex gap-3 leading-7 text-muted-foreground">
                          <span className="mt-3 size-1.5 shrink-0 rounded-full bg-foreground" aria-hidden="true" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {experience.technologies.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {experience.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="badge-soft">
                          {tech}
                        </Badge>
                      ))}
                    </div>
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
