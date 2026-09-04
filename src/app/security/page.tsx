import React from 'react';
import { FloatingCapsuleNavbar } from '../../components/landing/FloatingCapsuleNavbar';
import { Footer } from '../../components/shared/Footer';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { ShieldCheck, Lock, HardDrive, Key, Server, Cpu } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <FloatingCapsuleNavbar />
      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="emerald">Enterprise Security & Compliance</Badge>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
            Security Architecture & Local-First Principles
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            How MeetMind protects your corporate IP, client conversations, and sensitive executive meetings.
          </p>
        </div>

        <div className="space-y-6">
          <Card variant="elevated" className="p-6 md:p-8 space-y-4 border-white/10">
            <div className="flex items-center gap-3">
              <HardDrive className="w-6 h-6 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Local-First Storage Guarantee</h2>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Meeting recordings are saved directly into the client's local user directory (e.g. <code>Videos/MeetingRecorder</code>) using standard MP4 container formats. MeetMind never uploads video files, screenshots, or local raw recordings to any cloud media server.
            </p>
          </Card>

          <Card variant="elevated" className="p-6 md:p-8 space-y-4 border-white/10">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-rose-400" />
              <h2 className="text-lg font-bold text-white">Encrypted Credential & License Storage</h2>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Authentication tokens and offline licensing data are cached using OS-native secure keychains (Windows Credential Manager, macOS Keychain, and Linux Secret Service / libsecret). We never write raw passwords or refresh tokens to plaintext JSON settings files.
            </p>
          </Card>

          <Card variant="elevated" className="p-6 md:p-8 space-y-4 border-white/10">
            <div className="flex items-center gap-3">
              <Server className="w-6 h-6 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Secure API Communication (HTTPS & JWT)</h2>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              All interactions with our backend services (account management, plan upgrades, usage quota telemetry) operate over TLS 1.3 with cryptographic JWT tokens. Sensitive administrative endpoints require granular role-based access control (RBAC) and are completely isolated from standard customer tokens.
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
