'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Video,
  Calendar,
  CreditCard,
  Laptop,
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle2,
  HardDrive,
} from 'lucide-react';
import { customerApi } from '../../../lib/api/customer';
import { CustomerDashboardMetrics, RecordingMetadata } from '../../../lib/types';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../../components/shared/EmptyState';
import { useAuth } from '../../../lib/auth-context';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerApi
      .getDashboardOverview()
      .then((res) => setData(res))
      .catch(() => {
        // fallback to legacy endpoint
        return customerApi.getDashboard().then((res) => setData(res));
      })
      .catch((err) => console.error('Failed to load customer dashboard:', err))
      .finally(() => setLoading(false));
  }, []);

  const formatSeconds = (sec: number = 0) => {
    const hours = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const remainingSec = sec % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m ${remainingSec}s`;
  };

  const activeSub = user?.subscriptions?.find((s: any) => s.status === 'ACTIVE');
  const planCode =
    (typeof data?.plan === 'string' ? data.plan : data?.plan?.code)?.toUpperCase() ||
    data?.subscription?.planCode?.toUpperCase() ||
    activeSub?.plan?.code?.toUpperCase() ||
    'TRIAL';
  const isTrial = planCode === 'TRIAL';

  if (loading) {
    return <LoadingSkeleton rows={6} />;
  }

  const usageToday = data?.usage?.usedTodaySeconds ?? data?.usage?.todaySeconds ?? data?.usageTodaySeconds ?? 0;
  const dailyLimit = data?.usage?.dailyLimitSeconds ?? data?.dailyLimitSeconds ?? 1800;
  const usagePercentage = Math.min(100, Math.round((usageToday / (dailyLimit || 1)) * 100));
  const recordingsThisMonth = data?.recordings?.thisMonthCount ?? data?.recordings?.month ?? data?.recordingsThisMonth ?? 0;
  const totalRecordingSecondsMonth = data?.recordings?.totalSecondsMonth ?? data?.recordings?.monthSeconds ?? data?.totalRecordingSecondsMonth ?? 0;
  const activeDevicesCount = data?.devices?.activeCount ?? data?.devices?.count ?? data?.activeDevicesCount ?? data?.deviceCount ?? 1;
  const recentRecordings = data?.recordings?.recent ?? data?.recentRecordings ?? [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">
            Welcome back, {user?.firstName || user?.displayName || 'there'} 👋
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Here is your active meeting recording telemetry, quota usage, and synchronized devices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/app/subscription">
            <Button size="sm" variant={isTrial ? 'primary' : 'outline'}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isTrial ? 'Upgrade Plan' : 'Manage Subscription'}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Plan */}
        <Card variant="elevated" className="p-5 border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Current Plan</span>
            <Badge variant={planCode === 'GOLD' ? 'amber' : planCode === 'SILVER' ? 'rose' : 'zinc'}>
              {planCode}
            </Badge>
          </div>
          <div className="text-xl font-bold text-white font-heading">
            {planCode === 'TRIAL' ? 'Free Evaluation' : `${planCode} Subscription`}
          </div>
          <p className="text-[11px] text-zinc-400">
            {isTrial && user?.trial?.expiresAt
              ? `${Math.max(0, Math.ceil((new Date(user.trial.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days remaining`
              : 'Active & In Good Standing'}
          </p>
        </Card>

        {/* Card 2: Today's Quota Usage */}
        <Card variant="elevated" className="p-5 border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Today's Usage</span>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-white font-heading">
            {formatSeconds(usageToday)}
            {isTrial ? ` / ${formatSeconds(dailyLimit)}` : ''}
          </div>
          {isTrial ? (
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-500">Resets daily at 00:00 UTC</p>
            </div>
          ) : (
            <p className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Unlimited Daily Recording</span>
            </p>
          )}
        </Card>

        {/* Card 3: Recordings This Month */}
        <Card variant="elevated" className="p-5 border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Recordings This Month</span>
            <Video className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-bold text-white font-heading">
            {recordingsThisMonth}
          </div>
          <p className="text-[11px] text-zinc-400">
            Total time: {formatSeconds(totalRecordingSecondsMonth)}
          </p>
        </Card>

        {/* Card 4: Registered Devices */}
        <Card variant="elevated" className="p-5 border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Connected Devices</span>
            <Laptop className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-heading">
            {activeDevicesCount}
          </div>
          <Link
            href="/app/devices"
            className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
          >
            <span>Manage devices</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </Card>
      </div>

      {/* Local-First Notice */}
      <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Local-First Storage Active</p>
            <p className="text-[11px] text-zinc-400">
              Video files stay on your local disk in standard MP4 format. The web portal displays meeting metadata only.
            </p>
          </div>
        </div>
        <Link href="/docs">
          <Button size="sm" variant="outline">
            Docs
          </Button>
        </Link>
      </div>

      {/* Recent Recordings Table */}
      <Card variant="elevated" className="p-6 border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Meeting Sessions</h3>
            <p className="text-xs text-zinc-400">Metadata synchronized from your desktop recorder</p>
          </div>
          <Link
            href="/app/recordings"
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentRecordings && recentRecordings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-400">
                  <th className="py-2.5 px-3">Meeting</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Platform</th>
                  <th className="py-2.5 px-3">Device</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {recentRecordings.map((rec: any) => (
                  <tr key={rec.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{rec.title}</td>
                    <td className="py-3 px-3 text-zinc-400">
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-mono">{formatSeconds(rec.durationSeconds)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/5 text-[11px]">
                        {rec.platform}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-400">{rec.deviceName || 'Desktop App'}</td>
                    <td className="py-3 px-3">
                      <Badge variant={rec.status === 'COMPLETED' ? 'emerald' : 'rose'} size="sm">
                        {rec.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Video}
            title="No recordings yet"
            description="Start the MeetMind desktop application and join your next Google Meet call. Your meeting metadata will appear here automatically."
            actionText="Download Desktop App"
            onAction={() => window.open('/download', '_blank')}
          />
        )}
      </Card>
    </div>
  );
}
