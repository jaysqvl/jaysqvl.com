import Hero from '@/components/Hero';
import AboutMe from '@/components/AboutMe';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Hero />
      <AboutMe />
    </main>
  );
}
