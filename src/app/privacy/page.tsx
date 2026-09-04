import React from 'react';
import { FloatingCapsuleNavbar } from '../../components/landing/FloatingCapsuleNavbar';
import { Footer } from '../../components/shared/Footer';
import { Card } from '../../components/shared/Card';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <FloatingCapsuleNavbar />
      <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold font-heading text-white">Privacy Policy</h1>
        <p className="text-xs text-zinc-400">Last updated: September 2026</p>

        <div className="space-y-6 text-xs text-zinc-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">1. Information We Collect</h2>
            <p>
              When you register for an account, we collect your name, email address, hashed password, and device identifier (operating system and version) for license authentication and usage quota enforcement.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">2. Video and Audio Data</h2>
            <p>
              <strong>We do not collect or store your meeting recordings.</strong> All screen captures, camera feeds, system audio, and microphone recordings remain stored locally on your physical machine unless you explicitly choose to export or upload them yourself.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">3. Browser Integration</h2>
            <p>
              The MeetMind Chrome &amp; Edge extension monitors tab URLs solely to detect active Google Meet sessions. No browsing history, web page content, or external website data is tracked, saved, or transmitted.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">4. Payment Processing</h2>
            <p>
              Payment data is processed directly by PCI-compliant payment providers (e.g. Stripe). We only store payment method metadata such as card brand, expiration date, and last four digits.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
