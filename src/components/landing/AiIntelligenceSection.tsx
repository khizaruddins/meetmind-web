import React from 'react';
import { Sparkles, CheckSquare, Compass, FileText, Users, ArrowRight } from 'lucide-react';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';

export const AiIntelligenceSection: React.FC = () => {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <Badge variant="amber">Gold Tier Capability</Badge>
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
          Turn Raw Conversations into Structured Intelligence
        </h2>
        <p className="text-sm text-zinc-400">
          Stop taking manual notes while trying to contribute. Gold subscribers unlock instant transcription,
          key decisions, and executive briefings generated right after each call.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Executive Summary */}
        <Card variant="elevated" className="p-6 space-y-4 border-amber-500/20 bg-gradient-to-b from-amber-500/[0.04] to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-zinc-100 font-heading">Executive Summary</h3>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 p-3.5 rounded-xl border border-white/5">
            "Engineering and Product aligned on prioritizing local native MP4 recording. Next.js web application and customer dashboard launched ahead of schedule. Enterprise SSO moved to Milestone 9."
          </p>
          <span className="text-[11px] text-amber-400 font-mono">Synthesized in 4.2 seconds</span>
        </Card>

        {/* Card 2: Action Items & Owners */}
        <Card variant="elevated" className="p-6 space-y-4 border-amber-500/20 bg-gradient-to-b from-amber-500/[0.04] to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-zinc-100 font-heading">Action Items & Owners</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-white/5 flex items-center justify-between">
              <span className="text-zinc-200">Submit Chrome Web Store package</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-rose-300 font-medium">@Alex</span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-white/5 flex items-center justify-between">
              <span className="text-zinc-200">Deploy release artifacts for macOS ARM64</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-amber-300 font-medium">@Sarah</span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-white/5 flex items-center justify-between">
              <span className="text-zinc-200">Run security audit on JWT cookies</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-emerald-300 font-medium">@Marcus</span>
            </div>
          </div>
        </Card>

        {/* Card 3: Key Decisions & Next Steps */}
        <Card variant="elevated" className="p-6 space-y-4 border-amber-500/20 bg-gradient-to-b from-amber-500/[0.04] to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-zinc-100 font-heading">Key Decisions</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-zinc-950/60 border border-white/5">
              <div className="font-semibold text-amber-300 mb-0.5">Decision: No Cloud Video Hosting</div>
              <div className="text-zinc-400 text-[11px]">Recordings remain local-only by default to safeguard client privacy.</div>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950/60 border border-white/5">
              <div className="font-semibold text-amber-300 mb-0.5">Decision: Single Auth Account</div>
              <div className="text-zinc-400 text-[11px]">Unify web customer portal and desktop recorder logins.</div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
