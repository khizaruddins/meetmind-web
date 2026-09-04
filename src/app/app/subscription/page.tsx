'use client';

import React, { useEffect, useState } from 'react';
import { customerApi } from '../../../lib/api/customer';
import { SubscriptionInfo, PlanInfo } from '../../../lib/types';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { Sparkles, Shield, Clock, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../lib/auth-context';

export default function CustomerSubscriptionPage() {
  const { user, refreshUser } = useAuth();
  const [subData, setSubData] = useState<{
    subscription: SubscriptionInfo | null;
    availablePlans: PlanInfo[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadSubscription = () => {
    setLoading(true);
    customerApi
      .getSubscription()
      .then((res) => setSubData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSubscription();
  }, []);

  const [previewData, setPreviewData] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewTargetPlan, setPreviewTargetPlan] = useState<string | null>(null);

  const handleOpenPreview = async (planCode: string) => {
    setPreviewTargetPlan(planCode);
    setPreviewLoading(true);
    setMessage(null);
    try {
      const res = await customerApi.changePlanPreview(planCode);
      setPreviewData(res);
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to load plan change preview', type: 'error' });
      setPreviewTargetPlan(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleConfirmPlanChange = async () => {
    if (!previewTargetPlan) return;
    setActionLoading(true);
    setMessage(null);
    try {
      await customerApi.changePlan(previewTargetPlan);
      setMessage({ text: `Successfully updated plan to ${previewTargetPlan}!`, type: 'success' });
      setPreviewData(null);
      setPreviewTargetPlan(null);
      await refreshUser();
      loadSubscription();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to change plan', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription renewal?')) return;
    setActionLoading(true);
    setMessage(null);
    try {
      await customerApi.cancelSubscription();
      setMessage({ text: 'Your subscription will not renew at the end of the period.', type: 'success' });
      await refreshUser();
      loadSubscription();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to cancel subscription', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async () => {
    setActionLoading(true);
    setMessage(null);
    try {
      await customerApi.resumeSubscription();
      setMessage({ text: 'Subscription renewal resumed.', type: 'success' });
      await refreshUser();
      loadSubscription();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to resume subscription', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={5} />;

  const sub = subData?.subscription;
  const currentPlanCode = sub?.plan?.code || (user?.trial?.status === 'ACTIVE' ? 'TRIAL' : 'TRIAL');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Subscription Management</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review your plan entitlements, change tiers, or manage recurring billing renewal.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          <span>{message.text}</span>
        </div>
      )}

      {/* Active Subscription Summary Card */}
      <Card variant="elevated" className="p-6 border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-800 text-white">
              {currentPlanCode === 'GOLD' ? (
                <Sparkles className="w-5 h-5 text-amber-400" />
              ) : currentPlanCode === 'SILVER' ? (
                <Shield className="w-5 h-5 text-rose-400" />
              ) : (
                <Clock className="w-5 h-5 text-zinc-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-heading">{currentPlanCode} Plan</h3>
                <Badge variant={sub?.status === 'ACTIVE' ? 'emerald' : sub?.status === 'PAST_DUE' ? 'rose' : 'zinc'}>
                  {sub?.status || 'TRIAL'}
                </Badge>
              </div>
              <p className="text-xs text-zinc-400">
                {currentPlanCode === 'TRIAL'
                  ? '30-day evaluation • 30 mins recording per day'
                  : currentPlanCode === 'SILVER'
                  ? 'Unlimited local recording • $19/month'
                  : 'Unlimited recording + AI Meeting Intelligence • $39/month'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          {sub && sub.status === 'ACTIVE' && (
            <div>
              {sub.cancelAtPeriodEnd ? (
                <Button size="sm" variant="outline" onClick={handleResume} isLoading={actionLoading}>
                  Resume Auto-Renewal
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={handleCancel} isLoading={actionLoading}>
                  Cancel Renewal
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-zinc-400 pt-2">
          <div>
            <span className="block text-zinc-500 text-[11px]">Period Started</span>
            <span className="font-medium text-zinc-200">
              {sub?.currentPeriodStart ? new Date(sub.currentPeriodStart).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div>
            <span className="block text-zinc-500 text-[11px]">Next Renewal / Expiry</span>
            <span className="font-medium text-zinc-200">
              {sub?.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div>
            <span className="block text-zinc-500 text-[11px]">Auto-Renew</span>
            <span className="font-medium text-zinc-200">
              {sub?.cancelAtPeriodEnd ? 'Cancels at period end' : 'Enabled'}
            </span>
          </div>
          <div>
            <span className="block text-zinc-500 text-[11px]">Billing Currency</span>
            <span className="font-medium text-zinc-200">{sub?.plan?.currency || 'USD'}</span>
          </div>
        </div>
      </Card>

      {/* Available Plans Switcher */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Trial Card */}
          <Card
            variant="elevated"
            className={`p-6 flex flex-col justify-between border ${
              currentPlanCode === 'TRIAL' ? 'border-zinc-500/50 bg-zinc-900/40' : 'border-white/10'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-200">Free Trial</span>
                {currentPlanCode === 'TRIAL' && <Badge variant="zinc">Current</Badge>}
              </div>
              <div className="text-2xl font-bold text-white">$0</div>
              <p className="text-xs text-zinc-400">30 minutes recording per day</p>
              <ul className="space-y-2 pt-3 border-t border-white/10 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 30-day evaluation</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Google Meet auto-record</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Echo cancellation</li>
              </ul>
            </div>
          </Card>

          {/* Silver Card */}
          <Card
            variant="elevated"
            className={`p-6 flex flex-col justify-between border ${
              currentPlanCode === 'SILVER' ? 'border-rose-500/50 bg-rose-950/20' : 'border-white/10'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-rose-300">Silver Plan</span>
                {currentPlanCode === 'SILVER' && <Badge variant="rose">Current</Badge>}
              </div>
              <div className="text-2xl font-bold text-white">$19 <span className="text-xs font-normal text-zinc-400">/ mo</span></div>
              <p className="text-xs text-zinc-400">Unlimited daily meeting recording</p>
              <ul className="space-y-2 pt-3 border-t border-white/10 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-400" /> Unlimited recording time</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-400" /> Hardware acceleration</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-400" /> Screenshots & multi-monitor</li>
              </ul>
            </div>
            <div className="pt-6">
              {currentPlanCode === 'SILVER' ? (
                <Button size="sm" variant="outline" disabled className="w-full">
                  Active Plan
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="primary"
                  className="w-full"
                  isLoading={previewLoading && previewTargetPlan === 'SILVER'}
                  onClick={() => handleOpenPreview('SILVER')}
                >
                  {currentPlanCode === 'GOLD' ? 'Downgrade to Silver' : 'Upgrade to Silver'}
                </Button>
              )}
            </div>
          </Card>

          {/* Gold Card */}
          <Card
            variant="elevated"
            className={`p-6 flex flex-col justify-between border ${
              currentPlanCode === 'GOLD' ? 'border-amber-500/50 bg-amber-950/20' : 'border-amber-500/30'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-amber-300">Gold Plan</span>
                {currentPlanCode === 'GOLD' && <Badge variant="amber">Current</Badge>}
              </div>
              <div className="text-2xl font-bold text-white">$39 <span className="text-xs font-normal text-zinc-400">/ mo</span></div>
              <p className="text-xs text-zinc-400">Full Recording + AI Meeting Intelligence</p>
              <ul className="space-y-2 pt-3 border-t border-white/10 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Everything in Silver</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Automated transcription</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> AI Meeting Summary & Actions</li>
              </ul>
            </div>
            <div className="pt-6">
              {currentPlanCode === 'GOLD' ? (
                <Button size="sm" variant="outline" disabled className="w-full">
                  Active Plan
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold"
                  isLoading={previewLoading && previewTargetPlan === 'GOLD'}
                  onClick={() => handleOpenPreview('GOLD')}
                >
                  Upgrade to Gold
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Plan Change Preview Modal */}
      {previewData && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div>
              <h3 className="text-base font-bold text-white">Confirm Plan Change</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Review prorated billing calculations before confirming your upgrade/downgrade.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-zinc-400">Current Plan:</span>
                <span className="font-semibold text-white">
                  {previewData.currentPlan?.name || previewData.currentPlan?.code}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-zinc-400">Target Plan:</span>
                <span className="font-semibold text-amber-400">
                  {previewData.targetPlan?.name || previewData.targetPlan?.code}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-zinc-400">Effective Date:</span>
                <span className="text-zinc-200">
                  {previewData.effectiveDate ? new Date(previewData.effectiveDate).toLocaleDateString() : 'Immediately'}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-zinc-400">Estimated Proration:</span>
                <span className="font-mono text-zinc-200">
                  ${((previewData.estimatedProration || 0) / 100).toFixed(2)} {previewData.currency || 'USD'}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-zinc-400">Estimated Due Today:</span>
                <span className="font-bold font-mono text-emerald-400 text-sm">
                  ${((previewData.estimatedAmountDue || 0) / 100).toFixed(2)} {previewData.currency || 'USD'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Next Renewal Date:</span>
                <span className="text-zinc-200">
                  {previewData.nextRenewalDate ? new Date(previewData.nextRenewalDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setPreviewData(null);
                  setPreviewTargetPlan(null);
                }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={handleConfirmPlanChange}
                isLoading={actionLoading}
              >
                Confirm Plan Change
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
