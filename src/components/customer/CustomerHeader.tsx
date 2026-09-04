'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '../shared/Badge';
import { useAuth } from '../../lib/auth-context';
import { ExternalLink, Sparkles } from 'lucide-react';

export const CustomerHeader: React.FC = () => {
  const { user } = useAuth();

  const planCode = user?.subscriptions?.[0]?.plan?.code || (user?.trial?.status === 'ACTIVE' ? 'TRIAL' : 'TRIAL');
  const isTrial = planCode === 'TRIAL';

  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-md px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold text-zinc-200">Customer Portal</h2>
        <Badge variant={planCode === 'GOLD' ? 'amber' : planCode === 'SILVER' ? 'rose' : 'zinc'}>
          {planCode} Plan
        </Badge>
        {isTrial && user?.trial?.expiresAt && (
          <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
            Trial expires in{' '}
            {Math.max(
              0,
              Math.ceil(
                (new Date(user.trial.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              )
            )}{' '}
            days
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {isTrial && (
          <Link
            href="/app/subscription"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-xs font-semibold text-white shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upgrade to Unlimited</span>
          </Link>
        )}
        <Link
          href="/"
          target="_blank"
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>Main Website</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </header>
  );
};
