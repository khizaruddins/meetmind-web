import React from 'react';
import { FloatingCapsuleNavbar } from '../../components/landing/FloatingCapsuleNavbar';
import { Pricing3DSection } from '../../components/landing/Pricing3DSection';
import { FaqAccordion } from '../../components/landing/FaqAccordion';
import { Footer } from '../../components/shared/Footer';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <FloatingCapsuleNavbar />
      <main className="pt-24 pb-16">
        <Pricing3DSection />
        <FaqAccordion />
      </main>
      <Footer />
    </div>
  );
}
