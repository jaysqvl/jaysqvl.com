'use client';

import { motion } from 'framer-motion';
import { Calendar, Briefcase, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  technologies: string[];
  link?: string;
}

const experiences: ExperienceItem[] = [
  {
    title: "Software Engineer",
    company: "OffroadExpert",
    location: "Vancouver, BC",
    period: "June 2024 – Present",
    description: [
      "Automated vendor product data entry and processing using a pipe and filter back-end architecture, scaling product ingestion capacity 300x and eliminating manual intervention.",
      "Developed dockerized, full-stack internal company tools combining React and TailwindCSS with Python to open product processing configuration to non-technical staff.",
      "Implemented an AI filter layer in the product processing pipeline incorporating OpenAI's batch-processing API, prompt-caching, and prompt engineering techniques to improve SEO cost-effectively.",
      "Designed and deployed private cloud infrastructure including networking, virtual machines, docker management, and VPN setup, ensuring system reliability and security while reducing cloud operational costs.",
      "Deployed OffRoadExpert.shop by leveraging Shopify's REST Admin API for back-end operations, front-end hosting, and e-commerce management tools to create a fully custom system.",
      "Actively developing a personalized front-end to optimize the user experience and align with business requirements."
    ],
    technologies: ["Python", "Bash", "Docker", "HTML", "CSS", "JavaScript", "Google Cloud Platform (GCP)"],
    link: "https://offroadexpert.shop"
  },
  {
    title: "Contract Software Developer",
    company: "Jaysqvl Solutions",
    location: "Vancouver, BC / Remote",
    period: "Sept 2020 – Present",
    description: [
      "Software consultations and development for small businesses including generative AI applications, web, cloud, networking, virtualization, containerization, security systems, and IT infrastructure.",
      "Developed REST APIs, full-stack web applications, and audited course content (debugging and testing) for various courses on Udemy and private platforms, contributing to teaching 3000+ students with a 4.5-star average rating.",
      "Provided private tutoring in Mathematics, Computer Science, and Data Science for university students."
    ],
    technologies: ["Python", "JavaScript", "React", "Node.js", "Docker", "Cloud Services", "AI/ML"],
  }
];

export default function Experience() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16" id="experience">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Experience</h2>
        <div className="w-20 h-1 bg-primary rounded"></div>
      </div>

      <div className="space-y-12">
        {experiences.map((experience, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            {/* Timeline connector */}
            {index < experiences.length - 1 && (
              <div className="absolute left-[19px] top-[52px] bottom-0 w-0.5 bg-muted-foreground/20"></div>
            )}
            
            <div className="flex gap-4">
              {/* Timeline dot */}
              <div className="mt-1.5 flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              
              {/* Content */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-semibold">{experience.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-muted-foreground">
                      <span className="font-medium">{experience.company}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{experience.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{experience.period}</span>
                    {experience.link && (
                      <a 
                        href={experience.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <ul className="list-disc pl-5 space-y-2">
                    {experience.description.map((item, i) => (
                      <li key={i} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {experience.technologies.map((tech, i) => (
                    <Badge key={i} variant="outline" className="bg-primary/5">{tech}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
} 