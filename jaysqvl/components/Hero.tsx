'use client';

import { motion } from 'framer-motion';
import { ArrowDown, FileText, Github, Linkedin, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import ParticleBackground from './ParticleBackground';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const nameRef = useRef<HTMLSpanElement>(null);
  
  // Function to scroll to the about section
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Text scramble effect for the name
  useEffect(() => {
    if (!nameRef.current) return;
    
    // Store a reference to the current DOM node to use in the cleanup function
    const nameElement = nameRef.current;
    
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let iteration = 0;
    let interval: NodeJS.Timeout | null = null;
    
    const originalText = nameElement.dataset.value || nameElement.innerText;
    
    const scramble = () => {
      if (!nameElement) return;
      
      interval = setInterval(() => {
        nameElement.innerText = originalText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return letters[Math.floor(Math.random() * 26)];
          })
          .join("");
        
        if (iteration >= originalText.length) {
          clearInterval(interval!);
        }
        
        iteration += 1/3;
      }, 30);
    };
    
    // Initial scramble
    scramble();
    
    // Scramble on hover
    const handleMouseEnter = () => {
      if (interval) clearInterval(interval);
      iteration = 0;
      scramble();
    };
    
    nameElement.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      if (interval) clearInterval(interval);
      // Use the stored reference in the cleanup function
      nameElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />
      
      <div className="container px-4 z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {/* Profile Picture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative profile-picture-container"
          >
            <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-primary/20">
              <Image
                src="/profile.jpg" // Make sure to add your profile picture to the public folder
                alt="Jay's profile picture"
                fill
                className={`object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                priority
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              )}
            </div>
            
            {/* Animated ring around profile picture */}
            <motion.div 
              className="absolute -inset-3 rounded-full border-2 border-primary/30"
              animate={{ 
                boxShadow: ['0 0 0 0 rgba(var(--primary-rgb), 0.2)', '0 0 0 10px rgba(var(--primary-rgb), 0)'],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: 'loop'
              }}
            />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center md:text-left space-y-4 hero-text-container"
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Hi, I&apos;m <span 
                ref={nameRef} 
                data-value="Jay" 
                className="text-primary cursor-pointer"
              >
                Jay
              </span>
            </motion.h1>
            
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl font-medium text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Software Engineer
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-md relative z-30"
            >
              <Alert className="bg-background backdrop-blur-sm shadow-md isolate">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Welcome!</AlertTitle>
                <AlertDescription>
                  Here&apos;s a coffee for your stay ☕<br />
                  Play around and enjoy!
                </AlertDescription>
              </Alert>
            </motion.div>
            
            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="flex flex-wrap gap-3 justify-center md:justify-start relative z-30"
            >
              <Button variant="outline" size="sm" asChild className="backdrop-blur-sm bg-background/100 shadow-md isolate">
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Resume
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild className="backdrop-blur-sm bg-background/100 shadow-md isolate">
                <a href="https://github.com/jaysqvl" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild className="backdrop-blur-sm bg-background/100 shadow-md isolate">
                <a href="https://linkedin.com/in/jaysqvl" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-4 relative z-30"
            >
              <Button 
                size="lg" 
                onClick={scrollToAbout}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative group hero-button backdrop-blur-sm bg-primary/100 shadow-md isolate"
              >
                <span>Explore My Work</span>
                <motion.div
                  animate={{ y: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2"
                >
                  <ArrowDown className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
          opacity: { delay: 1.5, duration: 1 },
          y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
        }}
      >
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </motion.div>
    </section>
  );
} 