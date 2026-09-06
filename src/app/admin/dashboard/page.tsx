'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '../../../lib/api/admin';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import {
  Users,
  CreditCard,
  Video,
  Download,
  UserCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  Shield,
  ArrowRight,
  TrendingUp,
  Monitor,
  Apple,
  Terminal,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    adminApi
      .getDashboard()
      .then((res) => setMetrics(res))
      .catch((err) => console.error('Admin dashboard failed:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <LoadingSkeleton rows={6} />;

  const mrrFormatted = Number(metrics?.monthlyRevenue || metrics?.mrr || 0).toLocaleString('en-IN');
  const osList = metrics?.osBreakdown || [
    { os: 'Windows', count: 0, percentage: 0 },
    { os: 'macOS', count: 0, percentage: 0 },
    { os: 'Linux', count: 0, percentage: 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Operations & Business Overview</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time subscriber metrics, operating system distribution, and live database telemetry.
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Customers */}
        <Card variant="elevated" className="p-4 border-white/10 space-y-2 bg-[#10121a]">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Total Clients</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-heading">
            {metrics?.totalClients ?? metrics?.totalUsers ?? 0}
          </div>
          <p className="text-[11px] text-zinc-500">
            Active today: <span className="text-emerald-400 font-semibold">{metrics?.activeToday ?? 0}</span>
          </p>
        </Card>

        {/* Total Downloads (Trial Registrations) */}
        <Card variant="elevated" className="p-4 border-white/10 space-y-2 bg-[#10121a]">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Total Downloads</span>
            <Download className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-heading">
            {metrics?.totalDownloads ?? metrics?.downloads ?? 0}
          </div>
          <p className="text-[11px] text-zinc-500">
            Trial signups: <span className="text-sky-400 font-semibold">{metrics?.trialAccounts ?? metrics?.trialUsers ?? 0}</span>
          </p>
        </Card>

        {/* Converted Users */}
        <Card variant="elevated" className="p-4 border-white/10 space-y-2 bg-[#10121a]">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Converted Users</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-heading">
            {metrics?.convertedUsers ?? 0}
          </div>
          <p className="text-[11px] text-emerald-400 font-semibold">
            {metrics?.conversionRate ?? metrics?.conversionRatePercent ?? 0}% conversion
          </p>
        </Card>

        {/* Monthly Recurring Revenue (MRR in INR) */}
        <Card variant="elevated" className="p-4 border-white/10 space-y-2 bg-[#10121a]">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Monthly Revenue</span>
            <span className="font-bold text-emerald-400 text-sm">₹</span>
          </div>
          <div className="text-2xl font-bold text-white font-heading">
            ₹{mrrFormatted}
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>Active Billing (INR)</span>
          </p>
        </Card>

        {/* Active Subscriptions */}
        <Card variant="elevated" className="p-4 border-white/10 space-y-2 bg-[#10121a]">
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
        <Card variant="elevated" className="p-4 border-white/10 space-y-2 bg-[#10121a]">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Recordings Today</span>
            <Video className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-heading">
            {metrics?.recordingsToday ?? 0}
          </div>
          <p className="text-[11px] text-zinc-500">
            Duration: <span className="text-zinc-200">{metrics?.recordingMinutesToday ?? 0} mins</span>
          </p>
        </Card>
      </div>

      {/* OS-Based Users Breakdown (Windows, Linux, macOS) */}
      <Card variant="elevated" className="p-6 border-white/10 space-y-5 bg-[#10121a]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Monitor className="w-4 h-4 text-sky-400" />
              <span>Operating System Distribution (Windows, Linux, macOS)</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live client machine distribution queried from active device telemetry in PostgreSQL.
            </p>
          </div>
          <Badge variant="zinc">Real-time Telemetry</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {osList.map((item: any) => {
            const isWin = item.os.toLowerCase().includes('win');
            const isMac = item.os.toLowerCase().includes('mac');
            const Icon = isWin ? Monitor : isMac ? Apple : Terminal;
            const colorClass = isWin ? 'text-sky-400 bg-sky-500/10 border-sky-500/20' : isMac ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            const barClass = isWin ? 'bg-sky-500' : isMac ? 'bg-amber-500' : 'bg-emerald-500';

            return (
              <div
                key={item.os}
                className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg border ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-white text-xs">{item.os}</span>
                      <p className="text-[11px] text-zinc-500">Native Client OS</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-white font-mono">{item.count}</span>
                    <span className="text-xs text-zinc-400 ml-1">users</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Share</span>
                    <span className="font-mono font-semibold text-white">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className={`h-full ${barClass} rounded-full`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Plan Breakdown & Tier Counts (Dynamic Cards from DB) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-heading">Commercial Tiers & Subscriptions</h2>
          <Link href="/admin/plans" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
            <span>Manage all commercial plans</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Trial Accounts */}
          <Card variant="elevated" className="p-5 border-white/10 space-y-3 bg-[#10121a]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span>Free Trial</span>
              </span>
              <Badge variant="zinc">{metrics?.trialAccounts ?? metrics?.trialUsers ?? 0} Active</Badge>
            </div>
            <div className="text-xl font-bold text-white font-mono">
              ₹0 <span className="text-xs text-zinc-500 font-normal">/evaluation</span>
            </div>
            <p className="text-xs text-zinc-400">
              Evaluation accounts with daily recording limits.
            </p>
            <div className="pt-2 border-t border-white/5">
              <Link href="/admin/trials" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
                <span>Manage trial accounts</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>

          {/* Dynamic DB Plans */}
          {metrics?.planCards && metrics.planCards.length > 0 ? (
            metrics.planCards
              .filter((p: any) => p.code !== 'TRIAL')
              .map((plan: any) => (
                <Card key={plan.id} variant="elevated" className="p-5 border-white/10 space-y-3 bg-[#10121a]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                      {plan.code === 'GOLD' ? (
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Shield className="w-4 h-4 text-rose-400" />
                      )}
                      <span>{plan.name}</span>
                    </span>
                    <Badge variant={plan.code === 'GOLD' ? 'amber' : 'rose'}>
                      {plan.activeSubscribers} Subs
                    </Badge>
                  </div>
                  <div className="text-xl font-bold text-white font-mono">
                    ₹{plan.priceRupees.toLocaleString('en-IN')}{' '}
                    <span className="text-xs text-zinc-500 font-normal">/{plan.billingInterval.toLowerCase()}</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Live commercial tier active in billing engine.
                  </p>
                  <div className="pt-2 border-t border-white/5">
                    <Link
                      href={`/admin/subscriptions?plan=${plan.code}`}
                      className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <span>View {plan.code} subscribers</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </Card>
              ))
          ) : (
            <>
              {/* Fallback Silver Card */}
              <Card variant="elevated" className="p-5 border-white/10 space-y-3 bg-[#10121a]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-rose-300 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-rose-400" />
                    <span>Silver Plan</span>
                  </span>
                  <Badge variant="rose">{metrics?.silverAccounts ?? metrics?.silverUsers ?? 0} Subs</Badge>
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  ₹549 <span className="text-xs text-zinc-500 font-normal">/month</span>
                </div>
                <p className="text-xs text-zinc-400">Unlimited local recording tier.</p>
                <div className="pt-2 border-t border-white/5">
                  <Link href="/admin/subscriptions" className="text-xs text-rose-400 hover:underline flex items-center gap-1">
                    <span>View Silver subscribers</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </Card>

              {/* Fallback Gold Card */}
              <Card variant="elevated" className="p-5 border-white/10 space-y-3 bg-[#10121a]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Gold Plan</span>
                  </span>
                  <Badge variant="amber">{metrics?.goldAccounts ?? metrics?.goldUsers ?? 0} Subs</Badge>
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  ₹1,249 <span className="text-xs text-zinc-500 font-normal">/month</span>
                </div>
                <p className="text-xs text-zinc-400">AI Meeting Intelligence tier.</p>
                <div className="pt-2 border-t border-white/5">
                  <Link href="/admin/subscriptions" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
                    <span>View Gold subscribers</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </Card>
            </>
          )}
        </div>
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
