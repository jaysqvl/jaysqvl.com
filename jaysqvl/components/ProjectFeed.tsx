'use client';

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { isProjectList, type ProjectItem } from '@/lib/projects';
import { applyProjectMetadata, resolveProjectRefresh } from '@/lib/project-metadata';

const cacheKey = 'jaysqvl-projects:v1';
const cacheLifetime = 30 * 24 * 60 * 60 * 1000;

function readSavedProjects(): ProjectItem[] | null {
  try {
    const saved = JSON.parse(localStorage.getItem(cacheKey) || 'null');
    const age = Date.now() - saved?.savedAt;
    if (typeof saved?.savedAt === 'number' && age >= 0 && age < cacheLifetime && isProjectList(saved.projects)) {
      return saved.projects;
    }
  } catch {
    // Storage may be unavailable; the server-rendered project list still works.
  }
  return null;
}

export default function ProjectFeed({ initialProjects, children }: {
  initialProjects: ProjectItem[];
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState(initialProjects);
  const [Cards, setCards] = useState<ComponentType<{ projects: ProjectItem[] }> | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let mounted = true;
    let started = false;
    let observer: IntersectionObserver | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const controller = new AbortController();

    const activate = () => {
      if (started) return;
      started = true;
      observer?.disconnect();
      const saved = readSavedProjects();
      if (saved) setProjects(applyProjectMetadata(initialProjects, saved, { includeMissing: true }));
      setRefreshing(true);

      // The card module and network request start together, only near this section.
      void import('./ProjectCards').then((module) => {
        if (mounted) setCards(() => module.default);
      }).catch(() => {
        // Keep the rendered cards if the optional client chunk cannot load.
      });

      timeout = setTimeout(() => controller.abort(), 12000);
      void fetch('/api/projects', { signal: controller.signal })
        .then(async (response) => {
          if (!response.ok) throw new Error('Project refresh failed');
          const result: unknown = await response.json();
          if (!mounted) return;
          if (!result || typeof result !== 'object' || !('projects' in result) || !('source' in result) || !isProjectList(result.projects)) return;
          if (result.source !== 'github' && result.source !== 'fallback') return;
          const refresh = resolveProjectRefresh(initialProjects, {
            projects: result.projects,
            source: result.source,
          }, saved);
          setProjects(refresh.projects);
          if (refresh.snapshot !== null) {
            try {
              localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), projects: refresh.snapshot }));
            } catch {
              // Refreshing does not depend on browser storage being enabled.
            }
          }
        })
        .catch(() => {
          // An outage must not replace the last successful list with an error.
        })
        .finally(() => {
          if (timeout) clearTimeout(timeout);
          if (mounted) setRefreshing(false);
        });
    };

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) activate();
      }, { rootMargin: '600px 0px' });
      observer.observe(root);
    } else {
      activate();
    }

    return () => {
      mounted = false;
      observer?.disconnect();
      controller.abort();
      if (timeout) clearTimeout(timeout);
    };
  }, [initialProjects]);

  return (
    <div ref={rootRef} aria-busy={refreshing}>
      {Cards ? <Cards projects={projects} /> : children}
    </div>
  );
}
