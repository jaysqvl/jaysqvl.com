import Image from 'next/image';
import Link from 'next/link';
import { Github, Linkedin, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="min-h-[80vh] w-full flex flex-col items-center justify-center gap-8 px-4">
      <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary/10">
        <Image
          src="/profile.jpg"
          alt="Profile picture"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Jay Esquivel Jr.
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground">
          Software Engineer
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/resume.pdf" target="_blank" className="gap-2">
            <FileText size={20} />
            Resume
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="https://github.com/jaysqvl" target="_blank" className="gap-2">
            <Github size={20} />
            GitHub
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="https://linkedin.com/in/jaysqvl" target="_blank" className="gap-2">
            <Linkedin size={20} />
            LinkedIn
          </Link>
        </Button>
      </div>
    </section>
  );
} 