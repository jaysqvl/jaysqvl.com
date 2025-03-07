'use client';

import { useState, useEffect } from 'react';
import { Github, ExternalLink, Code, Star } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function GitHubCallout() {
  const [isMounted, setIsMounted] = useState(false);
  
  // Only render on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Don't render anything during SSR to avoid hydration errors
  if (!isMounted) {
    return null;
  }
  
  return (
    <div className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">Explore My Latest Projects</h3>
          <div className="flex gap-2">
            <a 
              href="https://github.com/jaysqvl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub profile"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <p className="text-muted-foreground line-clamp-3">
          Check out my GitHub for the latest developments, open-source contributions, and ongoing projects!
        </p>
        
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline" className="bg-primary/5 flex items-center gap-1">
            <Code className="h-3 w-3" />
            <span>Active Repositories</span>
          </Badge>
          <Badge variant="outline" className="bg-primary/5 flex items-center gap-1">
            <Star className="h-3 w-3" />
            <span>Open Source</span>
          </Badge>
        </div>
        
        <div className="pt-2">
          <Link 
            href="https://github.com/jaysqvl" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <span>Visit GitHub Profile</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
} 