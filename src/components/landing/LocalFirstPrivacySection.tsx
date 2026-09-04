import React from 'react';
import { HardDrive, ShieldCheck, Lock, CloudOff, FileVideo, CheckCircle2 } from 'lucide-react';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';

export const LocalFirstPrivacySection: React.FC = () => {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <Badge variant="emerald">Security & Privacy First</Badge>
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
          Your Recordings Stay on Your Device. Always.
        </h2>
        <p className="text-sm text-zinc-400">
          Unlike web-bot recorders that send your confidential video streams into third-party servers,
          MeetMind encodes and writes MP4 files directly to your local file system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated" className="p-6 space-y-4 border-white/10">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-zinc-100 font-heading">Local Disk Output</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Recordings are written directly to your Videos/MeetingRecorder folder as standard MP4 files. No cloud video hosting, zero data transfer limits, and instant access without buffering.
          </p>
          <div className="pt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Encrypted local file permissions</span>
          </div>
        </Card>

        <Card variant="elevated" className="p-6 space-y-4 border-white/10">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <CloudOff className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-zinc-100 font-heading">Zero Remote Video Streaming</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Your screen captures and multi-track audio never transit remote media servers. MeetMind does not upload video to any third party cloud. What happens in your meeting stays on your machine.
          </p>
          <div className="pt-2 text-[11px] font-mono text-rose-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Independent offline operation</span>
          </div>
        </Card>

        <Card variant="elevated" className="p-6 space-y-4 border-white/10">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-zinc-100 font-heading">Crash-Safe MKV to MP4</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Sudden power cut or OS crash? MeetMind writes an append-only MKV stream in real time. The built-in recovery engine safely remuxes the file to MP4 on restart so you never lose a meeting.
          </p>
          <div className="pt-2 text-[11px] font-mono text-amber-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zero corrupted video files</span>
          </div>
        </Card>
      </div>
    </section>
  );
};
