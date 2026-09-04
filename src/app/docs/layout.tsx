'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FloatingCapsuleNavbar } from '../../components/landing/FloatingCapsuleNavbar';
import { Footer } from '../../components/shared/Footer';
import { BookOpen, Monitor, Apple, Terminal, Chrome, Shield } from 'lucide-react';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: '/docs', label: 'Documentation Overview', icon: BookOpen },
    { href: '/docs/windows', label: 'Windows Installation', icon: Monitor },
    { href: '/docs/macos', label: 'macOS Installation', icon: Apple },
    { href: '/docs/linux', label: 'Linux (PipeWire / X11)', icon: Terminal },
    { href: '/docs/chrome-extension', label: 'Chrome Extension Guide', icon: Chrome },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between">
      <FloatingCapsuleNavbar />
      <div className="pt-28 pb-20 px-6 max-w-6xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Docs Sidebar */}
          <aside className="md:col-span-3 glass-panel p-4 rounded-2xl border-white/10 space-y-2 sticky top-28">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-2 py-1 mb-1">
              Guides & Setup
            </div>
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </aside>

          {/* Main Docs Content */}
          <main className="md:col-span-9 glass-panel-elevated p-8 rounded-2xl border-white/10 space-y-6">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
