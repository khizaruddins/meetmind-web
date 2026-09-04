import React from 'react';
import { FloatingCapsuleNavbar } from '../../components/landing/FloatingCapsuleNavbar';
import { Footer } from '../../components/shared/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <FloatingCapsuleNavbar />
      <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold font-heading text-white">Terms of Service</h1>
        <p className="text-xs text-zinc-400">Effective Date: September 2026</p>

        <div className="space-y-6 text-xs text-zinc-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">1. Acceptance of Terms</h2>
            <p>
              By downloading, installing, or registering for MeetMind, you agree to these Terms of Service. If you do not agree, do not install or use the software.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">2. Permitted Use & Recording Consent</h2>
            <p>
              You are solely responsible for complying with applicable local, state, and national laws regarding audio and video recording consent. You agree not to record conversations in jurisdictions requiring all-party consent without first obtaining permission from all attendees.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">3. Subscription & Billing</h2>
            <p>
              Free trial accounts include 30 days of service with a 30-minute daily recording quota. Paid subscriptions (Silver and Gold) bill on a recurring monthly cycle and may be cancelled at any time through your customer portal before the next renewal date.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
