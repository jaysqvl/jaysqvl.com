'use client';

import { useEffect, useId, useRef } from 'react';
import styles from './HeroBackground.module.css';

const points = [
  [64, 128], [128, 128], [128, 192],
  [320, 64], [384, 64], [384, 128],
  [256, 320], [320, 320],
];

export default function HeroBackground() {
  const id = useId();
  const backgroundRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const background = backgroundRef.current;
    const spotlight = spotlightRef.current;
    const hero = background?.parentElement;
    if (!background || !spotlight || !hero) return;

    const media = window.matchMedia(
      '(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    const bounds = hero.getBoundingClientRect();
    let visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
    let frame: number | null = null;
    let pointer: { x: number; y: number } | null = null;

    const clear = () => {
      pointer = null;
      background.removeAttribute('data-active');
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
    };

    const draw = () => {
      frame = null;
      if (!pointer) return;
      const rect = background.getBoundingClientRect();
      spotlight.setAttribute('cx', String(pointer.x - rect.left));
      spotlight.setAttribute('cy', String(pointer.y - rect.top));
      background.setAttribute('data-active', 'true');
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      pointer = { x: event.clientX, y: event.clientY };
      // Coalesce pointer events; no animation loop runs while the pointer is idle.
      if (frame === null) frame = window.requestAnimationFrame(draw);
    };

    const syncInput = () => {
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', clear);
      clear();
      if (!media.matches || !visible || document.hidden) return;
      hero.addEventListener('pointermove', move, { passive: true });
      hero.addEventListener('pointerleave', clear);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncInput();
    });
    observer.observe(hero);
    media.addEventListener('change', syncInput);
    document.addEventListener('visibilitychange', syncInput);
    // A stationary cursor should not leave a highlight pinned while scrolling.
    window.addEventListener('scroll', clear, { passive: true });
    syncInput();

    return () => {
      clear();
      observer.disconnect();
      media.removeEventListener('change', syncInput);
      document.removeEventListener('visibilitychange', syncInput);
      window.removeEventListener('scroll', clear);
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', clear);
    };
  }, []);

  return (
    <div ref={backgroundRef} className={styles.background} aria-hidden="true">
      <svg className={styles.drawing} width="100%" height="100%" focusable="false">
        <defs>
          <pattern id={`${id}-grid`} width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M64 0H0V64" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <pattern id={`${id}-nodes`} width="512" height="384" patternUnits="userSpaceOnUse">
            <path d="M64 128H128V192 M320 64H384V128 M256 320H320" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />
            {points.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="currentColor" />)}
          </pattern>
          <radialGradient id={`${id}-falloff`}>
            <stop offset="0" stopColor="white" />
            <stop offset="0.35" stopColor="white" stopOpacity="0.8" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id={`${id}-focus`} x="0" y="0" width="100%" height="100%" maskUnits="userSpaceOnUse">
            <circle ref={spotlightRef} cx="-1000" cy="-1000" r="170" fill={`url(#${id}-falloff)`} />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id}-grid)`} className={styles.grid} />
        <rect width="100%" height="100%" fill={`url(#${id}-nodes)`} className={styles.nodes} />
        <rect width="100%" height="100%" fill={`url(#${id}-nodes)`} mask={`url(#${id}-focus)`} className={styles.response} />
      </svg>
    </div>
  );
}
