'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from 'react';
import { domAnimation, LazyMotion, m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import styles from './LabTerminal.module.css';

interface Operation {
  command: string;
  prefix: string;
  output: string[];
}

// An illustrative configuration review, not commands executed against a server.
// The local image aliases and service names deliberately contain no private data.
const operations: Operation[] = [
  { command: 'docker compose config --services', prefix: 'docker compose', output: ['proxy', 'photos', 'sandbox'] },
  { command: 'git status --short --branch', prefix: 'git status', output: ['## main'] },
  { command: 'ls', prefix: 'ls', output: ['README.md  compose.yaml'] },
  { command: 'docker compose config --quiet', prefix: 'docker compose', output: [] },
  { command: 'docker compose config --images', prefix: 'docker compose', output: ['proxy:local', 'photos:local', 'sandbox:local'] },
  { command: 'docker compose config --networks', prefix: 'docker compose', output: ['homelab'] },
];

const timelines = operations.map(({ prefix }) => {
  const accept = 360 + prefix.length * 65;
  const complete = accept + 480;
  return { accept, complete, duration: complete + 1200 };
});
const cycleDuration = timelines.reduce((total, step) => total + step.duration, 0);
const emptySubscribe = () => () => {};

interface Playback {
  index: number;
  count: number;
  phase: 'typing' | 'accepted' | 'idle';
  history: number[];
}

const staticPlayback: Playback = { index: 0, count: 0, phase: 'idle', history: [0] };

function getPlayback(elapsed: number): Playback {
  const cycle = Math.floor(elapsed / cycleDuration);
  let position = elapsed % cycleDuration;
  let index = 0;
  while (position >= timelines[index].duration && index < operations.length - 1) {
    position -= timelines[index].duration;
    index += 1;
  }
  const { accept, complete } = timelines[index];
  const phase = position >= complete ? 'idle' : position >= accept ? 'accepted' : 'typing';
  const count = phase === 'accepted'
    ? operations[index].command.length
    : phase === 'idle' ? 0 : Math.min(operations[index].prefix.length, Math.max(0, Math.floor((position - 150) / 65)));
  const completed = cycle * operations.length + index - (phase === 'idle' ? 0 : 1);
  const history = [completed - 1, completed].filter(step => step >= 0);
  return { index, count, phase, history };
}

function Command({ text }: { text: string }) {
  const executableEnd = text.indexOf(' ');
  const split = executableEnd < 0 ? text.length : executableEnd;
  return <><span className={styles.executable}>{text.slice(0, split)}</span>{text.slice(split)}</>;
}

export default function LabTerminal() {
  const motionPreference = useReducedMotion();
  const reduceMotion = useSyncExternalStore(emptySubscribe, () => motionPreference, () => null);
  const [motionOptIn, setMotionOptIn] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [playback, setPlayback] = useState<Playback>(staticPlayback);
  const stageRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const elapsedRef = useRef(0);
  const pitch = useMotionValue(-2);
  const yaw = useMotionValue(-3);
  const rotateX = useSpring(pitch, { stiffness: 100, damping: 22 });
  const rotateY = useSpring(yaw, { stiffness: 100, damping: 22 });
  const motionEnabled = !reduceMotion || motionOptIn;
  const playing = motionEnabled && !manualPaused;
  const frame = motionEnabled ? playback : staticPlayback;
  const operation = operations[frame.index];
  const typed = operation.command.slice(0, frame.count);
  const suggestion = frame.phase === 'typing' && frame.count ? operation.command.slice(frame.count) : '';

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !playing) return;
    let visible = false;
    let raf = 0;
    let previousTime: number | null = null;
    let previousKey = '';

    const tick = (timestamp: number) => {
      if (!visible || document.hidden) return;
      elapsedRef.current += previousTime === null ? 0 : Math.min(timestamp - previousTime, 64);
      previousTime = timestamp;
      const next = getPlayback(elapsedRef.current);
      const key = `${next.index}:${next.count}:${next.phase}:${next.history.join(',')}`;
      if (key !== previousKey) {
        setPlayback(next);
        previousKey = key;
      }
      raf = window.requestAnimationFrame(tick);
    };
    const updateActivity = () => {
      window.cancelAnimationFrame(raf);
      previousTime = null;
      const active = visible && !document.hidden;
      stage.dataset.visible = String(active);
      if (active) raf = window.requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      updateActivity();
    }, { threshold: 0.15 });
    observer.observe(stage);
    document.addEventListener('visibilitychange', updateActivity);
    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener('visibilitychange', updateActivity);
      stage.dataset.visible = 'false';
    };
  }, [playing]);

  useEffect(() => {
    const line = lineRef.current;
    const content = contentRef.current;
    const status = statusRef.current;
    if (!line || !content || !status) return;
    const fitStatus = () => {
      status.style.visibility = 'hidden';
      const rects = Array.from(content.getClientRects());
      const limit = line.getBoundingClientRect().right - status.getBoundingClientRect().width - 8;
      if (rects.length === 1 && rects[0].right <= limit) status.style.visibility = 'visible';
    };
    fitStatus();
    const observer = new ResizeObserver(fitStatus);
    observer.observe(line);
    return () => observer.disconnect();
  }, [frame]);

  const movePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (!playing || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    pitch.set(-2 - y * 3);
    yaw.set(-3 + x * 4);
    event.currentTarget.style.setProperty('--light-x', `${35 + x * 22}%`);
    event.currentTarget.style.setProperty('--light-y', `${20 + y * 24}%`);
  };
  const resetPointer = () => {
    pitch.set(-2);
    yaw.set(-3);
    stageRef.current?.style.setProperty('--light-x', '35%');
    stageRef.current?.style.setProperty('--light-y', '20%');
  };
  const toggleMotion = () => {
    if (!motionEnabled) {
      elapsedRef.current = 0;
      setMotionOptIn(true);
      setManualPaused(false);
    } else {
      setManualPaused(paused => !paused);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div
        ref={stageRef}
        className={styles.stage}
        data-playing={playing}
        data-motion-opt-in={motionOptIn}
        data-operation={operation.command}
        data-phase={frame.phase}
        onPointerMove={movePointer}
        onPointerLeave={resetPointer}
      >
        <div className={styles.float}>
          <m.article className={styles.window} style={{ rotateX, rotateY }} aria-labelledby="homelab-console-title">
            <div className={styles.bar}>
              <span className={styles.lights} aria-hidden="true"><span /><span /><span /></span>
              <h2 id="homelab-console-title">Homelab — zsh</h2>
              <button type="button" className={styles.motionToggle} onClick={toggleMotion} aria-label={playing ? 'Pause terminal animation' : 'Play terminal animation'}>
                {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
              </button>
            </div>
            <div className={styles.screen} aria-hidden="true">
              <div className={styles.history} data-terminal-history>
                {frame.history.map(step => {
                  const previous = operations[step % operations.length];
                  return (
                    <div key={step} className={styles.historyEntry}>
                      <div className={styles.historyCommand}><span className={styles.transient}>❯</span> <Command text={previous.command} /></div>
                      {previous.output.length > 0 && <div className={styles.output}>{previous.output.join('\n')}</div>}
                    </div>
                  );
                })}
              </div>
              <div ref={lineRef} className={styles.active}>
                <span ref={contentRef} className={styles.promptContent}>
                  <span className={styles.segments}><span className={styles.directory}>~<span className={styles.slash}>/</span>homelab</span><span className={styles.divider}></span><span className={styles.branch}>main</span></span>{' '}
                  <span className={styles.entry}><Command text={typed} /><span className={styles.cursor} data-terminal-cursor /><span className={styles.suggestion}>{suggestion}</span></span>
                </span>
                <span ref={statusRef} className={styles.status}>✔</span>
              </div>
            </div>
            <p className="sr-only">An illustrative zsh and Powerlevel10k session showing Compose configuration, file listings, and Git checks with generic sample output.</p>
            <div className={styles.footer}>
              <p>Photos, backups, and the tools I host at home.</p>
              <a href="#lab">Explore the setup <ArrowUpRight aria-hidden="true" /></a>
            </div>
            <div className={styles.reflection} aria-hidden="true" />
          </m.article>
        </div>
      </div>
    </LazyMotion>
  );
}
