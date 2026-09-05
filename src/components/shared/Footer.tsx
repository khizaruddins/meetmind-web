import React from 'react';
import Link from 'next/link';
import { ShieldCheck, HardDrive, Cpu, Terminal } from 'lucide-react';
import { MeetMindLogo } from './MeetMindLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#07070a] pt-16 pb-12 text-zinc-400 text-xs">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand info */}
        <div className="col-span-2 space-y-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <MeetMindLogo size="xs" showText />
          </Link>
          <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
            The private-by-design meeting recorder. Automatically captures Google Meet conversations with
            system audio, microphone, and hardware acceleration on Windows, macOS, and Linux.
          </p>
          <div className="flex items-center gap-3 pt-2 text-zinc-500">
            <div className="flex items-center gap-1.5 text-[11px]">
              <HardDrive className="w-3.5 h-3.5 text-rose-400" />
              <span>Local MP4 Storage</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Cloud Audio Storage</span>
            </div>
          </div>
        </div>

        {/* Product links */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Product</h4>
          <ul className="space-y-2">
            <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            <li><Link href="/download" className="hover:text-white transition-colors">Download App</Link></li>
            <li><Link href="/releases" className="hover:text-white transition-colors">Release Notes</Link></li>
            <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
          </ul>
        </div>

        {/* Documentation links */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Installation & Docs</h4>
          <ul className="space-y-2">
            <li><Link href="/docs" className="hover:text-white transition-colors">Overview</Link></li>
            <li><Link href="/docs/windows" className="hover:text-white transition-colors">Windows 10/11 Guide</Link></li>
            <li><Link href="/docs/macos" className="hover:text-white transition-colors">macOS Guide</Link></li>
            <li><Link href="/docs/linux" className="hover:text-white transition-colors">Linux (PipeWire/X11)</Link></li>
            <li><Link href="/docs/chrome-extension" className="hover:text-white transition-colors">Chrome Extension Setup</Link></li>
          </ul>
        </div>

        {/* Trust & Legal */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Trust & Legal</h4>
          <ul className="space-y-2">
            <li><Link href="/security" className="hover:text-white transition-colors">Security Architecture</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/app/dashboard" className="hover:text-white transition-colors">Customer Portal</Link></li>
            <li><Link href="/admin/login" className="hover:text-white transition-colors text-zinc-600 hover:text-zinc-400">Admin Portal</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
        <p>© {new Date().getFullYear()} MeetMind Technologies Inc. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>Version 1.0.0 Commercial Release</span>
          <span>•</span>
          <span>C++20 Media Engine</span>
        </div>
      </div>
    </footer>
  );
};
