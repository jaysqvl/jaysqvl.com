import Image from 'next/image';
import { ArrowDownRight, FileText, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="w-full border-b border-border">
      <div className="section-shell grid items-center gap-12 pt-32 pb-16 sm:pb-20 lg:min-h-[84svh] lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:pt-28">
        <div className="max-w-2xl">
          <p className="mb-6 text-sm text-muted-foreground">Software engineer · Vancouver, BC</p>
          <h1 className="text-balance text-6xl font-semibold leading-none sm:text-7xl lg:text-8xl">
            Hi, I’m Jay.
          </h1>
          <p className="mt-7 text-pretty text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
            I work on networking and online backend systems at 2K. In my spare time, I build open-source software and tools.
          </p>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            I also maintain a homelab for photos, backups, and side projects.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <a href="#projects">
                View projects
                <ArrowDownRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a href="https://github.com/jaysqvl" target="_blank" rel="noopener noreferrer">
                <GitBranch className="size-4" aria-hidden="true" />
                GitHub
              </a>
            </Button>
          </div>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <FileText className="size-4" aria-hidden="true" />
            Read my résumé
          </a>
        </div>

        <figure className="w-full max-w-md justify-self-center lg:justify-self-end">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src="/profile.jpg"
              alt="Jay outdoors in the mountains"
              fill
              priority
              sizes="(min-width: 1024px) 420px, (min-width: 480px) 448px, calc(100vw - 32px)"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-sm text-muted-foreground">Jay Esquivel Jr.</figcaption>
        </figure>
      </div>
    </section>
  );
}
