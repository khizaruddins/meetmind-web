'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Hero3DScene } from './Hero3DScene';

export const HeroCanvas: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[480px] md:h-[560px] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-rose-500/30 border-t-rose-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-[480px] sm:h-[540px] md:h-[580px] lg:h-[620px] relative flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 8.2 : 6.8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Hero3DScene />
        </Suspense>
      </Canvas>
    </div>
  );
};
