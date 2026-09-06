'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api/admin';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { CreditCard, Filter } from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadSubscriptions = () => {
    setLoading(true);
    adminApi
      .getSubscriptions({
        plan: planFilter || undefined,
        status: statusFilter || undefined,
      })
      .then((res) => {
        setSubscriptions(res.subscriptions || []);
        setTotal(res.total || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    adminApi.getPlans().then((res: any) => {
      const plans = res.plans || res.data || (Array.isArray(res) ? res : []);
      setAvailablePlans(plans);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    loadSubscriptions();
  }, [planFilter, statusFilter]);

  // Modal state
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [modalAction, setModalAction] = useState<'changePlan' | 'cancel' | 'resume' | 'extend' | 'overrideStatus' | null>(null);
  const [reason, setReason] = useState('');
  const [targetPlan, setTargetPlan] = useState('');
  const [extendDays, setExtendDays] = useState(30);
  const [newStatus, setNewStatus] = useState('ACTIVE');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const openActionModal = (sub: any, action: 'changePlan' | 'cancel' | 'resume' | 'extend' | 'overrideStatus') => {
    setSelectedSub(sub);
    setModalAction(action);
    setReason('');
    setActionError(null);
    if (action === 'changePlan') {
      const otherPlan = availablePlans.find((p) => p.code !== sub.plan?.code && p.code !== 'TRIAL');
      setTargetPlan(otherPlan ? otherPlan.code : 'GOLD');
    }
    if (action === 'overrideStatus') {
      setNewStatus(sub.status || 'ACTIVE');
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setActionError('A reason is mandatory for administrative subscription changes.');
      return;
    }
    if (!selectedSub) return;

    setActionLoading(true);
    setActionError(null);
    try {
      if (modalAction === 'changePlan') {
        await adminApi.changeSubscriptionPlan(selectedSub.id, targetPlan, reason.trim());
      } else if (modalAction === 'cancel') {
        await adminApi.cancelSubscription(selectedSub.id, reason.trim());
      } else if (modalAction === 'resume') {
        await adminApi.resumeSubscription(selectedSub.id, reason.trim());
      } else if (modalAction === 'extend') {
        await adminApi.extendSubscription(selectedSub.id, extendDays, reason.trim());
      } else if (modalAction === 'overrideStatus') {
        await adminApi.overrideSubscriptionStatus(selectedSub.id, newStatus, reason.trim());
      }
      setModalAction(null);
      setSelectedSub(null);
      loadSubscriptions();
    } catch (err: any) {
      setActionError(err.message || 'Action failed. Check permissions and try again.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Subscriber Administration</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage Silver and Gold commercial tiers, renewal statuses, and mutations ({total} total).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white"
          >
            <option value="">All Plans</option>
            {availablePlans.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name || p.code}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PAST_DUE">Past Due</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <Card variant="elevated" className="p-6 border-white/10 space-y-4 bg-[#10121a]">
        {loading ? (
          <LoadingSkeleton rows={5} />
        ) : subscriptions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-400">
                  <th className="py-2.5 px-3">Subscriber</th>
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Period Start</th>
                  <th className="py-2.5 px-3">Next Renewal</th>
                  <th className="py-2.5 px-3">Cancel At End</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {subscriptions.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-semibold text-white">
                      {s.user?.email || s.userId}
                    </td>
                    <td className="py-3 px-3">
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
                        {s.plan?.name || s.plan?.code}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-semibold ${
                          s.status === 'ACTIVE'
                            ? 'text-emerald-400'
                            : s.status === 'PAST_DUE'
                            ? 'text-rose-400'
                            : 'text-zinc-400'
                        }`}
                      >
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
                        <span className="text-rose-400">Yes (Pending Cancel)</span>
                      ) : (
                        <span className="text-zinc-500">No (Auto-Renew)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openActionModal(s, 'changePlan')}
                          className="text-[11px] h-7 px-2 text-zinc-300 hover:text-white"
                        >
                          Plan
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openActionModal(s, 'extend')}
                          className="text-[11px] h-7 px-2 text-zinc-300 hover:text-white"
                        >
                          Extend
                        </Button>
                        {s.status === 'ACTIVE' && !s.cancelAtPeriodEnd ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openActionModal(s, 'cancel')}
                            className="text-[11px] h-7 px-2 text-rose-400 hover:text-rose-300"
                          >
                            Cancel
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openActionModal(s, 'resume')}
                            className="text-[11px] h-7 px-2 text-emerald-400 hover:text-emerald-300"
                          >
                            Resume
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openActionModal(s, 'overrideStatus')}
                          className="text-[11px] h-7 px-2 text-amber-400 hover:text-amber-300"
                        >
                          Status
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-400 text-xs">No active subscriptions found.</div>
        )}
      </Card>

      {/* Action Modal */}
      {modalAction && selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div>
              <h3 className="text-base font-bold text-white">
                {modalAction === 'changePlan' && 'Change Subscription Plan'}
                {modalAction === 'cancel' && 'Cancel Subscription'}
                {modalAction === 'resume' && 'Resume Subscription'}
                {modalAction === 'extend' && 'Extend Subscription Period'}
                {modalAction === 'overrideStatus' && 'Override Subscription Status'}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Subscriber: <span className="text-white font-medium">{selectedSub.user?.email || selectedSub.userId}</span>
              </p>
            </div>

            {actionError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {actionError}
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="space-y-3.5 text-xs">
              {modalAction === 'changePlan' && (
                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Target Plan</label>
                  <select
                    value={targetPlan}
                    onChange={(e) => setTargetPlan(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white"
                  >
                    {availablePlans.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.name || p.code} ({p.code === 'TRIAL' ? 'Free Trial' : `₹${((p.priceAmount || 0) / 100).toLocaleString('en-IN')}/mo`})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {modalAction === 'extend' && (
                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Extension Duration (Days)</label>
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={extendDays}
                    onChange={(e) => setExtendDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white"
                  />
                </div>
              )}

              {modalAction === 'overrideStatus' && (
                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Subscription Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PAST_DUE">PAST_DUE</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="UNPAID">UNPAID</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">
                  Administrative Reason <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Mandatory reason for audit log (e.g. Customer requested upgrade, billing dispute resolution)"
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setModalAction(null);
                    setSelectedSub(null);
                  }}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  variant={modalAction === 'cancel' ? 'danger' : 'primary'}
                  isLoading={actionLoading}
                >
                  Confirm Mutation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
