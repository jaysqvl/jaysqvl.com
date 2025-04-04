'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';
import LogoOrIcon from '@/components/LogoOrIcon';

interface EducationItem {
  institution: string;
  degree: string;
  location: string;
  period: string;
  activities?: string[];
  relevantCoursework?: string;
  logoSrc?: string;
}

const educationData: EducationItem[] = [
  {
    institution: "Simon Fraser University",
    degree: "Bachelor of Applied Science, Computer Science - Software Systems",
    location: "Burnaby, BC",
    period: "Sept 2022 – Present",
    relevantCoursework: "Algorithms II, Computer Architecture & Security, Operating Systems, Computer Networks, Software Engineering, Cloud Computing, Test, Intelligent Systems, Database, UI Design, Mobile App Development",
    logoSrc: "/sfu.jpg"
  },
  {
    institution: "University of British Columbia",
    degree: "Bachelor of Science, Computer Science & Mathematics",
    location: "Vancouver, BC",
    period: "Sept 2020 – Aug 2022",
    relevantCoursework: "Data Structures & Algorithms, Test, Artificial Intelligence, Machine Learning, Deep Learning and Neural Nets, Data-Science, Computer Security, Discrete Mathematics, Linear Algebra and Calculus",
    activities: [
      "UBC CVC Social Club External Relations Executive",
      "Event Planning for ~700 Members",
      "Maintain and Develop Brand Sponsorships",
      "Social Media Management"
    ],
    logoSrc: "/ubc.jpg"
  }
];

export default function Education() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 bg-muted/30" id="education">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Education</h2>
        <div className="w-20 h-1 bg-primary rounded"></div>
      </div>

      <div className="space-y-12">
        {educationData.map((education, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            {/* Timeline connector */}
            {index < educationData.length - 1 && (
              <div className="absolute left-[19px] top-[52px] bottom-0 w-0.5 bg-muted-foreground/20"></div>
            )}
            
            <div className="flex gap-4">
              {/* Timeline dot with logo or icon */}
              <div className="mt-1.5 flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <LogoOrIcon 
                  logoSrc={education.logoSrc || ''}
                  alt={`${education.institution} logo`}
                  icon={<GraduationCap className="h-5 w-5 text-primary" />}
                  className="text-primary"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-semibold">{education.institution}</h3>
                    <p className="text-muted-foreground font-medium">{education.degree}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm sm:text-base">{education.period}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm sm:text-base">{education.location}</span>
                    </div>
                  </div>
                </div>
                
                {education.relevantCoursework && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Relevant Coursework</h4>
                    <p className="text-muted-foreground">{education.relevantCoursework}</p>
                  </div>
                )}
                
                {education.activities && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Activities & Involvement</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {education.activities.map((activity, i) => (
                        <li key={i} className="text-muted-foreground">{activity}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
} 