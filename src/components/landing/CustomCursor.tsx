'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Soft dual-ring cursor for the marketing surface.
 * Disabled on touch / coarse pointers and when reduced motion is preferred.
 */
export const CustomCursor: React.FC = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const hovering = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const raf = useRef<number>(0);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    setEnabled(true);
    document.documentElement.classList.add('mm-custom-cursor');

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const interactive = el.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor="magnetic"]'
      );
      hovering.current = !!interactive;
    };

    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;

      if (ringRef.current) {
        const s = hovering.current ? 1.55 : 1;
        ringRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) scale(${s})`;
        ringRef.current.style.borderColor = hovering.current
          ? 'rgba(251, 191, 36, 0.7)'
          : 'rgba(251, 113, 133, 0.5)';
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%)`;
        dotRef.current.style.opacity = hovering.current ? '0.35' : '1';
      }
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove('mm-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 rounded-full border border-rose-400/50 mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.65)]"
        style={{ willChange: 'transform' }}
      />
    </>
  );
};
