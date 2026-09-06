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

  // Plan Mutation Modal State
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [targetPlan, setTargetPlan] = useState('TRIAL');
  const [planReason, setPlanReason] = useState('');
  const [planChangeLoading, setPlanChangeLoading] = useState(false);
  const [planChangeError, setPlanChangeError] = useState<string | null>(null);

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
    adminApi
      .getPlans()
      .then((res: any) => {
        const list = res.plans || res.data || (Array.isArray(res) ? res : []);
        const hasTrial = list.some((p: any) => p.code === 'TRIAL');
        const fullList = hasTrial
          ? list
          : [
              { id: 'trial', code: 'TRIAL', name: 'Free Trial', priceAmount: 0 },
              ...list,
            ];
        fullList.sort((a: any, b: any) => (a.priceAmount || 0) - (b.priceAmount || 0));
        setAvailablePlans(fullList);
      })
      .catch(console.error);
  }, [userId]);

  const openChangePlanModal = (defaultPlan?: string) => {
    setPlanChangeError(null);
    setPlanReason('');
    if (defaultPlan) {
      setTargetPlan(defaultPlan);
    } else {
      const activeSub = data?.user?.subscriptions?.find((s: any) => s.status === 'ACTIVE');
      const currentCode = activeSub?.plan?.code || (data?.user?.trial?.status === 'ACTIVE' ? 'TRIAL' : 'TRIAL');
      const other = availablePlans.find((p) => p.code !== currentCode);
      setTargetPlan(other ? other.code : (availablePlans[0]?.code || 'TRIAL'));
    }
    setPlanModalOpen(true);
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planReason.trim()) {
      setPlanChangeError('A reason is mandatory for administrative plan mutations.');
      return;
    }
    setPlanChangeLoading(true);
    setPlanChangeError(null);
    try {
      await adminApi.changeUserPlan(userId as string, targetPlan, planReason.trim());
      setActionMsg({ text: `User plan successfully updated to ${targetPlan}.`, type: 'success' });
      setPlanModalOpen(false);
      loadUserDetail();
    } catch (err: any) {
      setPlanChangeError(err.message || 'Failed to update plan.');
    } finally {
      setPlanChangeLoading(false);
    }
  };

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
  const activeSub = u.subscriptions?.find((s: any) => s.status === 'ACTIVE');
  const sub = activeSub || u.subscriptions?.[0];
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
          <Button
            size="sm"
            variant="outline"
            onClick={() => openChangePlanModal()}
            className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            <span>Change Plan</span>
          </Button>
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
            <span>Subscriptions ({u.subscriptions?.length || 0})</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Primary Plan:</span>
              <Badge
                variant={
                  activeSub?.plan?.code === 'GOLD'
                    ? 'amber'
                    : activeSub?.plan?.code === 'ENTERPRISE'
                    ? 'indigo'
                    : activeSub?.plan?.code === 'SILVER'
                    ? 'rose'
                    : trial?.status === 'ACTIVE'
                    ? 'amber'
                    : 'zinc'
                }
                size="sm"
              >
                {activeSub?.plan?.name || activeSub?.plan?.code || (trial?.status === 'ACTIVE' ? 'Free Trial' : 'None')}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">State:</span>
              <span
                className={`font-semibold ${
                  activeSub
                    ? 'text-emerald-400'
                    : trial?.status === 'ACTIVE'
                    ? 'text-amber-400'
                    : 'text-zinc-400'
                }`}
              >
                {activeSub ? activeSub.status : trial?.status === 'ACTIVE' ? 'TRIAL' : sub?.status || 'INACTIVE'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Pricing:</span>
              <span className="text-zinc-200 font-mono">
                {activeSub?.plan ? `₹${((activeSub.plan.priceAmount || 0) / 100).toLocaleString('en-IN')}/mo` : 'Free Trial'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Next Renewal:</span>
              <span className="text-zinc-200">
                {activeSub?.currentPeriodEnd
                  ? new Date(activeSub.currentPeriodEnd).toLocaleDateString()
                  : trial?.expiresAt
                  ? `Trial (${new Date(trial.expiresAt).toLocaleDateString()})`
                  : 'N/A'}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openChangePlanModal(sub?.plan?.code)}
              className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              <span>Change / Assign Plan</span>
            </Button>
          </div>
        </Card>

        {/* Trial Management Card */}
        <Card variant="elevated" className="p-6 border-white/10 space-y-3 bg-[#10121a]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Trial Evaluation State</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Trial State:</span>
              <Badge variant={trial?.status === 'ACTIVE' ? 'amber' : 'zinc'} size="sm">
                {trial?.status || 'NONE'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Expires:</span>
              <span className="text-zinc-200">
                {trial?.endsAt ? new Date(trial.endsAt).toLocaleDateString() : (trial?.expiresAt ? new Date(trial.expiresAt).toLocaleDateString() : 'N/A')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Daily Quota:</span>
              <span className="text-zinc-200 font-mono">
                {Math.round((data.usageTodaySeconds || quota?.secondsRecordedToday || 0) / 60)}m / 30m
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

      {/* Multi Subscriptions Table */}
      {u.subscriptions && u.subscriptions.length > 0 && (
        <Card variant="elevated" className="p-6 border-white/10 space-y-4 bg-[#10121a]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-rose-400" />
            <span>Subscription History & Active Tiers ({u.subscriptions.length})</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-400">
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Period Start</th>
                  <th className="py-2.5 px-3">Period End</th>
                  <th className="py-2.5 px-3">Auto-Renew</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {u.subscriptions.map((s: any) => (
                  <tr key={s.id}>
                    <td className="py-3 px-3 font-semibold text-white">
                      <Badge
                        variant={
                          s.plan?.code === 'GOLD'
                            ? 'amber'
                            : s.plan?.code === 'ENTERPRISE'
                            ? 'indigo'
                            : 'rose'
                        }
                        size="sm"
                      >
                        {s.plan?.name || s.plan?.code || 'Plan'}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-semibold ${s.status === 'ACTIVE' ? 'text-emerald-400' : 'text-zinc-400'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      ₹{((s.plan?.priceAmount || 0) / 100).toLocaleString('en-IN')}/mo
                    </td>
                    <td className="py-3 px-3 text-zinc-400">
                      {new Date(s.currentPeriodStart).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-zinc-400">
                      {new Date(s.currentPeriodEnd).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3">
                      {s.cancelAtPeriodEnd ? (
                        <span className="text-rose-400">Cancels at period end</span>
                      ) : (
                        <span className="text-emerald-400">Yes (Active)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openChangePlanModal(s.plan?.code)}
                        className="text-[11px] h-7 px-2 text-amber-400 hover:text-amber-300 border-amber-500/30"
                      >
                        Change Plan
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

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

      {/* Change Plan Modal */}
      {planModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Change User Subscription Tier</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Target User: <span className="text-white font-medium">{u.email}</span>
              </p>
            </div>

            {planChangeError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {planChangeError}
              </div>
            )}

            <form onSubmit={handlePlanSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium">Select Target Plan / Tier</label>
                <select
                  value={targetPlan}
                  onChange={(e) => setTargetPlan(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  {availablePlans.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name || p.code} ({p.code === 'TRIAL' ? 'Free Trial evaluation' : `₹${((p.priceAmount || 0) / 100).toLocaleString('en-IN')}/mo`})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-zinc-500">
                  Selecting <span className="text-amber-400 font-medium">Free Trial</span> will reset or reactivate the user&apos;s trial evaluation period and deactivate commercial subscription billing.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium">
                  Administrative Reason <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={planReason}
                  onChange={(e) => setPlanReason(e.target.value)}
                  placeholder="Enter reason for audit record (e.g. Switched back to Trial per user request, Granted complimentary Gold plan)"
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setPlanModalOpen(false)}
                  disabled={planChangeLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  isLoading={planChangeLoading}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                >
                  Apply Plan Change
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
