import {
  ArrowDownRight,
  GitBranch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LabTerminal from '@/components/LabTerminal';
import HeroBackground from '@/components/HeroBackground';

const signals = [
  'Networking',
  'Backend systems',
  'Open source',
  'Homelab',
];

export default function Hero() {
  return (
    <section className="relative min-h-[92svh] w-full overflow-hidden border-b border-border">
      <HeroBackground />

      <div className="section-shell relative z-10 grid min-h-[92svh] grid-cols-1 items-center gap-10 pt-28 pb-12 lg:grid-cols-[1.04fr_0.96fr] lg:pt-24">
        <div className="max-w-3xl">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-mint" />
              Jay Esquivel Jr.
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Online Software Engineer / Vancouver, BC
            </span>
          </div>

          <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.95] tracking-normal sm:text-6xl lg:text-7xl">
            Hi, I’m Jay.
          </h1>

          <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
            I’m an Online Software Engineer at 2K working on backend and client. In my spare time,
            I build open-source software and tools.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <a href="#projects">
                View Projects
                <ArrowDownRight className="size-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a href="https://github.com/jaysqvl" target="_blank" rel="noopener noreferrer">
                <GitBranch className="size-4" />
                GitHub
              </a>
            </Button>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4">
            {signals.map((signal) => (
              <div key={signal} className="rounded-md border border-border bg-card/72 px-3 py-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{signal}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <LabTerminal />
        </div>
      </div>
    </section>
  );
}
