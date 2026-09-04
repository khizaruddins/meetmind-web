'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Download, Sparkles, Shield, CheckCircle2 } from 'lucide-react';
import { FloatingCapsuleNavbar } from '../components/landing/FloatingCapsuleNavbar';
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
import { Button } from '../components/shared/Button';

// Dynamically import the Three.js 3D canvas with SSR disabled for optimal bundle performance
const HeroCanvas = dynamic(
  () => import('../components/landing/HeroCanvas').then((mod) => mod.HeroCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[450px] md:h-[560px] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-rose-500/30 border-t-rose-500 animate-spin" />
      </div>
    ),
  }
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-rose-500 selection:text-white relative">
      {/* Floating Capsule Navbar */}
      <FloatingCapsuleNavbar />

      {/* Cinematic Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle Ambient Radial Light behind Hero */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[350px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[300px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Value Prop & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs text-rose-300 border border-rose-500/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Version 1.0 Commercial Release</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-300">Google Meet Native</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-[1.12]">
              Never lose what happened in a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-rose-400">
                meeting.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl">
              Automatically record Google Meet conversations with system audio, microphone, screen sharing,
              local MP4 capture, and WebRTC Acoustic Echo Cancellation. Private by design, cross-platform everywhere.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto shadow-rose-500/25">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/download">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Download className="w-4 h-4" />
                  <span>Download Desktop App</span>
                </Button>
              </Link>
            </div>

            {/* Value Guarantees */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>30-day free trial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>30 mins daily recording</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Product Interactive Scene */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <HeroCanvas />
          </div>
        </div>
      </section>

      {/* Platform & Native Backend Strip */}
      <SupportedPlatformsStrip />

      {/* How It Works (Scroll Story) */}
      <ScrollStorySection />

      {/* Acoustic Echo Cancellation & Clean Audio Mixing */}
      <AudioEchoCancellationSection />

      {/* Screen and Screenshot Capabilities */}
      <ScreenAndScreenshotSection />

      {/* Local-First Privacy */}
      <LocalFirstPrivacySection />

      {/* Cross-Platform Matrix */}
      <CrossPlatformSection />

      {/* Gold AI Meeting Intelligence */}
      <AiIntelligenceSection />

      {/* Live Interactive Simulator Demo */}
      <InteractiveRecorderDemo />

      {/* Transparent Pricing Section */}
      <Pricing3DSection />

      {/* Download Section */}
      <DownloadSection />

      {/* FAQ */}
      <FaqAccordion />

      {/* Final Call to Action */}
      <FinalCtaSection />

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
