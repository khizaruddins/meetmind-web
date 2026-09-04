import React from 'react';
import Link from 'next/link';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { Button } from '../shared/Button';

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="py-28 px-6 relative overflow-hidden text-center">
      {/* Subtle background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[300px] rounded-full bg-gradient-to-tr from-rose-500/15 via-amber-500/10 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs text-rose-300 border border-rose-500/30">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Next-Generation Meeting Productivity</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
          Start Remembering Every Meeting Today
        </h2>

        <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Experience automatic Google Meet detection, pristine hardware-accelerated MP4 recording, and crystal-clear
          echo-cancelled audio.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link href="/register">
            <Button size="lg" className="shadow-xl shadow-rose-500/25">
              <span>Start 30-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/download">
            <Button variant="outline" size="lg">
              <Download className="w-4 h-4" />
              <span>Download Desktop App</span>
            </Button>
          </Link>
        </div>

        <p className="text-xs text-zinc-500 pt-2 font-mono">
          Available natively for Windows 10/11, macOS Apple Silicon & Intel, and Linux (PipeWire / X11).
        </p>
      </div>
    </section>
  );
};
