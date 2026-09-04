'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, Shield, Clock, ArrowRight } from 'lucide-react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';

export const Pricing3DSection: React.FC = () => {
  return (
    <section id="pricing" className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <Badge variant="amber">Transparent Commercial Plans</Badge>
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
          Start Free. Upgrade When You Need Unlimited Power.
        </h2>
        <p className="text-sm text-zinc-400">
          Every new account includes a 30-day trial with 30 minutes of recording per day. No credit card required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Trial Card */}
        <Card variant="elevated" className="p-8 flex flex-col justify-between border-white/10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-zinc-300">Free Trial</span>
              <span className="p-2 rounded-xl bg-zinc-800 text-zinc-400">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-white font-heading">$0</div>
              <p className="text-xs text-zinc-400">30-day evaluation period</p>
            </div>

            <ul className="space-y-3 pt-6 border-t border-white/10 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>30 recording minutes per day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Google Meet auto-recording</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Local MP4 export</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>System + Microphone audio capture</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Acoustic Echo Cancellation (AEC)</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Link href="/register" className="w-full block">
              <Button variant="outline" size="md" className="w-full">
                <span>Start 30-Day Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Silver Plan Card */}
        <Card variant="elevated" className="p-8 flex flex-col justify-between border-rose-500/30 bg-gradient-to-b from-rose-500/[0.05] to-transparent">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-rose-300">Silver Plan</span>
              <span className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
                <Shield className="w-4 h-4" />
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white font-heading">$19</span>
                <span className="text-xs text-zinc-400">/ month</span>
              </div>
              <p className="text-xs text-zinc-400">Unlimited daily local recording</p>
            </div>

            <ul className="space-y-3 pt-6 border-t border-white/10 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <strong className="text-white">Unlimited recording time</strong>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Hardware acceleration (NVENC/VAAPI)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Full screen, window & region capture</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>PNG & JPEG screenshot engine</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Crash recovery auto-remuxing</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Desktop session management</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Link href="/register" className="w-full block">
              <Button variant="primary" size="md" className="w-full shadow-rose-500/20">
                <span>Choose Silver</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Gold Plan Card (Visually elevated with metallic gold border) */}
        <Card variant="elevated" className="p-8 flex flex-col justify-between border-amber-500/40 bg-gradient-to-b from-amber-500/[0.08] to-transparent relative shadow-2xl shadow-amber-500/10">
          <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-bold uppercase tracking-wider shadow">
            Most Powerful
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-amber-300">Gold Plan</span>
              <span className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white font-heading">$39</span>
                <span className="text-xs text-zinc-400">/ month</span>
              </div>
              <p className="text-xs text-zinc-400">Full Recording + AI Meeting Intelligence</p>
            </div>

            <ul className="space-y-3 pt-6 border-t border-white/10 text-xs text-zinc-300">
              <li className="flex items-center gap-2 text-amber-200">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Everything in Silver plan</span>
              </li>
              <li className="flex items-center gap-2 text-amber-200">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <strong>Automated speech transcription</strong>
              </li>
              <li className="flex items-center gap-2 text-amber-200">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>AI Meeting Summary & Notes</span>
              </li>
              <li className="flex items-center gap-2 text-amber-200">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Extracted Action Items & Owners</span>
              </li>
              <li className="flex items-center gap-2 text-amber-200">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Key Decisions & Timelines</span>
              </li>
              <li className="flex items-center gap-2 text-amber-200">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Executive Briefing Generation</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Link href="/register" className="w-full block">
              <Button
                size="md"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold shadow-amber-500/20"
              >
                <span>Get Gold Intelligence</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
};
