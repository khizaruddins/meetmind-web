'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, Monitor, Apple, Terminal, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';

export const DownloadSection: React.FC = () => {
  const [detectedOs, setDetectedOs] = useState<'linux' | 'windows' | 'mac'>('linux');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.includes('win')) setDetectedOs('windows');
      else if (ua.includes('mac')) setDetectedOs('mac');
      else setDetectedOs('linux');
    }
  }, []);

  return (
    <section id="download" className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <Badge variant="rose">Native Desktop Distribution</Badge>
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
          Download MeetMind for Your Desktop
        </h2>
        <p className="text-sm text-zinc-400">
          Install the high-performance desktop application, sign in with your web account, and experience seamless
          Google Meet recording.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Linux Card */}
        <Card
          variant="elevated"
          hoverEffect
          className={`p-6 space-y-5 border transition-all ${
            detectedOs === 'linux'
              ? 'border-rose-500/50 ring-1 ring-rose-500/30 bg-gradient-to-b from-rose-500/[0.06] to-transparent'
              : 'border-white/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-zinc-800 text-white">
              <Terminal className="w-6 h-6" />
            </div>
            {detectedOs === 'linux' && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Detected OS
              </span>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-white font-heading">Linux</h3>
            <p className="text-xs text-zinc-400 mt-1">Ubuntu, Debian, Fedora, Arch (64-bit)</p>
          </div>

          <div className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>PipeWire & X11 capture backends</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Available as AppImage & DEB package</span>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <a
              href="/downloads/MeetMind-1.0.0-x86_64.AppImage"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 font-medium text-xs text-white shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download AppImage (64-bit)</span>
            </a>
            <div className="text-center">
              <Link href="/docs/linux" className="text-[11px] text-zinc-400 hover:text-white transition-colors">
                View Linux setup guide →
              </Link>
            </div>
          </div>
        </Card>

        {/* Windows Card */}
        <Card
          variant="elevated"
          hoverEffect
          className={`p-6 space-y-5 border transition-all ${
            detectedOs === 'windows'
              ? 'border-sky-500/50 ring-1 ring-sky-500/30 bg-gradient-to-b from-sky-500/[0.06] to-transparent'
              : 'border-white/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-zinc-800 text-white">
              <Monitor className="w-6 h-6" />
            </div>
            {detectedOs === 'windows' && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Detected OS
              </span>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-white font-heading">Windows</h3>
            <p className="text-xs text-zinc-400 mt-1">Windows 10 / 11 (64-bit)</p>
          </div>

          <div className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Windows Graphics Capture (WGC)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>NVIDIA NVENC & Intel QSV accelerated</span>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <a
              href="/downloads/MeetMind-1.0.0-x64-Setup.exe"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-medium text-xs text-white border border-white/10 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download for Windows (.exe)</span>
            </a>
            <div className="text-center">
              <Link href="/docs/windows" className="text-[11px] text-zinc-400 hover:text-white transition-colors">
                View Windows setup guide →
              </Link>
            </div>
          </div>
        </Card>

        {/* macOS Card */}
        <Card
          variant="elevated"
          hoverEffect
          className={`p-6 space-y-5 border transition-all ${
            detectedOs === 'mac'
              ? 'border-amber-500/50 ring-1 ring-amber-500/30 bg-gradient-to-b from-amber-500/[0.06] to-transparent'
              : 'border-white/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-zinc-800 text-white">
              <Apple className="w-6 h-6" />
            </div>
            {detectedOs === 'mac' && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Detected OS
              </span>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-white font-heading">macOS</h3>
            <p className="text-xs text-zinc-400 mt-1">macOS Monterey, Ventura, Sonoma, Sequoia</p>
          </div>

          <div className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Apple Silicon M1/M2/M3/M4 & Intel</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ScreenCaptureKit 4K 60 FPS Engine</span>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <a
              href="/downloads/MeetMind-1.0.0-arm64.dmg"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-medium text-xs text-white border border-white/10 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download for macOS (.dmg)</span>
            </a>
            <div className="text-center">
              <Link href="/docs/macos" className="text-[11px] text-zinc-400 hover:text-white transition-colors">
                View macOS setup guide →
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
