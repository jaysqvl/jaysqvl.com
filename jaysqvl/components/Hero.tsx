import Image from 'next/image';
import {
  ArrowDownRight,
  FileText,
  Github,
  Linkedin,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LabTerminal from '@/components/LabTerminal';

const signals = [
  'Backend systems',
  'AI tooling',
  'Cloud workflows',
  'Homelab infra',
];

export default function Hero() {
  return (
    <section className="relative min-h-[92svh] w-full overflow-hidden border-b border-border">
      <div className="ambient-grid" aria-hidden="true" />

      <div className="section-shell relative z-10 grid min-h-[92svh] items-center gap-10 pt-28 pb-12 lg:grid-cols-[1.04fr_0.96fr] lg:pt-24">
        <div className="max-w-3xl">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-mint" />
              Jay Esquivel Jr.
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Software Engineer / Vancouver, BC
            </span>
          </div>

          <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.95] tracking-normal sm:text-6xl lg:text-7xl">
            Software for messy real-world systems.
          </h1>

          <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
            I build backend automation, AI-backed tools, cloud workflows, and practical interfaces shaped by the same
            curiosity that keeps my homelab changing.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <a href="#projects">
                View Projects
                <ArrowDownRight className="size-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                <FileText className="size-4" />
                Resume PDF
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a href="https://github.com/jaysqvl" target="_blank" rel="noopener noreferrer">
                <Github className="size-4" />
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
          <div className="control-panel">
            <div className="flex items-start justify-between gap-4 border-b border-border p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="relative size-14 overflow-hidden rounded-md border border-border bg-muted">
                  <Image
                    src="/profile.jpg"
                    alt="Jay Esquivel Jr."
                    fill
                    priority
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">public profile</p>
                  <p className="mt-1 text-lg font-semibold">Software Engineer @ 2K</p>
                </div>
              </div>
              <a
                href="https://linkedin.com/in/jaysqvl"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="size-4" />
              </a>
            </div>

            <div className="p-4 sm:p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">server console</p>
                  <h2 className="mt-1 text-2xl font-semibold">A server doing real work.</h2>
                </div>
                <Terminal className="size-5 text-muted-foreground" />
              </div>

              <LabTerminal />

              <div className="mt-6 rounded-md border border-border bg-muted/40 p-4">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  capabilities, not telemetry
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Photo storage, NAS duty, Docker services, AI experiments, smart-home hooks, and Nginx Proxy Manager
                  routes. The private bits stay private.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
