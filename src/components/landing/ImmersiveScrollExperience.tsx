'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Download } from 'lucide-react';
import { ImmersiveScrollScene } from './ImmersiveScrollScene';
import { Button } from '../shared/Button';
import { MeetMindLogo } from '../shared/MeetMindLogo';

export const ImmersiveScrollExperience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lowPower, setLowPower] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.35,
  });

  useEffect(() => {
    setMounted(true);
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      const cores = navigator.hardwareConcurrency || 4;
      const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;
      setLowPower(cores <= 4 || mem <= 4 || window.innerWidth < 768);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      progressRef.current = 0.85;
      return;
    }
    const unsub = smoothProgress.on('change', (v) => {
      progressRef.current = v;
    });
    return () => unsub();
  }, [smoothProgress, reduceMotion]);

  const brandOpacity = useTransform(smoothProgress, [0, 0.1, 0.24], [1, 1, 0]);
  const brandY = useTransform(smoothProgress, [0, 0.24], [0, -40]);
  const midOpacity = useTransform(smoothProgress, [0.22, 0.34, 0.48, 0.58], [0, 1, 1, 0]);
  const midY = useTransform(smoothProgress, [0.22, 0.58], [28, -20]);
  const figureCopyOpacity = useTransform(smoothProgress, [0.52, 0.6, 0.72, 0.8], [0, 1, 1, 0]);
  const endOpacity = useTransform(smoothProgress, [0.78, 0.88, 1], [0, 1, 1]);
  const endY = useTransform(smoothProgress, [0.78, 0.95], [36, 0]);
  const hintOpacity = useTransform(smoothProgress, [0, 0.06, 0.14], [1, 0.75, 0]);

  const particleCount = reduceMotion ? 0 : lowPower ? 700 : 1400;

  return (
    <section
      ref={sectionRef}
      className="relative h-[320vh] bg-[#09090b]"
      aria-label="MeetMind immersive introduction"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Atmospheric planes */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-[55vh] w-[70vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.18),transparent_65%)] blur-2xl" />
          <div className="absolute bottom-0 right-0 h-[40vh] w-[50vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.12),transparent_70%)] blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '72px 72px',
              maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
            }}
          />
        </div>

        {/* WebGL stage — full bleed */}
        <div className="absolute inset-0 z-0">
          {mounted && !reduceMotion ? (
            <Canvas
              camera={{ position: [0, 0, isMobile ? 7.4 : 6.2], fov: 42 }}
              dpr={lowPower ? [1, 1.25] : [1, 1.75]}
              gl={{ antialias: !lowPower, alpha: true, powerPreference: 'high-performance' }}
              style={{ width: '100%', height: '100%' }}
            >
              <Suspense fallback={null}>
                <ImmersiveScrollScene progressRef={progressRef} particleCount={particleCount} />
              </Suspense>
            </Canvas>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-40 w-40 rounded-full bg-gradient-to-br from-rose-500/30 via-transparent to-amber-500/20 blur-2xl" />
            </div>
          )}
        </div>

        {/* Chapter overlays */}
        <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between px-6 pb-10 pt-28 md:px-10 lg:px-16">
          <motion.div
            style={{ opacity: brandOpacity, y: brandY }}
            className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
          >
            <div className="mb-8 scale-125 md:scale-150">
              <MeetMindLogo size="lg" showText subtitle="Recorder" glow />
            </div>
            <h1 className="font-heading text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.25rem] leading-[0.95]">
              Meet
              <span className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
                Mind
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-sm text-zinc-400 md:text-base leading-relaxed">
              Automatic Google Meet capture — pristine audio, local MP4, private by design.
            </p>
            <div className="pointer-events-auto mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Link href="/register" data-cursor="magnetic">
                <Button size="lg" className="w-full sm:w-auto shadow-rose-500/25">
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/#download" data-cursor="magnetic">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Download className="h-4 w-4" />
                  <span>Download App</span>
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: midOpacity, y: midY }}
            className="absolute inset-x-6 top-1/2 z-10 -translate-y-1/2 text-center md:inset-x-10"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-rose-300/80">
              Expand · Capture · Contract
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl font-heading text-3xl font-semibold tracking-tight text-white md:text-5xl">
              A recording field that opens with you —
              <span className="text-zinc-400"> then resolves into clarity.</span>
            </h2>
          </motion.div>

          <motion.div
            style={{ opacity: figureCopyOpacity }}
            className="absolute inset-x-6 top-[18%] z-10 text-center md:inset-x-10"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-amber-300/70">
              Forming the signal
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400 md:text-base">
              Particles contract into the MeetMind mark — dual arches, central pulse, ready to record.
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: endOpacity, y: endY }}
            className="absolute inset-x-6 bottom-16 z-10 mx-auto max-w-3xl text-center md:inset-x-10 md:bottom-20"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-amber-300/80">
              Local-first intelligence
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Hardware-accelerated. Echo-cancelled. Yours.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
              Scroll on — see how MeetMind turns every meeting into a durable local record.
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: hintOpacity }}
            className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              Scroll to expand
            </span>
            <span className="block h-10 w-px origin-top animate-pulse bg-gradient-to-b from-rose-400/80 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
