import React from 'react';
import { FloatingCapsuleNavbar } from '../../components/landing/FloatingCapsuleNavbar';
import { Footer } from '../../components/shared/Footer';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { CheckCircle2, Download, Tag, ExternalLink } from 'lucide-react';

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
        <div className="text-center space-y-4">
          <Badge variant="rose">Changelog & History</Badge>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
            Release Notes & Builds
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Track all updates, bug fixes, and feature additions to MeetMind. Download installers and binaries directly from our GitHub release distribution.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <a
              href="https://github.com/khizaruddins/meetmind-downloads/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/20 transition-all shadow-lg hover:shadow-white/5"
            >
              <span>View GitHub Releases Repository</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-300" />
            </a>
            <a
              href="/download"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-xs font-semibold text-white shadow-lg shadow-rose-500/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Desktop App</span>
            </a>
          </div>
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
