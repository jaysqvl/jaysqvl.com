import { GraduationCap, MapPin } from 'lucide-react';
import LogoOrIcon from '@/components/LogoOrIcon';

const education = [
  {
    institution: 'Simon Fraser University',
    degree: 'BASc Computer Science - Software Systems',
    location: 'Burnaby, BC',
    period: 'Sept 2022 - Present',
    focus: 'Operating systems, computer networks, software engineering, cloud computing, databases, mobile development, UI design, and intelligent systems.',
    logoSrc: '/sfu.jpg',
  },
  {
    institution: 'University of British Columbia',
    degree: 'BSc Computer Science & Mathematics',
    location: 'Vancouver, BC',
    period: 'Sept 2020 - Aug 2022',
    focus: 'Data structures, algorithms, artificial intelligence, machine learning, deep learning, security, discrete math, linear algebra, and calculus.',
    logoSrc: '/ubc.jpg',
  },
];

export default function Education() {
  return (
    <section id="education" className="section-band bg-muted/24">
      <div className="section-shell">
        <div className="section-kicker">
          <GraduationCap className="size-4" />
          education
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {education.map((item) => (
            <article key={item.institution} className="panel p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-muted">
                  <LogoOrIcon
                    logoSrc={item.logoSrc}
                    alt={`${item.institution} logo`}
                    icon={<GraduationCap className="size-5" />}
                  />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.period}</p>
                  <h2 className="mt-2 text-2xl font-semibold">{item.institution}</h2>
                  <p className="mt-1 text-muted-foreground">{item.degree}</p>
                  <p className="mt-4 leading-7 text-muted-foreground">{item.focus}</p>
                  <p className="mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {item.location}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
