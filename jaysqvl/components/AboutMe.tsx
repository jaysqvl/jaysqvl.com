import { Server, TerminalSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import HomelabMap from '@/components/HomelabMap';

const stack = [
  'Python',
  'TypeScript',
  'Kotlin',
  'React',
  'Next.js',
  'Docker',
  'Home Server',
  'NAS',
  'Personal Cloud',
  'Nginx Proxy Manager',
  'OPNsense',
  'UniFi',
  'Smart Home',
  'AI Sandbox',
  'GCP',
  'Firebase',
  'Bash',
];

export default function AboutMe() {
  return (
    <section id="lab" className="section-band">
      <div className="section-shell">
        <div className="section-kicker">
          <TerminalSquare className="size-4" />
          system design
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
          <div>
            <h2 className="section-title">A server that actually does things.</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              My homelab earns its keep: photo storage instead of another cloud bill, NAS duty, Docker apps, backups,
              small AI experiments, and smart-home wiring that behaves like software.
            </p>
            <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
              The public version is deliberately high level: OPNsense at the edge, UniFi for the network, one server at
              the center, and a few cloud handoffs where they make sense.
            </p>

            <div className="mt-7 rounded-md border border-border bg-card/80 p-5">
              <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-md border border-border bg-muted">
                  <Server className="size-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Broad strokes, real shape.</h3>
                  <p className="mt-2 leading-7 text-muted-foreground">
                    The interesting part is how the pieces talk to each other: routing, storage, containers,
                    automation, and a proxy edge. The private names and numbers stay off the page.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <HomelabMap />
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            stack notes
          </p>
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
