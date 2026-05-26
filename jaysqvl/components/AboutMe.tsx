import { Boxes, CloudCog, Network, TerminalSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const labAreas = [
  {
    title: 'Network Edge',
    description: 'OPNsense, UniFi, DNS, VLANs, VPN paths, and the boring controls that make the fun stuff survivable.',
    icon: Network,
    tags: ['OPNsense', 'UniFi', 'Raspberry Pi DNS', 'segmentation'],
  },
  {
    title: 'Self-Hosted Services',
    description: 'Dockerized utilities, dashboards, automations, private cloud experiments, and repeatable Linux setups.',
    icon: Boxes,
    tags: ['Docker', 'Linux', 'VMs', 'scripts'],
  },
  {
    title: 'Cloud + AI Workflows',
    description: 'Project infrastructure that blends APIs, serverless pieces, data stores, LLMs, and practical user interfaces.',
    icon: CloudCog,
    tags: ['GCP', 'Firebase', 'Vercel', 'LangChain'],
  },
];

const stack = [
  'Python',
  'TypeScript',
  'Kotlin',
  'React',
  'Next.js',
  'Docker',
  'GCP',
  'Firebase',
  'Postgres',
  'Supabase',
  'LangChain',
  'Bash',
];

export default function AboutMe() {
  return (
    <section id="lab" className="section-band">
      <div className="section-shell">
        <div className="section-kicker">
          <TerminalSquare className="size-4" />
          lab notes
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div>
            <h2 className="section-title">A portfolio with a workbench behind it.</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              I like software that has to touch the real world: scheduled jobs, weird vendor data, Android apps, cloud
              functions, small business tooling, network plumbing, and the occasional script that saves someone an hour.
            </p>
            <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
              The homelab side is not here as live telemetry. It is here because it explains how I think: isolate the
              risky parts, automate the repeated parts, document enough to recover, and keep tinkering until the system
              feels understandable.
            </p>
          </div>

          <div className="grid gap-3">
            {labAreas.map((area) => {
              const Icon = area.icon;

              return (
                <article key={area.title} className="panel p-5">
                  <div className="flex items-start gap-4">
                    <div className="grid size-10 shrink-0 place-items-center rounded-md border border-border bg-muted">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{area.title}</h3>
                      <p className="mt-2 leading-7 text-muted-foreground">{area.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {area.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="badge-soft">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">daily materials</p>
          <div className="flex flex-wrap gap-2">
            {stack.map((item) => (
              <Badge key={item} variant="outline" className="rounded-full bg-card px-3 py-1 text-xs">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
