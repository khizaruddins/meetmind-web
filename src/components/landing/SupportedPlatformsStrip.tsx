import React from 'react';
import { ShieldCheck, HardDrive, Cpu, Zap, Chrome } from 'lucide-react';

export const SupportedPlatformsStrip: React.FC = () => {
  return (
    <section className="border-y border-white/[0.06] bg-[#0c0d13]/60 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <Zap className="w-4 h-4 text-rose-400" />
          <span>Native Platform Engines:</span>
        </div>

        <div className="flex flex-wrap items-center gap-8 text-xs text-zinc-300">
          {/* Windows */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span className="font-semibold text-zinc-100">Windows 10 / 11</span>
            <span className="text-zinc-500 text-[11px]">(WASAPI • WGC • NVENC)</span>
          </div>

          {/* macOS */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-semibold text-zinc-100">macOS</span>
            <span className="text-zinc-500 text-[11px]">(ScreenCaptureKit • Apple Silicon)</span>
          </div>

          {/* Linux */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-zinc-100">Linux</span>
            <span className="text-zinc-500 text-[11px]">(PipeWire • Wayland • X11)</span>
          </div>

          {/* Chrome Integration */}
          <div className="flex items-center gap-2">
            <Chrome className="w-4 h-4 text-rose-400" />
            <span className="font-semibold text-zinc-100">Google Meet</span>
            <span className="text-zinc-500 text-[11px]">(Native Messaging)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
