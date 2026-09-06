import Hero from '@/components/Hero';
import AboutMe from '@/components/AboutMe';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Hero />
      <AboutMe />
      <Experience />
      <Education />
      <Projects />
      <Contact />
    </main>
  );
}
