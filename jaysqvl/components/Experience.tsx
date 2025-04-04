'use client';

import { motion } from 'framer-motion';
import { Calendar, Briefcase, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import LogoOrIcon from '@/components/LogoOrIcon';

interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  technologies: string[];
  link?: string;
  logoSrc?: string;
}

const experiences: ExperienceItem[] = [
  {
    title: "Software Engineer",
    company: "OffroadExpert",
    location: "Vancouver, BC",
    period: "June 2024 – Present",
    description: [
      "Automated vendor product ingestion from vendor CSVs and hosting servers, scaling in-store product listings 300x",
      "Developed a Dockerized React and Tailwind front-end UI for cron scheduling endpoints, viewing logs, and managing configuration, enabling non-technical staff to interact with back-end services.",
      "Integrated four new REST API endpoints into the company’s existing product ingest and processing pipeline.",
      "Added LLM layer into product ingest pipeline standardizing web product display metadata for SEO/consistency.",
      "Facilitated migration to private cloud assisting design hardware and deploy software infra, reducing OPEX 50%.",
      "Developed custom react components in TypeScript with team for the company’s upcoming front-end overhaul."
    ],
    technologies: ["Python", "Bash", "Docker", "HTML", "CSS", "JavaScript", "Google Cloud Platform (GCP)"],
    link: "https://offroadexpert.shop",
    logoSrc: "/offroadexpert.jpg"
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
    logoSrc: "/jaysqvl.jpg"
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
              {/* Timeline dot with logo or icon */}
              <div className="mt-1.5 flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <LogoOrIcon 
                  logoSrc={experience.logoSrc || ''}
                  alt={`${experience.company} logo`}
                  icon={<Briefcase className="h-5 w-5 text-primary" />}
                  className="text-primary"
                />
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
                    <span className="text-sm sm:text-base">{experience.period}</span>
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