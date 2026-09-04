'use client';

import React, { useState } from 'react';
import { Chrome, Play, Mic, Monitor, LogOut, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';

export const ScrollStorySection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: 'Join Your Google Meet',
      badge: 'Step 1 • Browser Integration',
      description:
        'Open Google Meet in Chrome or Edge. The MeetMind integration connects via lightweight native messaging without consuming CPU or intercepting your raw video streams.',
      visualIcon: Chrome,
      status: 'EXT Connected • Monitoring Session',
      visualClass: 'border-sky-500/30 bg-sky-950/20 text-sky-400',
    },
    {
      id: 1,
      title: 'Auto-Detect & Recording Starts',
      badge: 'Step 2 • Zero Friction',
      description:
        'As soon as you enter the meeting room, MeetMind triggers recording automatically. No remembering to hit record, no bot joining your meeting call, zero embarrassment.',
      visualIcon: Play,
      status: 'REC 00:01:14 • 1080p 30 FPS Active',
      visualClass: 'border-rose-500/30 bg-rose-950/20 text-rose-400',
    },
    {
      id: 2,
      title: 'System Audio + Mic with Echo Cancellation',
      badge: 'Step 3 • WebRTC APM Engine',
      description:
        'Dual independent audio tracks capture participants and your voice simultaneously. WebRTC Acoustic Echo Cancellation strips out room speaker bleed so voices are never doubled.',
      visualIcon: Mic,
      status: 'AEC Active • Noise Suppression High • Voice Gate Open',
      visualClass: 'border-amber-500/30 bg-amber-950/20 text-amber-400',
    },
    {
      id: 3,
      title: 'Leave Meeting & Instant MP4 Saved',
      badge: 'Step 4 • Local-First Storage',
      description:
        'When you hang up or leave the call, the recording stops automatically. MeetMind remuxes the crash-safe MKV stream into a standard, ready-to-share MP4 on your local disk.',
      visualIcon: LogOut,
      status: 'Completed • 2026-09-04_Sprint-Planning.mp4 Saved to Disk',
      visualClass: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400',
    },
    {
      id: 4,
      title: 'Instant AI Notes & Action Items',
      badge: 'Step 5 • Gold Intelligence',
      description:
        'For Gold users, your meeting transcript transforms into structured executive summaries, action items, key decisions, and formatted briefing notes.',
      visualIcon: Sparkles,
      status: 'AI Insights Ready • 4 Action Items • 2 Key Decisions',
      visualClass: 'border-amber-400/40 bg-amber-950/30 text-amber-300',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <Badge variant="rose">Frictionless Workflow</Badge>
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
          How MeetMind Works
        </h2>
        <p className="text-sm text-zinc-400">
          From the second you join a meeting to having an MP4 file ready on your disk—completely automated.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Step List on the Left */}
        <div className="lg:col-span-6 space-y-3">
          {steps.map((step, index) => {
            const isActive = activeStep === index;
            const Icon = step.visualIcon;
            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? 'glass-panel-elevated border-rose-500/40 shadow-lg shadow-rose-500/10'
                    : 'bg-zinc-950/30 border-white/[0.05] hover:border-white/15'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isActive
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                        : 'bg-zinc-900 border-white/5 text-zinc-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono font-medium text-rose-400">
                        {step.badge}
                      </span>
                      {isActive && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-zinc-100 mb-1">{step.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Visual Stage on the Right */}
        <div className="lg:col-span-6">
          <Card variant="elevated" className="p-6 md:p-8 border-white/10 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <Badge variant="zinc">Stage Preview</Badge>
              </div>

              {/* Central Visual Card */}
              <div
                className={`p-6 rounded-2xl border transition-all duration-300 ${steps[activeStep].visualClass}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {React.createElement(steps[activeStep].visualIcon, { className: 'w-8 h-8' })}
                  <div>
                    <h4 className="text-sm font-semibold text-white">{steps[activeStep].title}</h4>
                    <p className="text-xs text-zinc-400">{steps[activeStep].status}</p>
                  </div>
                </div>

                {/* Simulated Telemetry Meter */}
                <div className="space-y-2 mt-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Engine Pipeline Status</span>
                    <span className="text-emerald-400 font-mono">100% OPERATIONAL</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${(activeStep + 1) * 20}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-zinc-300">
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero Cloud Recording Storage</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Hardware Accelerated NVENC/VAAPI</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
