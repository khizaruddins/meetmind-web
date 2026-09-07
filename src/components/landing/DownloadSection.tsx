'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, Monitor, Apple, Terminal, CheckCircle2, Shield, ArrowRight, ExternalLink, ShieldCheck, FileText } from 'lucide-react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';

const RELEASES_BASE_URL = 'https://github.com/khizaruddins/meetmind-downloads/releases';
const LATEST_DOWNLOAD_BASE_URL = 'https://github.com/khizaruddins/meetmind-downloads/releases/latest/download';

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
        <div className="flex items-center justify-center gap-2">
          <Badge variant="rose">Native Desktop Distribution</Badge>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Latest Builds
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
          Download MeetMind for Your Desktop
        </h2>
        <p className="text-sm text-zinc-400">
          Install the high-performance desktop application, sign in with your web account, and experience seamless
          meeting intelligence with zero-cloud raw media processing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Linux Card */}
        <Card
          variant="elevated"
          hoverEffect
          className={`p-6 space-y-5 border transition-all flex flex-col justify-between ${
            detectedOs === 'linux'
              ? 'border-rose-500/50 ring-1 ring-rose-500/30 bg-gradient-to-b from-rose-500/[0.06] to-transparent shadow-xl shadow-rose-500/10'
              : 'border-white/10'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-zinc-800 text-white">
                <Terminal className="w-6 h-6 text-rose-400" />
              </div>
              {detectedOs === 'linux' ? (
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Detected OS
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-white/5">
                  x86_64
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-white font-heading">Linux</h3>
              <p className="text-xs text-zinc-400 mt-1">Ubuntu, Debian, Fedora, Arch (64-bit)</p>
            </div>

            <div className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>PipeWire & X11 capture backends</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Available as AppImage & DEB package</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Hardware VA-API & NVENC encoding</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-4">
            <a
              href={`${LATEST_DOWNLOAD_BASE_URL}/MeetMind-Linux-x86_64.AppImage`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 font-medium text-xs text-white shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download AppImage (64-bit)</span>
            </a>
            <a
              href={`${LATEST_DOWNLOAD_BASE_URL}/MeetMind-Linux-amd64.deb`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 font-medium text-xs text-zinc-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .deb (Debian/Ubuntu)</span>
            </a>
            <div className="text-center pt-1">
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
          className={`p-6 space-y-5 border transition-all flex flex-col justify-between ${
            detectedOs === 'windows'
              ? 'border-sky-500/50 ring-1 ring-sky-500/30 bg-gradient-to-b from-sky-500/[0.06] to-transparent shadow-xl shadow-sky-500/10'
              : 'border-white/10'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-zinc-800 text-white">
                <Monitor className="w-6 h-6 text-sky-400" />
              </div>
              {detectedOs === 'windows' ? (
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Detected OS
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-white/5">
                  x64
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-white font-heading">Windows</h3>
              <p className="text-xs text-zinc-400 mt-1">Windows 10 / 11 (64-bit)</p>
            </div>

            <div className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Windows Graphics Capture (WGC)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>NVIDIA NVENC & Intel QSV accelerated</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>WASAPI loopback system audio capture</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-4">
            <a
              href={`${LATEST_DOWNLOAD_BASE_URL}/MeetMind-Windows-x64-Setup.exe`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 font-medium text-xs text-white shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download for Windows (.exe)</span>
            </a>
            <div className="text-center pt-1">
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
          className={`p-6 space-y-5 border transition-all flex flex-col justify-between ${
            detectedOs === 'mac'
              ? 'border-amber-500/50 ring-1 ring-amber-500/30 bg-gradient-to-b from-amber-500/[0.06] to-transparent shadow-xl shadow-amber-500/10'
              : 'border-white/10'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-zinc-800 text-white">
                <Apple className="w-6 h-6 text-amber-400" />
              </div>
              {detectedOs === 'mac' ? (
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Detected OS
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-white/5">
                  Apple Silicon
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-white font-heading">macOS</h3>
              <p className="text-xs text-zinc-400 mt-1">macOS Monterey, Ventura, Sonoma, Sequoia</p>
            </div>

            <div className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Apple Silicon M1 / M2 / M3 / M4</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>ScreenCaptureKit 4K 60 FPS Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Hardware VideoToolbox H.264 / HEVC</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-4">
            <a
              href={`${LATEST_DOWNLOAD_BASE_URL}/MeetMind-macOS-arm64.dmg`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 font-medium text-xs text-white shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download for macOS (.dmg)</span>
            </a>
            <div className="text-center pt-1">
              <Link href="/docs/macos" className="text-[11px] text-zinc-400 hover:text-white transition-colors">
                View macOS setup guide →
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* GitHub Releases & Checksums Banner */}
      <div className="mt-10 p-5 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">Official Builds & Checksums</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10">
                meetmind-downloads
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Every binary is compiled, signed, and published with SHA-256 integrity verification on GitHub.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <a
            href={`${LATEST_DOWNLOAD_BASE_URL}/SHA256SUMS.txt`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-xs font-medium text-zinc-300 hover:text-white border border-white/10 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <span>SHA256SUMS.txt</span>
          </a>
          <a
            href={RELEASES_BASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white border border-white/20 transition-all shadow-sm"
          >
            <span>GitHub Releases</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        </div>
      </div>
    </section>
  );
};
