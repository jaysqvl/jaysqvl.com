'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Contact() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 bg-muted/30" id="contact">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Get In Touch</h2>
        <div className="w-20 h-1 bg-primary rounded"></div>
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <p className="text-muted-foreground mb-8">
          I'm currently open to new opportunities and collaborations. Whether you have a question, a project idea, 
          or just want to say hi, feel free to reach out!
        </p>

        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0 }}
            className="col-span-1"
          >
            <a 
              href="/resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block h-full"
            >
              <Button variant="outline" className="w-full h-full py-4 sm:py-6 flex flex-col gap-1 sm:gap-2 px-1 sm:px-3">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xs sm:text-sm whitespace-nowrap">Resume</span>
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-1"
          >
            <a 
              href="https://github.com/jaysqvl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block h-full"
            >
              <Button variant="outline" className="w-full h-full py-4 sm:py-6 flex flex-col gap-1 sm:gap-2 px-1 sm:px-3">
                <Github className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xs sm:text-sm whitespace-nowrap">GitHub</span>
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-1"
          >
            <a 
              href="https://linkedin.com/in/jaysqvl/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block h-full"
            >
              <Button variant="outline" className="w-full h-full py-4 sm:py-6 flex flex-col gap-1 sm:gap-2 px-1 sm:px-3">
                <Linkedin className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xs sm:text-sm whitespace-nowrap">LinkedIn</span>
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="col-span-1"
          >
            <a 
              href="mailto:jaysqvl@gmail.com" 
              className="block h-full"
            >
              <Button variant="outline" className="w-full h-full py-4 sm:py-6 flex flex-col gap-1 sm:gap-2 px-1 sm:px-3">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xs sm:text-sm whitespace-nowrap">Email</span>
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-1"
          >
            <a 
              href="tel:+17789911371" 
              className="block h-full"
            >
              <Button variant="outline" className="w-full h-full py-4 sm:py-6 flex flex-col gap-1 sm:gap-2 px-1 sm:px-3">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xs sm:text-sm whitespace-nowrap">Phone</span>
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 