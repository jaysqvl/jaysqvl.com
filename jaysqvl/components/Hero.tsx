import Image from 'next/image';
import Link from 'next/link';
import { Github, Linkedin, FileText, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Hero() {
  return (
    <section className="w-full min-h-screen flex flex-col justify-center items-center px-4 py-12">
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/10 mb-8">
        <Image
          src="/profile.jpg"
          alt="Profile picture"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Jay Esquivel Jr.
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground">
          Software Engineer
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mb-8">
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

      <Alert className="w-full max-w-lg bg-primary/5 border-primary/10 mt-4">
        <Coffee className="h-4 w-4" />
        <AlertTitle>Welcome!</AlertTitle>
        <AlertDescription>
          Here's a virtual coffee for your visit ☕
        </AlertDescription>
      </Alert>
    </section>
  );
} 