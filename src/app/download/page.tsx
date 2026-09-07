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
          <Card variant="elevated" className="p-6 md:p-8 space-y-5 border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white font-heading">
                  System Requirements & Hash Verification
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Verify binary integrity before running across all supported desktop platforms.
                </p>
              </div>
              <a
                href="https://github.com/khizaruddins/meetmind-downloads/releases/latest/download/SHA256SUMS.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-rose-400 hover:text-rose-300 underline underline-offset-4"
              >
                Download SHA256SUMS.txt →
              </a>
            </div>

            <div className="space-y-4 text-xs text-zinc-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                  <div className="font-semibold text-white">Linux Requirements</div>
                  <div className="text-zinc-400 text-[11px] leading-relaxed">
                    glibc 2.31+, PipeWire 0.3+ or X11, 4 GB RAM. Supported on Ubuntu 20.04+, Debian 11+, Fedora, and Arch.
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                  <div className="font-semibold text-white">Windows Requirements</div>
                  <div className="text-zinc-400 text-[11px] leading-relaxed">
                    Windows 10 Build 19041+ or Windows 11 64-bit, DirectX 11 GPU, 4 GB RAM.
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                  <div className="font-semibold text-white">macOS Requirements</div>
                  <div className="text-zinc-400 text-[11px] leading-relaxed">
                    macOS 12.3+ (Monterey, Ventura, Sonoma, Sequoia) on Apple Silicon (M1/M2/M3/M4), 4 GB RAM.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/10 font-mono text-[11px] space-y-2 text-zinc-400">
                <div className="text-zinc-300 font-semibold font-sans text-xs">Verify Hashes in Terminal</div>
                <div className="space-y-1">
                  <p className="text-zinc-500"># Linux / macOS terminal verification:</p>
                  <p className="text-zinc-200 selection:bg-rose-500/30">sha256sum -c SHA256SUMS.txt</p>
                </div>
                <div className="space-y-1 pt-1 border-t border-white/5">
                  <p className="text-zinc-500"># Windows PowerShell verification:</p>
                  <p className="text-zinc-200 selection:bg-rose-500/30">Get-FileHash .\MeetMind-Windows-x64-Setup.exe -Algorithm SHA256</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
