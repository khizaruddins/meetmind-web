import React from 'react';
import Link from 'next/link';
import { Badge } from '../../components/shared/Badge';
import { Monitor, Apple, Terminal, Chrome, ArrowRight, ShieldCheck } from 'lucide-react';

export default function DocsOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge variant="rose">Documentation Hub</Badge>
        <h1 className="text-3xl font-bold font-heading text-white">
          MeetMind Architecture & Setup Guides
        </h1>
        <p className="text-sm text-zinc-400">
          Welcome to the official documentation for MeetMind. Choose your operating system below for detailed step-by-step installation instructions, permissions, and Google Meet browser extension setup.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <Link
          href="/docs/windows"
          className="p-5 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-white/10 hover:border-sky-500/40 transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <Monitor className="w-5 h-5 text-sky-400" />
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-sm font-semibold text-white">Windows 10 / 11 Installation</h3>
          <p className="text-xs text-zinc-400">WASAPI audio, Windows Graphics Capture, and SmartScreen guidance.</p>
        </Link>

        <Link
          href="/docs/macos"
          className="p-5 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-white/10 hover:border-amber-500/40 transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <Apple className="w-5 h-5 text-amber-400" />
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-sm font-semibold text-white">macOS Installation</h3>
          <p className="text-xs text-zinc-400">ScreenCaptureKit, Screen Recording permissions & CoreAudio permissions.</p>
        </Link>

        <Link
          href="/docs/linux"
          className="p-5 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-white/10 hover:border-emerald-500/40 transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-sm font-semibold text-white">Linux (PipeWire / X11)</h3>
          <p className="text-xs text-zinc-400">Wayland portal permissions, X11 shared memory, and audio setup.</p>
        </Link>

        <Link
          href="/docs/chrome-extension"
          className="p-5 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-white/10 hover:border-rose-500/40 transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <Chrome className="w-5 h-5 text-rose-400" />
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-sm font-semibold text-white">Chrome Extension Guide</h3>
          <p className="text-xs text-zinc-400">Native messaging host, Google Meet state detection, and troubleshooting.</p>
        </Link>
      </div>

      <div className="pt-6 border-t border-white/10 space-y-2">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Local-First Security Guarantee</span>
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          The browser integration only detects meeting join/leave events. Audio and video capture take place strictly inside the native desktop application. No video packets or raw meeting audio are processed by the Chrome extension.
        </p>
      </div>
    </div>
  );
}
