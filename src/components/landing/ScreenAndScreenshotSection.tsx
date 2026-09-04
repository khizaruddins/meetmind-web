'use client';

import React, { useState } from 'react';
import { Monitor, AppWindow, Crop, Camera, Check, Crosshair } from 'lucide-react';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';

export const ScreenAndScreenshotSection: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'display' | 'window' | 'region'>('region');

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <Badge variant="rose">Visual Capture & Snapshots</Badge>
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
          Pristine Screen Capture & Instant Screenshots
        </h2>
        <p className="text-sm text-zinc-400">
          Record your full multi-monitor setup, capture application windows cleanly, or snap pixel-perfect
          PNG screenshots with interactive region selection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual Preview on Left */}
        <div className="lg:col-span-7">
          <Card variant="elevated" className="p-6 md:p-8 relative overflow-hidden">
            {/* Window chrome bar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                Mode: {activeMode.toUpperCase()}
              </span>
            </div>

            {/* Mock Screen Content */}
            <div className="relative rounded-xl border border-white/10 bg-[#0d0e14] h-64 md:h-80 overflow-hidden flex items-center justify-center p-6">
              {/* Background simulated desktop grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:24px_24px]" />

              {/* Simulated application window */}
              <div className="w-full max-w-md h-48 rounded-xl bg-zinc-900/90 border border-white/15 p-4 shadow-xl relative z-10 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-semibold text-zinc-200">Google Meet — Sprint Retrospective</span>
                  <span className="text-[10px] text-emerald-400 font-mono">LIVE CALL</span>
                </div>
                <div className="grid grid-cols-2 gap-2 my-2">
                  <div className="h-14 rounded-lg bg-zinc-800/70 border border-white/5 flex items-center justify-center text-[10px] text-zinc-400">
                    Speaker 1 (Audio On)
                  </div>
                  <div className="h-14 rounded-lg bg-zinc-800/70 border border-white/5 flex items-center justify-center text-[10px] text-zinc-400">
                    You (Presenter)
                  </div>
                </div>
                <div className="text-[10px] text-zinc-500">Hardware Accelerated NVENC • 60 FPS Capable</div>
              </div>

              {/* Region Selection Overlay Box (Active when region is selected) */}
              {activeMode === 'region' && (
                <div className="absolute inset-x-12 inset-y-8 border-2 border-dashed border-rose-500 bg-rose-500/10 rounded-lg flex items-center justify-center pointer-events-none z-20 animate-pulse-slow">
                  <div className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-rose-500 text-[10px] font-mono text-white flex items-center gap-1 shadow">
                    <Crosshair className="w-3 h-3" />
                    <span>840 × 520 (PNG Export)</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Mode Selector & Feature Cards on Right */}
        <div className="lg:col-span-5 space-y-4">
          <div
            onClick={() => setActiveMode('display')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeMode === 'display'
                ? 'glass-panel-elevated border-rose-500/40'
                : 'bg-zinc-950/30 border-white/5 hover:border-white/15'
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <Monitor className="w-5 h-5 text-rose-400" />
              <h4 className="text-sm font-semibold text-zinc-100">Full Display Capture</h4>
            </div>
            <p className="text-xs text-zinc-400">
              Record or snapshot entire primary or secondary monitors up to 4K resolution with zero frame drops.
            </p>
          </div>

          <div
            onClick={() => setActiveMode('window')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeMode === 'window'
                ? 'glass-panel-elevated border-amber-500/40'
                : 'bg-zinc-950/30 border-white/5 hover:border-white/15'
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <AppWindow className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-semibold text-zinc-100">Application Window Capture</h4>
            </div>
            <p className="text-xs text-zinc-400">
              Target Google Meet, Chrome, or presentation slide decks specifically without capturing background desktop clutter.
            </p>
          </div>

          <div
            onClick={() => setActiveMode('region')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeMode === 'region'
                ? 'glass-panel-elevated border-emerald-500/40'
                : 'bg-zinc-950/30 border-white/5 hover:border-white/15'
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <Crop className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-zinc-100">Partial & Region Screenshots</h4>
            </div>
            <p className="text-xs text-zinc-400">
              Drag-to-select rectangle with live dimension HUD. Instantly saved as lossless PNG to Pictures/MeetingRecorder.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
