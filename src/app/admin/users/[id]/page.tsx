'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/shared/Card';
import { Badge } from '../../../../components/shared/Badge';
import { Button } from '../../../../components/shared/Button';
import { LoadingSkeleton } from '../../../../components/shared/LoadingSkeleton';
import {
  User,
  ArrowLeft,
  Clock,
  CreditCard,
  Video,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  MailCheck,
  ShieldAlert,
  Sparkles,
  Layers,
} from 'lucide-react';

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const userId = Array.isArray(id) ? id[0] : id;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadUserDetail = () => {
    if (!userId) return;
    setLoading(true);
    adminApi
      .getUserDetail(userId)
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUserDetail();
  }, [userId]);

  // Admin Actions
  const handleExtendTrial = async (days: number) => {
    setActionLoading(true);
    setActionMsg(null);
    try {
      await adminApi.extendTrial(userId, days, 'Admin manual extension');
      setActionMsg({ text: `Successfully extended trial by ${days} days.`, type: 'success' });
      loadUserDetail();
    } catch (err: any) {
      setActionMsg({ text: err.message || 'Failed to extend trial', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetDailyUsage = async () => {
    setActionLoading(true);
    setActionMsg(null);
    try {
      await adminApi.resetTrialDailyUsage(userId);
      setActionMsg({ text: 'Reset daily recording quota to 0 seconds.', type: 'success' });
      loadUserDetail();
    } catch (err: any) {
      setActionMsg({ text: err.message || 'Failed to reset daily usage', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndTrial = async () => {
    if (!confirm('Immediately expire this client free trial?')) return;
    setActionLoading(true);
    setActionMsg(null);
    try {
      await adminApi.endTrial(userId);
      setActionMsg({ text: 'Trial expired immediately.', type: 'success' });
      loadUserDetail();
    } catch (err: any) {
      setActionMsg({ text: err.message || 'Failed to end trial', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    const isCurrentlyActive = data?.user?.status === 'ACTIVE';
    const confirmMsg = isCurrentlyActive
      ? 'Disable this client account? They will be locked out of the app.'
      : 'Re-enable this client account?';
    if (!confirm(confirmMsg)) return;

    setActionLoading(true);
    setActionMsg(null);
    try {
      if (isCurrentlyActive) {
        await adminApi.disableUser(userId, 'Administrative action');
        setActionMsg({ text: 'User account disabled.', type: 'success' });
      } else {
        await adminApi.enableUser(userId);
        setActionMsg({ text: 'User account enabled.', type: 'success' });
      }
      loadUserDetail();
    } catch (err: any) {
      setActionMsg({ text: err.message || 'Failed to update account status', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    setActionLoading(true);
    setActionMsg(null);
    try {
      await adminApi.verifyUserEmail(userId);
      setActionMsg({ text: 'Client email verified manually.', type: 'success' });
      loadUserDetail();
    } catch (err: any) {
      setActionMsg({ text: err.message || 'Failed to verify email', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleForceLogout = async () => {
    if (!confirm('Force logout all active sessions for this user?')) return;
    setActionLoading(true);
    setActionMsg(null);
    try {
      await adminApi.forceLogoutUser(userId);
      setActionMsg({ text: 'All user sessions invalidated.', type: 'success' });
    } catch (err: any) {
      setActionMsg({ text: err.message || 'Failed to logout sessions', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={8} />;
  if (!data || !data.user) {
    return (
      <div className="text-center py-12 text-zinc-400 text-xs">
        Client not found or failed to load profile.
      </div>
    );
  }

  const u = data.user;
  const trial = u.trial;
  const sub = u.subscriptions?.[0];
  const quota = data.usage;
  const devices = data.devices || [];
  const recordings = data.recordings || [];

  const sessions = data.activeSessions || data.sessions || [];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/users">
            <Button size="sm" variant="outline">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Directory</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-heading text-white">{u.displayName || u.email}</h1>
            <p className="text-xs text-zinc-400 font-mono">User ID: {u.id}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!u.emailVerified && (
            <Button size="sm" variant="outline" onClick={handleVerifyEmail} isLoading={actionLoading}>
              <MailCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verify Email</span>
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={handleForceLogout} isLoading={actionLoading}>
            <LogOut className="w-3.5 h-3.5 text-amber-400" />
            <span>Force Logout All</span>
          </Button>
          <Button
            size="sm"
            variant={u.status === 'ACTIVE' ? 'danger' : 'secondary'}
            onClick={handleToggleStatus}
            isLoading={actionLoading}
          >
            {u.status === 'ACTIVE' ? 'Disable Client' : 'Enable Client'}
          </Button>
        </div>
      </div>

      {actionMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            actionMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* Grid of Profile, Subscription, and Trial */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Profile */}
        <Card variant="elevated" className="p-6 border-white/10 space-y-3 bg-[#10121a]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
            <User className="w-4 h-4 text-amber-400" />
            <span>Client Profile</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Email:</span>
              <span className="text-zinc-200 font-mono text-[11px]">{u.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Verified:</span>
              <Badge variant={u.emailVerified ? 'emerald' : 'amber'} size="sm">
                {u.emailVerified ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Status:</span>
              <Badge variant={u.status === 'ACTIVE' ? 'emerald' : 'rose'} size="sm">
                {u.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Joined:</span>
              <span className="text-zinc-200">{new Date(u.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </Card>

        {/* Subscription Info */}
        <Card variant="elevated" className="p-6 border-white/10 space-y-3 bg-[#10121a]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
            <CreditCard className="w-4 h-4 text-rose-400" />
            <span>Subscription Status</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Current Plan:</span>
              <Badge variant={sub?.plan?.code === 'GOLD' ? 'amber' : sub?.plan?.code === 'SILVER' ? 'rose' : 'zinc'} size="sm">
                {sub?.plan?.code || 'TRIAL'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">State:</span>
              <span className="text-emerald-400 font-semibold">{sub?.status || 'TRIAL'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Next Billing:</span>
              <span className="text-zinc-200">
                {sub?.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </Card>

        {/* Trial Management Card */}
        <Card variant="elevated" className="p-6 border-white/10 space-y-3 bg-[#10121a]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Trial Operational Actions</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Trial State:</span>
              <span className="font-semibold text-zinc-200">{trial?.status || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Expires:</span>
              <span className="text-zinc-200">
                {trial?.expiresAt ? new Date(trial.expiresAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => handleExtendTrial(7)} isLoading={actionLoading}>
              +7 Days
            </Button>
            <Button size="sm" variant="outline" onClick={handleResetDailyUsage} isLoading={actionLoading}>
              Reset Usage
            </Button>
            <Button size="sm" variant="danger" onClick={handleEndTrial} isLoading={actionLoading}>
              End Trial
            </Button>
          </div>
        </Card>
      </div>

      {/* Active Sessions Table */}
      <Card variant="elevated" className="p-6 border-white/10 space-y-4 bg-[#10121a]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Laptop className="w-4 h-4 text-amber-400" />
            <span>Active Connected Sessions ({sessions.length})</span>
          </h3>
          {sessions.length > 0 && (
            <Button size="sm" variant="outline" onClick={handleForceLogout} isLoading={actionLoading} className="text-xs">
              <LogOut className="w-3 h-3" />
              <span>Terminate All Sessions</span>
            </Button>
          )}
        </div>

        {sessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-400">
                  <th className="py-2.5 px-3">Device / Platform</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3">Last Active</th>
                  <th className="py-2.5 px-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {sessions.map((sess: any) => (
                  <tr key={sess.id}>
                    <td className="py-3 px-3 font-semibold text-white">
                      {sess.deviceName || 'Client'} ({sess.platform || 'Unknown'})
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-400">{sess.ipAddress || '127.0.0.1'}</td>
                    <td className="py-3 px-3 text-zinc-400">
                      {sess.lastActiveAt ? new Date(sess.lastActiveAt).toLocaleString() : 'Just now'}
                    </td>
                    <td className="py-3 px-3 text-zinc-400">
                      {new Date(sess.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-zinc-500 py-2">No active sessions currently open for this user.</p>
        )}
      </Card>

      {/* Recording Sessions Table */}
      <Card variant="elevated" className="p-6 border-white/10 space-y-4 bg-[#10121a]">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Video className="w-4 h-4 text-emerald-400" />
          <span>Recorded Meeting Metadata</span>
        </h3>

        {recordings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-400">
                  <th className="py-2.5 px-3">Meeting</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Duration (sec)</th>
                  <th className="py-2.5 px-3">Platform</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {recordings.map((rec: any) => (
                  <tr key={rec.id}>
                    <td className="py-3 px-3 font-semibold text-white">{rec.title}</td>
                    <td className="py-3 px-3 text-zinc-400">{new Date(rec.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-3 font-mono">{rec.durationSeconds}s</td>
                    <td className="py-3 px-3">{rec.platform}</td>
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
          <p className="text-xs text-zinc-500 py-2">No recording sessions registered for this customer.</p>
        )}
      </Card>
    </div>
  );
}
