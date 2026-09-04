import React from 'react';
import Link from 'next/link';
import { FloatingCapsuleNavbar } from '../../components/landing/FloatingCapsuleNavbar';
import { Footer } from '../../components/shared/Footer';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import {
  Mic,
  Monitor,
  ShieldCheck,
  Cpu,
  Chrome,
  Camera,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function FeaturesPage() {
  const featureList = [
    {
      icon: Chrome,
      title: 'Automatic Google Meet Detection',
      description:
        'Our lightweight Chrome and Edge extension detects prejoin, active calls, and meeting endings through native messaging. Recording begins seamlessly the moment you join.',
      variant: 'rose' as const,
    },
    {
      icon: Mic,
      title: 'WebRTC Acoustic Echo Cancellation (AEC)',
      description:
        'Records remote speakers and your microphone concurrently without echo. The system audio is used as a reference to dynamically eliminate acoustic feedback from laptop speakers.',
      variant: 'amber' as const,
    },
    {
      icon: Cpu,
      title: 'Hardware Accelerated H.264 & HEVC',
      description:
        'Harnesses NVIDIA NVENC, Intel QuickSync, and Apple Silicon VideoToolbox to compress high-definition video in real time with near-zero CPU consumption.',
      variant: 'emerald' as const,
    },
    {
      icon: Camera,
      title: 'Precision PNG & JPEG Screenshot Engine',
      description:
        'Capture full monitors, target windows, or click-and-drag custom screen regions with live dimension readouts. Lossless PNG images are organized automatically in your Pictures folder.',
      variant: 'sky' as const,
    },
    {
      icon: ShieldCheck,
      title: 'Crash-Safe MKV Remuxing',
      description:
        'Writes append-only Matroska containers during the session. If power fails or the OS reboots, our automatic remuxer repairs the file on next launch without losing a single frame.',
      variant: 'indigo' as const,
    },
    {
      icon: Sparkles,
      title: 'Gold Meeting Intelligence',
      description:
        'Automated local or cloud speech-to-text generating executive summaries, action item owner tags, key decisions, and formatted briefing documents.',
      variant: 'amber' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <FloatingCapsuleNavbar />

      <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="rose">Engineering Deep Dive</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
            Commercial-Grade Recording Architecture
          </h1>
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
            Every layer of MeetMind is designed for reliability, privacy, and pristine audiovisual fidelity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((f, i) => {
            const Icon = f.icon;
            return (
              <Card key={i} variant="elevated" hoverEffect className="p-6 space-y-4 border-white/10">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-rose-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-zinc-100 font-heading">{f.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{f.description}</p>
              </Card>
            );
          })}
        </div>

        {/* Comparison Section */}
        <Card variant="elevated" className="p-8 border-white/10 space-y-6">
          <h2 className="text-xl font-bold text-white font-heading text-center">
            How MeetMind Compares to Other Recorders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400">
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4 text-rose-400 font-semibold">MeetMind Desktop</th>
                  <th className="py-3 px-4">Meeting Bots (Otter/Fireflies)</th>
                  <th className="py-3 px-4">Generic Screen Recorders (OBS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                <tr>
                  <td className="py-3 px-4 font-medium">Automatic Google Meet Trigger</td>
                  <td className="py-3 px-4 text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Native Extension</td>
                  <td className="py-3 px-4 text-zinc-400">Requires calendar invite</td>
                  <td className="py-3 px-4 text-zinc-500">Manual button press</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Privacy / Local Video Storage</td>
                  <td className="py-3 px-4 text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> 100% Local MP4</td>
                  <td className="py-3 px-4 text-rose-400">Uploaded to third-party cloud</td>
                  <td className="py-3 px-4 text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Local</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Laptop Speaker Echo Cancellation</td>
                  <td className="py-3 px-4 text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> WebRTC APM Engine</td>
                  <td className="py-3 px-4 text-zinc-400">Server post-processed</td>
                  <td className="py-3 px-4 text-rose-400">Creates severe echo without headphones</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Participant Awareness</td>
                  <td className="py-3 px-4 text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Zero bot presence</td>
                  <td className="py-3 px-4 text-amber-400">Awkward bot joins call</td>
                  <td className="py-3 px-4 text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Invisible</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link href="/register">
            <Button size="lg">
              <span>Start 30-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
