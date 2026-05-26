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
            <h2 className="section-title">A home server with a real job.</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              My homelab is less about blinking lights for their own sake and more about owning useful systems: a NAS,
              photo storage that replaces iCloud-style dependence, Docker services, AI experiments, smart-home
              automation, and a clean public edge through Nginx Proxy Manager.
            </p>
            <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
              The public version stays intentionally high-level. It shows what the server does, how the pieces relate,
              and how I think about systems without exposing hostnames, IPs, private dashboards, or internal topology.
            </p>

            <div className="mt-7 rounded-md border border-border bg-card/80 p-5">
              <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-md border border-border bg-muted">
                  <Server className="size-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Server-first, privacy-aware.</h3>
                  <p className="mt-2 leading-7 text-muted-foreground">
                    The interesting part is the shape: edge, network, server, storage, containers, AI, smart home, and
                    cloud handoff. The sensitive parts stay off the page.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <HomelabMap />
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            public-safe stack labels
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
