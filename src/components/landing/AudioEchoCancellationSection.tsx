'use client';

import React, { useState } from 'react';
import { Volume2, Mic, Sliders, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';

export const AudioEchoCancellationSection: React.FC = () => {
  const [aecEnabled, setAecEnabled] = useState(true);
  const [noiseSuppression, setNoiseSuppression] = useState(true);

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <Badge variant="amber">WebRTC APM Acoustic Engine</Badge>
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
          Remote Voices Once. Your Voice Clearly.
        </h2>
        <p className="text-sm text-zinc-400">
          When recording meetings with laptop speakers, your mic physically hears the remote speaker leaking into the room.
          MeetMind uses industrial WebRTC Acoustic Echo Cancellation to subtract echo before mixing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Controls & Explanation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-zinc-100 font-heading">
              Acoustic Echo Cancellation (AEC)
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Standard screen recorders record System Audio + Microphone directly. If you don’t wear headphones,
              remote colleagues are recorded twice with a room delay—sounding hollow, doubled, and amateur.
            </p>
          </div>

          {/* Interactive Toggle */}
          <div className="p-4 rounded-2xl glass-panel space-y-3">
            <div className="text-xs font-semibold text-zinc-300">Live DSP Filter Simulation:</div>
            
            <button
              onClick={() => setAecEnabled(!aecEnabled)}
              className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                aecEnabled
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  : 'bg-zinc-900 border-white/10 text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>WebRTC Echo Cancellation</span>
              </div>
              <span className="text-[11px] font-mono font-bold">
                {aecEnabled ? 'ACTIVE (CLEAN)' : 'DISABLED (ECHO)'}
              </span>
            </button>

            <button
              onClick={() => setNoiseSuppression(!noiseSuppression)}
              className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                noiseSuppression
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-zinc-900 border-white/10 text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs font-medium">
                <Sliders className="w-4 h-4" />
                <span>Noise Suppression & Voice Gate</span>
              </div>
              <span className="text-[11px] font-mono font-bold">
                {noiseSuppression ? '400ms HANGOVER' : 'OFF'}
              </span>
            </button>
          </div>

          <div className="space-y-2 text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Simultaneous double-talk preservation (never mutes local voice)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Diagnostic multi-track mode (Final Mix, System, Raw Mic, Clean Mic)</span>
            </div>
          </div>
        </div>

        {/* Visual Waveform Comparison Display */}
        <div className="lg:col-span-7">
          <Card variant="elevated" className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <span className="text-zinc-400">Audio Stream Visualizer</span>
              <span className="font-mono text-rose-400">48,000 Hz Stereo</span>
            </div>

            {/* Track 1: System Audio (Remote Voice) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-sky-400 font-medium flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>System Audio (Remote Participant)</span>
                </span>
                <span className="text-[11px] font-mono text-zinc-500">Unmodified Reference</span>
              </div>
              <div className="h-10 rounded-xl bg-zinc-950/80 border border-sky-500/20 flex items-center px-3 gap-1 overflow-hidden">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-sky-500/70 rounded-full animate-pulse"
                    style={{
                      height: `${20 + Math.sin(i * 0.7) * 16 + 15}%`,
                      animationDuration: `${0.8 + (i % 4) * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Track 2: Microphone Capture */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-rose-400 font-medium flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Microphone (Local Voice {aecEnabled ? '' : '+ Room Echo'})</span>
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {aecEnabled ? 'Echo Filtered' : 'Bleed Present'}
                </span>
              </div>
              <div
                className={`h-10 rounded-xl bg-zinc-950/80 border flex items-center px-3 gap-1 overflow-hidden transition-colors ${
                  aecEnabled ? 'border-rose-500/30' : 'border-rose-500/80 bg-rose-950/20'
                }`}
              >
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all ${
                      aecEnabled ? 'bg-rose-500' : 'bg-rose-400 opacity-90'
                    }`}
                    style={{
                      height: aecEnabled
                        ? `${15 + ((i * 13) % 4) * 18}%`
                        : `${40 + Math.sin(i * 0.5) * 35}%`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Track 3: Final Combined Mix */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Final Clean MP4 Audio Track</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  {aecEnabled ? 'Zero Echo • Balanced Mix' : 'Double Voice Detected'}
                </span>
              </div>
              <div className="h-12 rounded-xl bg-zinc-950/90 border border-emerald-500/30 flex items-center px-3 gap-1 overflow-hidden">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-300 rounded-full"
                    style={{
                      height: aecEnabled
                        ? `${25 + ((i * 9) % 5) * 14}%`
                        : `${55 + Math.sin(i * 0.4) * 35}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
