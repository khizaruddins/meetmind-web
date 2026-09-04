'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '../shared/Badge';
import { useAdminAuth } from '../../lib/admin-auth-context';
import { ShieldCheck, HeartPulse, ExternalLink } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const { admin } = useAdminAuth();

  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#09090b]/90 backdrop-blur-md px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold text-zinc-100">MeetMind Admin Console</h2>
        <Badge variant="amber">RBAC: SUPER_ADMIN</Badge>
        <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono hidden sm:inline-flex">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Healthy</span>
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <Link
          href="/admin/system-health"
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
        >
          <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
          <span>Health Monitors</span>
        </Link>
        <Link
          href="/"
          target="_blank"
          className="text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </header>
  );
};
