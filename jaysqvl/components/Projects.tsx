'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

// Import GitHubCallout with no SSR to avoid hydration errors
const GitHubCallout = dynamic(() => import('./GitHubCallout'), { ssr: false });

interface ProjectItem {
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  github?: string;
  demo?: string;
  featured?: boolean;
}

const projectsData: ProjectItem[] = [
  {
    title: "ExpensAI",
    description: "An AI-powered spending and financial management app that validates base64-encoded images, utilizes OpenAI's Vision API for classification, and generates personalized insights from transaction history.",
    technologies: ["Kotlin", "Python", "Google Cloud (GCP)", "Firebase", "OpenAI API"],
    github: "https://github.com/jaysqvl/",
    featured: true
  },
  {
    title: "Cardiolo",
    description: "Cardio stats tracking app with trained automatic activity classification using WEKA, integrated with Google Maps API to track activity routes, and featuring dynamic UI with co-routines and threading.",
    technologies: ["Kotlin", "Weka", "Google Cloud (GCP)", "Google Maps API"],
    github: "https://github.com/jaysqvl/",
    featured: true
  },
  {
    title: "Jaysqvl.com",
    description: "Portfolio website built with React.js and Next.js, deployed on Vercel, with automated deployment using GitHub Actions.",
    technologies: ["HTML", "CSS", "JavaScript", "React.js", "Next.js", "Vercel", "GitHub Actions"],
    github: "https://github.com/jaysqvl/jaysqvl.com",
    demo: "https://jaysqvl.com",
    featured: true
  },
  {
    title: "Impersonator",
    description: "Full-stack PDF ChatBot with polymorphic back-end supporting multiple LLMs, streamlined development environment via Dockerization, and front-end using Streamlit.",
    technologies: ["Python", "Langchain", "Docker", "Supabase", "Streamlit"],
    github: "https://github.com/jaysqvl/",
    featured: true
  },
  {
    title: "Decode",
    description: "Chrome extension for evaluating product sustainability while shopping, with an API that scrapes product pages, calculates sustainability scores, and returns insights.",
    technologies: ["HTML", "CSS", "JavaScript", "Python"],
    github: "https://github.com/jaysqvl/",
  },
  {
    title: "Divide and Conquer",
    description: "Socket-based rendition of the classic game with a token-based packet messaging system to reduce client-to-client latency 5x and server-side asynchronous client handling.",
    technologies: ["Java", "Sockets", "Java Swing"],
    github: "https://github.com/jaysqvl/",
  },
  {
    title: "PeerAdvice",
    description: "Full-stack peer-to-peer UBC advising platform with Flask-based back-end featuring GET and POST API endpoints, integrated with Google Authentication and Calendly.",
    technologies: ["HTML", "CSS", "JavaScript", "Flask", "PostgreSQL", "Firebase"],
    github: "https://github.com/jaysqvl/",
  },
  {
    title: "Hercules",
    description: "Gamified workout mobile-app developed using Java Android Library with optimized back-end data structures, reducing run-time memory usage by over 200%.",
    technologies: ["Java", "Android"],
    github: "https://github.com/jaysqvl/",
  }
];

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Set mounted state to handle client-side only rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Filter projects to show only featured ones initially
  const displayedProjects = showAll 
    ? projectsData 
    : projectsData.filter(project => project.featured);

  return (
    <section id="projects" className="w-full max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <div className="w-20 h-1 bg-primary rounded"></div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {displayedProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
              className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <div className="flex gap-2">
                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label={`GitHub repository for ${project.title}`}
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {project.demo && (
                      <a 
                        href={project.demo} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label={`Live demo for ${project.title}`}
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
                
                <p className="text-muted-foreground line-clamp-3 mb-4">{project.description}</p>
                
                {/* Spacer to push badges to bottom */}
                <div className="flex-grow"></div>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <Badge key={i} variant="outline" className="bg-primary/5">{tech}</Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* GitHub Callout - only show when all projects are displayed and client-side rendered */}
          {showAll && isMounted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GitHubCallout />
            </motion.div>
          )}
        </div>
        
        {/* Show More/Less Button */}
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => setShowAll(!showAll)}
            className="gap-2"
          >
            {showAll ? 'Show Less' : 'Show More Projects'}
          </Button>
        </div>
      </div>
    </section>
  );
} 