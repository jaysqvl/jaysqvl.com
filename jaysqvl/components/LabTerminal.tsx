'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from 'react';
import { domAnimation, LazyMotion, m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import styles from './LabTerminal.module.css';

interface Operation {
  command: string;
  prefix: string;
  output: string[];
  directory: string;
  context: string;
}

const local = { directory: '~/homelab', context: 'main' };
const nas = { directory: '~', context: 'nas' };
const gateway = { directory: '~', context: 'gateway' };
const app = { directory: '~/code/app', context: 'main' };
const desktop = { directory: '~/code/desktop', context: 'main' };

// Curated demo transcripts only: these commands are never executed by the site.
// Hosts, containers, paths, addresses, counts and timings are fictional.
const operations: Operation[] = [
  { ...local, command: 'tailscale up', prefix: 'tailscale', output: [] },
  { ...local, command: 'tailscale netcheck', prefix: 'tailscale', output: [
    'Report:',
    '  * UDP: true',
    '  * IPv4: yes, 192.0.2.20:41641',
    '  * IPv6: no, but OS has support',
    '  * MappingVariesByDestIP: false',
    '  * PortMapping:',
  ] },
  { ...local, command: 'tailscale ping --c 1 nas', prefix: 'tailscale ping', output: [
    'pong from nas (100.64.0.10) via 192.0.2.10:41641 in 4ms',
  ] },
  { ...local, command: 'ssh nas', prefix: 'ssh', output: [] },
  { ...nas, command: "docker stats --no-stream --format 'table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemPerc}}' app worker cache", prefix: 'docker stats', output: [
    'NAME     CPU %   MEM %',
    'app      0.42%   1.18%',
    'worker   2.16%   3.64%',
    'cache    0.08%   0.24%',
  ] },
  { ...nas, command: 'docker exec proxy nginx -t', prefix: 'docker exec', output: [
    'nginx: the configuration file /etc/nginx/nginx.conf syntax is ok',
    'nginx: configuration file /etc/nginx/nginx.conf test is successful',
  ] },
  { ...nas, command: 'docker exec media ffprobe -v error -show_entries stream=codec_name,width,height /samples/sample.mp4', prefix: 'docker exec', output: [
    '[STREAM]',
    'codec_name=h264',
    'width=1920',
    'height=1080',
    '[/STREAM]',
    '[STREAM]',
    'codec_name=aac',
    '[/STREAM]',
  ] },
  { ...nas, command: 'exit', prefix: 'exit', output: ['Connection to nas closed.'] },
  { ...local, command: 'ssh gateway', prefix: 'ssh', output: [] },
  { ...gateway, command: 'configctl unbound status', prefix: 'configctl unbound', output: [
    'unbound is running as pid 4128.',
  ] },
  { ...gateway, command: 'configctl unbound stats | jq \'.total.num\'', prefix: 'configctl unbound', output: [
    '{',
    '  "queries": "8640",',
    '  "cachehits": "7192",',
    '  "cachemiss": "1448",',
    '  "prefetch": "216"',
    '}',
  ] },
  { ...gateway, command: 'cscli metrics show parsers', prefix: 'cscli metrics', output: [
    'Parser Metrics',
    '┌───────────────────────────┬──────┬────────┬──────────┐',
    '│ Name                      │ Hits │ Parsed │ Unparsed │',
    '├───────────────────────────┼──────┼────────┼──────────┤',
    '│ crowdsecurity/syslog-logs │ 1.2k │ 1.2k   │ -        │',
    '└───────────────────────────┴──────┴────────┴──────────┘',
  ] },
  { ...gateway, command: 'exit', prefix: 'exit', output: ['Connection to gateway closed.'] },
  { ...local, command: 'cd ~/code/app', prefix: 'cd', output: [] },
  { ...app, command: 'make build', prefix: 'make', output: [
    './scripts/build.sh',
    '✓ 286 modules transformed.',
    'dist/index.html  0.47 kB',
    '✓ built in 1.12s',
    'Built bin/jotist. Run ./bin/jotist to start the server.',
  ] },
  { ...app, command: 'make test', prefix: 'make', output: [
    'go tool gotestsum --format pkgname -- ./...',
    '✓ scriberr/internal/cli (0.184s)',
    '✓ scriberr/internal/transcription (0.422s)',
    '✓ scriberr/internal/api (0.206s)',
    'DONE 48 tests in 1.204s',
  ] },
  { ...app, command: 'cd ../desktop', prefix: 'cd', output: [] },
  { ...desktop, command: 'npm test', prefix: 'npm', output: [
    '> desktop-app test',
    '> vitest run',
    '✓ src/game.test.ts (8 tests)',
    'Test Files  1 passed (1)',
    '     Tests  8 passed (8)',
    '  Duration  624ms',
  ] },
  { ...desktop, command: 'npm run tauri build', prefix: 'npm run tauri', output: [
    '> tauri build',
    '   Compiling desktop-app v0.1.0',
    '    Finished release profile [optimized]',
    '    Bundling desktop-app.app',
    '    Finished 1 bundle',
  ] },
  { ...desktop, command: 'cd ~/homelab', prefix: 'cd', output: [] },
];

const timelines = operations.map(({ prefix, output }) => {
  const accept = 360 + prefix.length * 65;
  const complete = accept + 480;
  return { accept, complete, duration: complete + Math.max(1200, output.length * 90 + 600) };
});
const cycleDuration = timelines.reduce((total, step) => total + step.duration, 0);
const emptySubscribe = () => () => {};

interface Playback {
  index: number;
  count: number;
  phase: 'typing' | 'accepted' | 'output' | 'idle';
  outputCount: number;
  history: number[];
}

const staticPlayback: Playback = { index: 4, count: 0, phase: 'idle', outputCount: 4, history: [2, 3, 4] };

function getPlayback(elapsed: number): Playback {
  const cycle = Math.floor(elapsed / cycleDuration);
  let position = elapsed % cycleDuration;
  let index = 0;
  while (position >= timelines[index].duration && index < operations.length - 1) {
    position -= timelines[index].duration;
    index += 1;
  }
  const { accept, complete } = timelines[index];
  const outputCount = Math.min(operations[index].output.length, Math.max(0, Math.floor((position - complete) / 90) + 1));
  const outputEnd = complete + Math.max(1, operations[index].output.length) * 90;
  const phase = position >= outputEnd ? 'idle' : position >= complete ? 'output' : position >= accept ? 'accepted' : 'typing';
  const count = phase === 'accepted'
    ? operations[index].command.length
    : phase === 'idle' || phase === 'output' ? 0 : Math.min(operations[index].prefix.length, Math.max(0, Math.floor((position - 150) / 65)));
  const completed = cycle * operations.length + index - (phase === 'idle' || phase === 'output' ? 0 : 1);
  // Keep scrollback across command and cycle boundaries instead of replacing the screen.
  const first = Math.max(0, completed - 23);
  const history = Array.from({ length: Math.max(0, completed - first + 1) }, (_, offset) => first + offset);
  return { index, count, phase, outputCount, history };
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
  const [playback, setPlayback] = useState<Playback>(() => getPlayback(0));
  const stageRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const elapsedRef = useRef(0);
  const pitch = useMotionValue(0);
  const yaw = useMotionValue(0);
  const rotateX = useSpring(pitch, { stiffness: 100, damping: 22 });
  const rotateY = useSpring(yaw, { stiffness: 100, damping: 22 });
  const motionEnabled = !reduceMotion || motionOptIn;
  const playing = motionEnabled && !manualPaused;
  const frame = motionEnabled ? playback : staticPlayback;
  const operation = operations[frame.index];
  const directorySplit = operation.directory.indexOf('/');
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
      const key = `${next.index}:${next.count}:${next.phase}:${next.outputCount}:${next.history.join(',')}`;
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
    const screen = screenRef.current;
    const transcript = transcriptRef.current;
    if (!screen || !transcript) return;
    let previousEnd = -1;
    const followOutput = () => {
      const end = Math.max(0, screen.scrollHeight - screen.clientHeight);
      if (end === previousEnd) return;
      previousEnd = end;
      screen.scrollTo({ top: end, behavior: playing ? 'smooth' : 'instant' });
    };
    const observer = new ResizeObserver(followOutput);
    observer.observe(screen);
    observer.observe(transcript);
    followOutput();
    return () => observer.disconnect();
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
    pitch.set(-y * 1.2);
    yaw.set(x * 1.5);
    event.currentTarget.style.setProperty('--light-x', `${35 + x * 22}%`);
    event.currentTarget.style.setProperty('--light-y', `${20 + y * 24}%`);
  };
  const resetPointer = () => {
    pitch.set(0);
    yaw.set(0);
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
        <m.article className={styles.window} style={{ rotateX, rotateY }} aria-labelledby="homelab-console-title">
          <div className={styles.bar}>
            <span className={styles.lights} aria-hidden="true"><span /><span /><span /></span>
            <h2 id="homelab-console-title">Homelab — zsh</h2>
            <button type="button" className={styles.motionToggle} onClick={toggleMotion} aria-label={playing ? 'Pause terminal animation' : 'Play terminal animation'}>
              {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            </button>
          </div>
          <div ref={screenRef} className={styles.screen} data-terminal-screen aria-hidden="true">
            <div ref={transcriptRef} className={styles.transcript}>
              <div className={styles.history} data-terminal-history>
                {frame.history.map(step => {
                  const previous = operations[step % operations.length];
                  const output = frame.phase === 'output' && step === frame.history.at(-1)
                    ? previous.output.slice(0, frame.outputCount) : previous.output;
                  return (
                    <div key={step} className={styles.historyEntry} data-step={step}>
                      <div className={styles.historyCommand}><span className={styles.transient}>❯</span> <Command text={previous.command} /></div>
                      {output.length > 0 && <div className={styles.output}>{output.join('\n')}</div>}
                    </div>
                  );
                })}
              </div>
              <div ref={lineRef} className={styles.active} hidden={frame.phase === 'output'}>
                <span ref={contentRef} className={styles.promptContent}>
                  <span className={styles.segments}><span className={styles.directory}>{directorySplit < 0 ? operation.directory : <>{operation.directory.slice(0, directorySplit)}<span className={styles.slash}>/</span>{operation.directory.slice(directorySplit + 1)}</>}</span><span className={styles.divider}></span><span className={styles.branch}>{operation.context}</span></span>{' '}
                  <span className={styles.entry}><Command text={typed} /><span className={styles.cursor} data-terminal-cursor /><span className={styles.suggestion}>{suggestion}</span></span>
                </span>
                <span ref={statusRef} className={styles.status}>✔</span>
              </div>
            </div>
          </div>
          <p className="sr-only">An illustrative terminal session showing Tailscale, DNS, CrowdSec, container checks, media inspection, and software builds. All output is fictional sample data.</p>
          <div className={styles.footer}>
            <p>Networking, projects, and the tools I host at home.</p>
            <a href="#lab">Explore the setup <ArrowUpRight aria-hidden="true" /></a>
          </div>
          <div className={styles.reflection} aria-hidden="true" />
        </m.article>
      </div>
    </LazyMotion>
  );
}
