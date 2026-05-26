'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export interface TerminalLine {
  command: string;
  output: string;
  tone?: 'mint' | 'blue' | 'lavender' | 'amber';
}

const terminalLines: TerminalLine[] = [
  {
    command: 'sync photos -> personal-cloud',
    output: 'phone library mirrored to server-backed storage',
    tone: 'mint',
  },
  {
    command: 'route https via npm-proxy',
    output: 'Nginx Proxy Manager handles the public-safe edge',
    tone: 'blue',
  },
  {
    command: 'compose up lab-tools',
    output: 'Docker services staged for notes, automations, dashboards',
    tone: 'lavender',
  },
  {
    command: 'index notes for ai-sandbox',
    output: 'local experiments queued for retrieval workflows',
    tone: 'amber',
  },
  {
    command: 'wake smart-home bridge',
    output: 'events handed to the automation layer',
    tone: 'mint',
  },
];

const prompt = 'jay@home-server';

export default function LabTerminal() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % terminalLines.length);
    }, 2600);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  const visibleHistory = useMemo(() => {
    const start = Math.max(0, activeIndex - 2);
    return terminalLines.slice(start, activeIndex + 1);
  }, [activeIndex]);

  const activeLine = terminalLines[activeIndex];

  return (
    <div className="lab-terminal" aria-label="Public-safe homelab terminal animation">
      <div className="lab-terminal__bar" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="lab-terminal__screen">
        <div className="lab-terminal__history" aria-hidden={!reduceMotion}>
          {reduceMotion ? (
            terminalLines.slice(0, 3).map((line) => (
              <TerminalRow key={line.command} line={line} />
            ))
          ) : (
            <AnimatePresence initial={false} mode="popLayout">
              {visibleHistory.map((line) => (
                <motion.div
                  key={line.command}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                >
                  <TerminalRow line={line} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="lab-terminal__active">
          <span className="text-muted-foreground">{prompt}</span>
          <span className="text-muted-foreground">:</span>
          <span>~</span>
          <span className="text-muted-foreground">$</span>
          <span className={`terminal-tone terminal-tone--${activeLine.tone || 'mint'}`}>{activeLine.command}</span>
          {!reduceMotion && <span className="terminal-cursor" aria-hidden="true" />}
        </div>
      </div>
    </div>
  );
}

function TerminalRow({ line }: { line: TerminalLine }) {
  return (
    <div className="lab-terminal__row">
      <span className={`status-dot status-dot--inline bg-${line.tone || 'mint'}`} />
      <span className="truncate text-muted-foreground">{line.output}</span>
    </div>
  );
}
