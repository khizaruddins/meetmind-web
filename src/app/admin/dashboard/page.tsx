'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '../../../lib/api/admin';
import { AdminDashboardMetrics } from '../../../lib/types';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import {
  Users,
  CreditCard,
  Video,
  DollarSign,
  AlertTriangle,
  Clock,
  Sparkles,
  Shield,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getDashboard()
      .then((res) => setMetrics(res))
      .catch((err) => console.error('Admin dashboard failed:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton rows={6} />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Operations & Business Overview</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time subscriber metrics, recording telemetry, and payment health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/users">
            <Button size="sm" variant="outline">
              <Users className="w-3.5 h-3.5" />
              <span>User Directory</span>
            </Button>
          </Link>
          <Link href="/admin/system-health">
            <Button size="sm" variant="secondary">
              <span>System Health</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <Card variant="elevated" className="p-5 border-white/10 space-y-2 bg-[#10121a]">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Total Clients</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-heading">
            {metrics?.totalClients ?? 0}
          </div>
          <p className="text-[11px] text-zinc-500">
            Active today: <span className="text-emerald-400 font-semibold">{metrics?.activeToday ?? 0}</span>
          </p>
        </Card>

        {/* Monthly Recurring Revenue (MRR) */}
        <Card variant="elevated" className="p-5 border-white/10 space-y-2 bg-[#10121a]">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Monthly Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-heading">
            ${((metrics?.monthlyRevenue || 0) / 100).toFixed(2)}
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>Active Billing Cycle</span>
          </p>
        </Card>

        {/* Active Subscriptions */}
        <Card variant="elevated" className="p-5 border-white/10 space-y-2 bg-[#10121a]">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Active Paid Subs</span>
            <CreditCard className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white font-heading">
            {metrics?.activeSubscriptions ?? 0}
          </div>
          <p className="text-[11px] text-zinc-500">
            Past due: <span className="text-rose-400 font-semibold">{metrics?.pastDueCount ?? 0}</span>
          </p>
        </Card>

        {/* Recordings Today */}
        <Card variant="elevated" className="p-5 border-white/10 space-y-2 bg-[#10121a]">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Recordings Today</span>
            <Video className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-heading">
            {metrics?.recordingsToday ?? 0}
          </div>
          <p className="text-[11px] text-zinc-500">
            Duration: <span className="text-zinc-200">{metrics?.recordingMinutesToday ?? 0} mins</span>
          </p>
        </Card>
      </div>

      {/* Plan Breakdown & Tier Counts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated" className="p-6 border-white/10 space-y-3 bg-[#10121a]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span>Trial Accounts</span>
            </span>
            <Badge variant="zinc">{metrics?.trialAccounts ?? 0}</Badge>
          </div>
          <p className="text-xs text-zinc-400">
            Users evaluating MeetMind with 30 minutes/day quota.
          </p>
          <div className="pt-2">
            <Link href="/admin/trials" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
              <span>Manage trial extensions</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>

        <Card variant="elevated" className="p-6 border-white/10 space-y-3 bg-[#10121a]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-rose-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-400" />
              <span>Silver Accounts</span>
            </span>
            <Badge variant="rose">{metrics?.silverAccounts ?? 0}</Badge>
          </div>
          <p className="text-xs text-zinc-400">
            $19/mo subscribers with unlimited local recording.
          </p>
          <div className="pt-2">
            <Link href="/admin/subscriptions" className="text-xs text-rose-400 hover:underline flex items-center gap-1">
              <span>View Silver subscribers</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>

        <Card variant="elevated" className="p-6 border-white/10 space-y-3 bg-[#10121a]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Gold Accounts</span>
            </span>
            <Badge variant="amber">{metrics?.goldAccounts ?? 0}</Badge>
          </div>
          <p className="text-xs text-zinc-400">
            $39/mo subscribers with AI meeting intelligence.
          </p>
          <div className="pt-2">
            <Link href="/admin/subscriptions" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
              <span>View Gold subscribers</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Attention & Action Items */}
      <Card variant="elevated" className="p-6 border-white/10 space-y-4 bg-[#10121a]">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Operational Attention Items</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-zinc-200">Past Due Subscriptions</p>
              <p className="text-[11px] text-zinc-400">Accounts pending payment retry</p>
            </div>
            <Badge variant={metrics?.pastDueCount ? 'rose' : 'emerald'}>
              {metrics?.pastDueCount ?? 0} Accounts
            </Badge>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-zinc-200">Failed Transactions</p>
              <p className="text-[11px] text-zinc-400">Card processor charge errors</p>
            </div>
            <Badge variant={metrics?.failedPaymentsCount ? 'rose' : 'emerald'}>
              {metrics?.failedPaymentsCount ?? 0} Errors
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
