'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Shield, Download, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '../shared/Button';
import { useAuth } from '../../lib/auth-context';
import { getCustomerToken } from '../../lib/api/client';

export const FloatingCapsuleNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!getCustomerToken());
  }, [user]);

  const isAuthenticated = !!user || (!loading && hasToken);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4 transition-all duration-300">
      <nav
        className={`w-full max-w-5xl transition-all duration-300 rounded-2xl flex items-center justify-between px-5 py-3 ${
          scrolled
            ? 'glass-panel-elevated backdrop-blur-xl border-white/10 shadow-2xl bg-zinc-950/80'
            : 'bg-transparent border border-transparent'
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 shadow-md shadow-rose-500/25 group-hover:scale-105 transition-transform">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white font-heading">
              MeetMind
            </span>
            <span className="text-[10px] text-zinc-400 -mt-1 font-mono">Recorder</span>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-1 glass-pill px-3 py-1 rounded-full border border-white/[0.08]">
          <Link
            href="/features"
            className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white transition-colors rounded-full hover:bg-white/[0.06]"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white transition-colors rounded-full hover:bg-white/[0.06]"
          >
            How It Works
          </Link>
          <Link
            href="/pricing"
            className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white transition-colors rounded-full hover:bg-white/[0.06]"
          >
            Pricing
          </Link>
          <Link
            href="/download"
            className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white transition-colors rounded-full hover:bg-white/[0.06]"
          >
            Download
          </Link>
          <Link
            href="/docs"
            className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white transition-colors rounded-full hover:bg-white/[0.06]"
          >
            Docs
          </Link>
        </div>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/app/dashboard">
                <Button size="sm" variant="primary" className="shadow-rose-500/20">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Button>
              </Link>
              <button
                onClick={() => logout('/')}
                className="text-xs font-medium text-zinc-400 hover:text-rose-400 px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors flex items-center gap-1.5"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                Sign In
              </Link>
              <Link href="/register">
                <Button size="sm" className="shadow-rose-500/20">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 top-20 glass-panel-elevated p-5 rounded-2xl border-white/10 space-y-3 animate-fade-in shadow-2xl">
          <Link
            href="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-zinc-200"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-zinc-200"
          >
            How It Works
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-zinc-200"
          >
            Pricing
          </Link>
          <Link
            href="/download"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-zinc-200"
          >
            Download
          </Link>
          <Link
            href="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-zinc-200"
          >
            Documentation
          </Link>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link href="/app/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full justify-center">
                    <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout('/');
                  }}
                  className="w-full py-2 px-3 text-xs font-medium text-zinc-400 hover:text-rose-400 hover:bg-white/[0.05] rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Start Free Trial
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
