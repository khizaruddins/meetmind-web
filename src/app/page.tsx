'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { CheckCircle2 } from 'lucide-react';
import { FloatingCapsuleNavbar } from '../components/landing/FloatingCapsuleNavbar';
import { CustomCursor } from '../components/landing/CustomCursor';
import { SupportedPlatformsStrip } from '../components/landing/SupportedPlatformsStrip';
import { ScrollStorySection } from '../components/landing/ScrollStorySection';
import { AudioEchoCancellationSection } from '../components/landing/AudioEchoCancellationSection';
import { ScreenAndScreenshotSection } from '../components/landing/ScreenAndScreenshotSection';
import { LocalFirstPrivacySection } from '../components/landing/LocalFirstPrivacySection';
import { CrossPlatformSection } from '../components/landing/CrossPlatformSection';
import { AiIntelligenceSection } from '../components/landing/AiIntelligenceSection';
import { InteractiveRecorderDemo } from '../components/landing/InteractiveRecorderDemo';
import { Pricing3DSection } from '../components/landing/Pricing3DSection';
import { DownloadSection } from '../components/landing/DownloadSection';
import { FaqAccordion } from '../components/landing/FaqAccordion';
import { FinalCtaSection } from '../components/landing/FinalCtaSection';
import { Footer } from '../components/shared/Footer';

const ImmersiveScrollExperience = dynamic(
  () =>
    import('../components/landing/ImmersiveScrollExperience').then(
      (mod) => mod.ImmersiveScrollExperience
    ),
  {
    ssr: false,
    loading: () => (
      <section className="relative flex h-screen items-center justify-center bg-[#09090b]">
        <div className="h-10 w-10 rounded-full border-2 border-rose-500/30 border-t-rose-500 animate-spin" />
      </section>
    ),
  }
);

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 selection:bg-rose-500 selection:text-white">
      <CustomCursor />
      <FloatingCapsuleNavbar />

      <ImmersiveScrollExperience />

      {/* Continuity strip after scroll story */}
      <section className="relative z-10 border-t border-white/[0.06] bg-[#09090b] px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>30-day free trial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>30 mins daily recording</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>No credit card required</span>
          </div>
          <Link
            href="/register"
            className="text-rose-300 transition-colors hover:text-rose-200"
            data-cursor="magnetic"
          >
            Create account →
          </Link>
        </div>
      </section>

      <SupportedPlatformsStrip />
      <ScrollStorySection />
      <AudioEchoCancellationSection />
      <ScreenAndScreenshotSection />
      <LocalFirstPrivacySection />
      <CrossPlatformSection />
      <AiIntelligenceSection />
      <InteractiveRecorderDemo />
      <Pricing3DSection />
      <DownloadSection />
      <FaqAccordion />
      <FinalCtaSection />
      <Footer />
    </div>
  );
}
