'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '../../../../components/shared/Card';
import { Badge } from '../../../../components/shared/Badge';
import { Button } from '../../../../components/shared/Button';
import { LoadingSkeleton } from '../../../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../../../components/shared/EmptyState';
import {
  Activity,
  LogIn,
  Laptop,
  Video,
  Sparkles,
  CreditCard,
  Key,
  ShieldCheck,
  RefreshCw,
  FileText,
  Clock,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../../../lib/auth-context';
import { customerApi } from '../../../../lib/api/customer';
import { authApi } from '../../../../lib/api/auth';

interface TimelineEvent {
  id: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  title: string;
  detail: string;
  badge: string;
  badgeVariant: 'rose' | 'emerald' | 'amber' | 'sky' | 'indigo' | 'zinc';
  category: 'recording' | 'session' | 'device' | 'plan' | 'invoice';
  timestamp: Date;
  timeFormatted: string;
}

export default function CustomerActivityPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isToday) return `Today at ${timeStr}`;
    if (isYesterday) return `Yesterday at ${timeStr}`;
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at ${timeStr}`;
  };

  const loadActivityData = async () => {
    try {
      const [recordingsRes, devicesRes, sessionsRes, invoicesRes] = await Promise.allSettled([
        customerApi.getRecordings({ limit: 50 }),
        customerApi.getDevices(),
        authApi.getSessions(),
        customerApi.getInvoices(),
      ]);

      const timeline: TimelineEvent[] = [];

      // 1. Process Recording Sessions
      if (recordingsRes.status === 'fulfilled' && recordingsRes.value) {
        const recList =
          recordingsRes.value.recordings ||
          recordingsRes.value.data ||
          (Array.isArray(recordingsRes.value) ? recordingsRes.value : []);

        recList.forEach((r: any) => {
          const recDate = new Date(r.startedAt || r.createdAt);
          const durationMins = Math.floor((r.durationSeconds || 0) / 60);
          const durationSecs = (r.durationSeconds || 0) % 60;
          const durationFormatted =
            durationMins > 0 ? `${durationMins}m ${durationSecs}s` : `${durationSecs}s`;

          timeline.push({
            id: `rec-${r.id}`,
            icon: Video,
            iconColor: 'text-rose-400',
            iconBg: 'bg-rose-500/10',
            title: `${r.meetingTitle || r.title || 'Meeting Session'} Recorded`,
            detail: `Duration: ${durationFormatted} · Platform: ${r.meetingPlatform || r.platform || 'General'} · Status: ${r.status || 'COMPLETED'}`,
            badge: 'Recording',
            badgeVariant: 'rose',
            category: 'recording',
            timestamp: recDate,
            timeFormatted: formatTimestamp(recDate),
          });
        });
      }

      // 2. Process Synchronized Devices
      if (devicesRes.status === 'fulfilled' && devicesRes.value?.devices) {
        devicesRes.value.devices.forEach((d: any) => {
          const devDate = new Date(d.lastSeenAt || d.createdAt || Date.now());
          timeline.push({
            id: `dev-${d.id}`,
            icon: Laptop,
            iconColor: 'text-sky-400',
            iconBg: 'bg-sky-500/10',
            title: `Device Synchronized: ${d.deviceName || 'Desktop Client'}`,
            detail: `Platform: ${d.platform || 'Desktop'} · Client Version: ${d.clientVersion || '1.0.0'} · Status: ${d.status || 'ACTIVE'}`,
            badge: 'Device',
            badgeVariant: 'sky',
            category: 'device',
            timestamp: devDate,
            timeFormatted: formatTimestamp(devDate),
          });
        });
      }

      // 3. Process Active Auth Sessions
      if (sessionsRes.status === 'fulfilled' && sessionsRes.value?.sessions) {
        sessionsRes.value.sessions.forEach((s: any) => {
          const sessDate = new Date(s.lastActiveAt || s.createdAt || Date.now());
          timeline.push({
            id: `sess-${s.id}`,
            icon: LogIn,
            iconColor: 'text-emerald-400',
            iconBg: 'bg-emerald-500/10',
            title: `Portal Session: ${s.deviceName || 'Web Browser'}`,
            detail: `IP: ${s.ipAddress || '127.0.0.1'} · ${s.isCurrent || s.currentSession ? 'Current Active Session' : 'Browser Session Started'}`,
            badge: 'Auth',
            badgeVariant: 'emerald',
            category: 'session',
            timestamp: sessDate,
            timeFormatted: formatTimestamp(sessDate),
          });
        });
      }

      // 4. Process Invoices
      if (invoicesRes.status === 'fulfilled' && invoicesRes.value?.invoices) {
        invoicesRes.value.invoices.forEach((inv: any) => {
          const invDate = new Date(inv.createdAt);
          timeline.push({
            id: `inv-${inv.id}`,
            icon: FileText,
            iconColor: 'text-amber-400',
            iconBg: 'bg-amber-500/10',
            title: `Invoice Generated: ${inv.invoiceNumber}`,
            detail: `Amount: ₹${((inv.amountPaid || 0) / 100).toFixed(0)} INR · Status: ${inv.status || 'PAID'}`,
            badge: 'Billing',
            badgeVariant: 'amber',
            category: 'invoice',
            timestamp: invDate,
            timeFormatted: formatTimestamp(invDate),
          });
        });
      }

      // 5. Account & Plan Milestones
      if (user?.trial?.startedAt) {
        const trialDate = new Date(user.trial.startedAt);
        timeline.push({
          id: 'trial-start',
          icon: Sparkles,
          iconColor: 'text-indigo-400',
          iconBg: 'bg-indigo-500/10',
          title: '30-Day Free Trial Activated',
          detail: 'Allocated 30 daily recording minutes, audio capture, and local MP4 export.',
          badge: 'Plan',
          badgeVariant: 'indigo',
          category: 'plan',
          timestamp: trialDate,
          timeFormatted: formatTimestamp(trialDate),
        });
      }

      if (user?.createdAt) {
        const accDate = new Date(user.createdAt);
        timeline.push({
          id: 'account-created',
          icon: Key,
          iconColor: 'text-amber-400',
          iconBg: 'bg-amber-500/10',
          title: 'MeetMind Account Created',
          detail: `Registered as ${user.displayName || user.firstName || 'Customer'} with ${user.email}.`,
          badge: 'Security',
          badgeVariant: 'amber',
          category: 'session',
          timestamp: accDate,
          timeFormatted: formatTimestamp(accDate),
        });
      }

      // Sort by timestamp descending (newest first)
      timeline.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setEvents(timeline);
    } catch (err) {
      console.error('Failed to load realtime activity log:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadActivityData();
  }, [user]);

  const handleManualRefresh = () => {
    setRefreshing(true);
    loadActivityData();
  };

  const filteredEvents =
    filterCategory === 'all'
      ? events
      : events.filter((e) => e.category === filterCategory);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Account Activity Timeline</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Realtime operational log of meeting recordings, device syncs, authentication sessions, and plan events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleManualRefresh}
            isLoading={refreshing}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync Activity</span>
          </Button>
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterCategory === 'all'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          All Activity ({events.length})
        </button>
        <button
          onClick={() => setFilterCategory('recording')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterCategory === 'recording'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          Recordings ({events.filter((e) => e.category === 'recording').length})
        </button>
        <button
          onClick={() => setFilterCategory('session')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterCategory === 'session'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          Auth & Sessions ({events.filter((e) => e.category === 'session').length})
        </button>
        <button
          onClick={() => setFilterCategory('device')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterCategory === 'device'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          Devices ({events.filter((e) => e.category === 'device').length})
        </button>
        <button
          onClick={() => setFilterCategory('plan')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterCategory === 'plan'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          Plan & Billing ({events.filter((e) => e.category === 'plan' || e.category === 'invoice').length})
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No activity records found"
          description="There are currently no synchronized events in this category."
        />
      ) : (
        <Card variant="elevated" className="p-6 border-white/10 space-y-4">
          <div className="space-y-4">
            {filteredEvents.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.id}
                  className="flex items-start gap-3.5 pb-4 border-b border-white/5 last:border-0 last:pb-0 group hover:bg-white/[0.01] transition-colors rounded-lg p-1"
                >
                  <div className={`p-2.5 rounded-xl ${act.iconBg} ${act.iconColor} mt-0.5 shrink-0 shadow-sm`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-white truncate">{act.title}</h4>
                        <Badge variant={act.badgeVariant} size="sm">
                          {act.badge}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-zinc-500 shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-600" />
                        {act.timeFormatted}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 break-words">{act.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
