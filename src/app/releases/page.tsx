import React from 'react';
import { FloatingCapsuleNavbar } from '../../components/landing/FloatingCapsuleNavbar';
import { Footer } from '../../components/shared/Footer';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { CheckCircle2, Download, Tag } from 'lucide-react';

export default function ReleasesPage() {
  const releases = [
    {
      version: 'v1.0.0 Commercial Release',
      date: 'September 2026',
      badge: 'Latest Release',
      changes: [
        'Production web platform launch: Public site, Customer portal, and Admin portal',
        'Unified authentication system across website and desktop recorder',
        'Precision screenshot engine in recorder-core: Full display, window, and interactive region capture',
        'Lossless PNG and configurable JPEG output saved directly to Pictures/MeetingRecorder',
        'WebRTC Acoustic Echo Cancellation (AEC) with 150ms pre-roll and 400ms hangover gate',
        'Direct MP4 remuxing with hardware encoding (NVENC, VAAPI, VideoToolbox)',
        'Chrome & Edge Google Meet browser integration with native messaging host',
        'Customer subscription management: 30-day Trial, Silver ($19), and Gold ($39)',
      ],
    },
    {
      version: 'v0.9.0 Release Candidate',
      date: 'August 2026',
      badge: 'Milestone 7',
      changes: [
        'Full SaaS backend REST API with PostgreSQL & Prisma',
        'Customer billing, invoices, payment method tokens, and automated trial expiration',
        'Admin dashboard APIs: RBAC permissions, client drilldown, and audit logging',
        'Offline license caching and grace-period validation in desktop application',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <FloatingCapsuleNavbar />
      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="rose">Changelog & History</Badge>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
            Release Notes
          </h1>
          <p className="text-sm text-zinc-400">
            Track all updates, bug fixes, and feature additions to MeetMind.
          </p>
        </div>

        <div className="space-y-8">
          {releases.map((rel, idx) => (
            <Card key={idx} variant="elevated" className="p-6 md:p-8 space-y-4 border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-rose-400" />
                  <h2 className="text-lg font-bold text-white">{rel.version}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400">{rel.date}</span>
                  <Badge variant={idx === 0 ? 'rose' : 'zinc'}>{rel.badge}</Badge>
                </div>
              </div>

              <ul className="space-y-2 pt-3 border-t border-white/10 text-xs text-zinc-300">
                {rel.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
