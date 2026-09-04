import React from 'react';
import { FloatingCapsuleNavbar } from '../../components/landing/FloatingCapsuleNavbar';
import { DownloadSection } from '../../components/landing/DownloadSection';
import { Footer } from '../../components/shared/Footer';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import Link from 'next/link';

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <FloatingCapsuleNavbar />
      <main className="pt-24 pb-16">
        <DownloadSection />

        {/* Checksums & System Requirements Table */}
        <div className="max-w-4xl mx-auto px-6 mb-16">
          <Card variant="elevated" className="p-6 md:p-8 space-y-4 border-white/10">
            <h3 className="text-base font-bold text-white font-heading">
              Minimum System Requirements & Build Checksums
            </h3>
            <div className="space-y-3 text-xs text-zinc-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                  <div className="font-semibold text-white mb-1">Linux Requirements</div>
                  <div className="text-zinc-400 text-[11px]">glibc 2.31+, PipeWire 0.3+ or X11, 4 GB RAM.</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                  <div className="font-semibold text-white mb-1">Windows Requirements</div>
                  <div className="text-zinc-400 text-[11px]">Windows 10 Build 19041+ or Windows 11, DirectX 11, 4 GB RAM.</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                  <div className="font-semibold text-white mb-1">macOS Requirements</div>
                  <div className="text-zinc-400 text-[11px]">macOS 12.3+ (Monterey, Ventura, Sonoma, Sequoia), 4 GB RAM.</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 font-mono text-[11px] space-y-1.5 text-zinc-400">
                <p>SHA-256 (Linux AppImage): <code>e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</code></p>
                <p>SHA-256 (Windows x64): <code>a8f5f167f44f4964e6c998dee827110c01759f33b30cdc01e908643d9ab64162</code></p>
                <p>SHA-256 (macOS ARM64): <code>c57a2c26279f0674d0d39369b2b3a6ea237a6b72808b8b0e8c7c72f7a931668b</code></p>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
