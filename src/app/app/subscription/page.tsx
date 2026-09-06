'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { customerApi } from '../../../lib/api/customer';
import { SubscriptionInfo, PlanInfo } from '../../../lib/types';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import {
  Sparkles,
  Shield,
  Clock,
  Check,
  ArrowRight,
  ExternalLink,
  Copy,
  CheckCheck,
  CreditCard,
  Lock,
  Zap,
  RefreshCw,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../../lib/auth-context';

interface RazorpayPaymentData {
  paymentLinkId: string;
  paymentLinkUrl: string;
  status: string;
  amount: number;
  currency: string;
  keyId: string;
  orderId?: string;
  isSimulation?: boolean;
  plan: {
    code: string;
    name: string;
    description?: string;
    priceAmount: number;
    currency: string;
  };
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const existing = document.getElementById('razorpay-checkout-js');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CustomerSubscriptionPage() {
  const { user, refreshUser } = useAuth();
  const [subData, setSubData] = useState<{
    subscription: SubscriptionInfo | null;
    availablePlans: PlanInfo[];
  } | null>(null);
  const [plans, setPlans] = useState<PlanInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Razorpay Checkout & Payment Link Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<RazorpayPaymentData | null>(null);
  const [selectedPlanCode, setSelectedPlanCode] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  // Load subscription and plans dynamically from backend API
  const loadSubscription = useCallback(async () => {
    setLoading(true);
    try {
      const [subRes, plansRes] = await Promise.all([
        customerApi.getSubscription().catch(() => ({ subscription: null, availablePlans: [] })),
        customerApi.getPlans().catch(() => ({ plans: [] })),
      ]);

      setSubData(subRes);
      const combinedPlans = plansRes.plans?.length ? plansRes.plans : subRes.availablePlans || [];
      setPlans(combinedPlans);
    } catch (err: any) {
      console.error('Failed to load subscription/plans:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  // Handle return callbacks from Razorpay Payment Link (e.g. redirected with payment=success)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    const paymentStatus = searchParams.get('payment');
    const razorpayPaymentId = searchParams.get('payment_id') || searchParams.get('razorpay_payment_id');
    const planFromUrl = searchParams.get('plan') || searchParams.get('planCode');

    if ((paymentStatus === 'success' || razorpayPaymentId) && planFromUrl) {
      const pId = razorpayPaymentId || `pay_link_${Date.now().toString(36)}`;
      setVerifyingPayment(true);

      customerApi
        .verifyRazorpayPayment({
          planCode: planFromUrl,
          razorpayPaymentId: pId,
          razorpayPaymentLinkId: searchParams.get('razorpay_payment_link_id') || undefined,
        })
        .then(async (res) => {
          setMessage({
            text: res.message || `Payment verified! Your ${planFromUrl} plan is now active.`,
            type: 'success',
          });
          await refreshUser();
          loadSubscription();
        })
        .catch((err) => {
          setMessage({
            text: err.message || 'Payment received, updating your account status...',
            type: 'info',
          });
          refreshUser();
          loadSubscription();
        })
        .finally(() => {
          setVerifyingPayment(false);
          // Clean URL without reloading
          window.history.replaceState({}, '', window.location.pathname);
        });
    }
  }, [refreshUser, loadSubscription]);

  // Initiate Razorpay Payment Link Flow via meeting-recorder-api
  const handleInitiateRazorpay = async (planCode: string) => {
    setSelectedPlanCode(planCode);
    setPaymentLoading(true);
    setMessage(null);
    setCopiedLink(false);

    try {
      // Preload Razorpay checkout SDK
      loadRazorpayScript().catch(() => {});

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const callbackUrl = `${origin}/app/subscription?payment=success&plan=${planCode}`;

      // Call meeting-recorder-api to generate Razorpay Payment Link and Order
      const res = await customerApi.createRazorpayPaymentLink(planCode, callbackUrl);

      setPaymentData(res);
      setPaymentModalOpen(true);
    } catch (err: any) {
      setMessage({
        text: err.message || 'Failed to initialize Razorpay payment. Please try again.',
        type: 'error',
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  // Launch the Razorpay Popup Checkout Modal
  const handleLaunchRazorpayPopup = async () => {
    if (!paymentData) return;

    setVerifyingPayment(true);
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded || typeof (window as any).Razorpay === 'undefined') {
      // Fallback to opening payment link in new window if script is blocked
      window.open(paymentData.paymentLinkUrl, '_blank', 'noopener,noreferrer');
      setVerifyingPayment(false);
      return;
    }

    const options = {
      key: paymentData.keyId,
      amount: paymentData.amount, // in paise
      currency: paymentData.currency || 'INR',
      name: 'MeetMind',
      description: `Upgrade to ${paymentData.plan.name}`,
      image: '/icon.svg',
      order_id: paymentData.orderId && !paymentData.isSimulation ? paymentData.orderId : undefined,
      prefill: {
        name: user?.displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        email: user?.email,
      },
      theme: {
        color: paymentData.plan.code === 'GOLD' ? '#f59e0b' : '#f43f5e',
      },
      handler: async function (response: any) {
        try {
          const verifyRes = await customerApi.verifyRazorpayPayment({
            planCode: paymentData.plan.code,
            razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now().toString(36)}`,
            razorpayOrderId: response.razorpay_order_id || paymentData.orderId,
            razorpaySignature: response.razorpay_signature,
            razorpayPaymentLinkId: paymentData.paymentLinkId,
          });

          setMessage({
            text: verifyRes.message || `Payment verified! Welcome to ${paymentData.plan.name}.`,
            type: 'success',
          });
          setPaymentModalOpen(false);
          await refreshUser();
          loadSubscription();
        } catch (err: any) {
          setMessage({
            text: err.message || 'Payment processed. Syncing subscription...',
            type: 'info',
          });
          setPaymentModalOpen(false);
          await refreshUser();
          loadSubscription();
        } finally {
          setVerifyingPayment(false);
        }
      },
      modal: {
        ondismiss: function () {
          setVerifyingPayment(false);
        },
      },
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        setMessage({
          text: resp?.error?.description || 'Payment failed. Please try again.',
          type: 'error',
        });
        setVerifyingPayment(false);
      });
      rzp.open();
    } catch {
      // Fallback to hosted payment link
      window.open(paymentData.paymentLinkUrl, '_blank', 'noopener,noreferrer');
      setVerifyingPayment(false);
    }
  };

  // Verify payment manually (e.g. after customer paid in another tab via link)
  const handleManualPaymentCompleted = async () => {
    if (!paymentData) return;
    setVerifyingPayment(true);
    setMessage(null);

    try {
      const verifyRes = await customerApi.verifyRazorpayPayment({
        planCode: paymentData.plan.code,
        razorpayPaymentId: `pay_manual_${Date.now().toString().slice(-6)}`,
        razorpayPaymentLinkId: paymentData.paymentLinkId,
      });

      setMessage({
        text: verifyRes.message || `Subscription activated for ${paymentData.plan.name}!`,
        type: 'success',
      });
      setPaymentModalOpen(false);
      await refreshUser();
      loadSubscription();
    } catch (err: any) {
      setMessage({
        text: err.message || 'Failed to verify payment status. Please try again.',
        type: 'error',
      });
    } finally {
      setVerifyingPayment(false);
    }
  };

  const handleCopyPaymentLink = () => {
    if (!paymentData?.paymentLinkUrl) return;
    navigator.clipboard.writeText(paymentData.paymentLinkUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
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

  // Dynamic plan lookups from API
  const silverPlan = plans.find((p) => p.code === 'SILVER');
  const goldPlan = plans.find((p) => p.code === 'GOLD');

  const silverPriceText = silverPlan ? `₹${(silverPlan.priceAmount / 100).toLocaleString('en-IN')}` : '₹549';
  const goldPriceText = goldPlan ? `₹${(goldPlan.priceAmount / 100).toLocaleString('en-IN')}` : '₹1,249';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Subscription Management</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review your plan entitlements, upgrade via secure Razorpay checkout, or manage billing renewal.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : message.type === 'info'
              ? 'bg-sky-500/10 border border-sky-500/30 text-sky-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
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
                {sub?.provider && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase font-mono tracking-wider">
                    {sub.provider}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                {currentPlanCode === 'TRIAL'
                  ? '30-day evaluation • 30 mins recording per day'
                  : currentPlanCode === 'SILVER'
                  ? `Unlimited local recording • ${silverPriceText}/month`
                  : `Unlimited recording + AI Meeting Intelligence • ${goldPriceText}/month`}
              </p>
            </div>
          </div>

          {/* Renewal Actions */}
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
              {sub?.currentPeriodStart
                ? new Date(sub.currentPeriodStart).toLocaleDateString()
                : user?.trial?.startedAt
                ? new Date(user.trial.startedAt).toLocaleDateString()
                : user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
          <div>
            <span className="block text-zinc-500 text-[11px]">Next Renewal / Expiry</span>
            <span className="font-medium text-zinc-200">
              {sub?.currentPeriodEnd
                ? new Date(sub.currentPeriodEnd).toLocaleDateString()
                : user?.trial?.expiresAt
                ? new Date(user.trial.expiresAt).toLocaleDateString()
                : user?.createdAt
                ? new Date(new Date(user.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
          <div>
            <span className="block text-zinc-500 text-[11px]">Auto-Renew</span>
            <span className="font-medium text-zinc-200">
              {sub ? (sub.cancelAtPeriodEnd ? 'Cancels at period end' : 'Enabled') : 'Trial Evaluation'}
            </span>
          </div>
          <div>
            <span className="block text-zinc-500 text-[11px]">Billing Currency</span>
            <span className="font-medium text-zinc-200">{sub?.plan?.currency || 'INR'}</span>
          </div>
        </div>
      </Card>

      {/* Available Plans Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Available Plans</h2>
            <p className="text-xs text-zinc-400">Upgrade anytime using Razorpay payment link or instant checkout.</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 border border-white/10 px-2.5 py-1 rounded-lg">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Razorpay Verified</span>
          </div>
        </div>

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
              <div className="text-2xl font-bold text-white">₹0</div>
              <p className="text-xs text-zinc-400">30 minutes recording per day</p>
              <ul className="space-y-2 pt-3 border-t border-white/10 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> 30-day evaluation
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Google Meet auto-record
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Echo cancellation
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Button size="sm" variant="outline" disabled className="w-full">
                {currentPlanCode === 'TRIAL' ? 'Current Plan' : 'Free Trial'}
              </Button>
            </div>
          </Card>

          {/* Silver Card */}
          <Card
            variant="elevated"
            className={`p-6 flex flex-col justify-between border transition-all ${
              currentPlanCode === 'SILVER'
                ? 'border-rose-500/50 bg-rose-950/20 shadow-lg shadow-rose-500/10'
                : 'border-white/10 hover:border-rose-500/30'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-rose-300">Silver Plan</span>
                {currentPlanCode === 'SILVER' && <Badge variant="rose">Current</Badge>}
              </div>
              <div className="text-2xl font-bold text-white">
                {silverPriceText} <span className="text-xs font-normal text-zinc-400">/ mo</span>
              </div>
              <p className="text-xs text-zinc-400">Unlimited daily meeting recording</p>
              <ul className="space-y-2 pt-3 border-t border-white/10 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-400" /> Unlimited recording time
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-400" /> Hardware acceleration
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-400" /> Screenshots & multi-monitor
                </li>
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
                  className="w-full shadow-rose-500/20"
                  isLoading={paymentLoading && selectedPlanCode === 'SILVER'}
                  onClick={() => handleInitiateRazorpay('SILVER')}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{currentPlanCode === 'GOLD' ? 'Switch to Silver' : 'Upgrade to Silver'}</span>
                </Button>
              )}
            </div>
          </Card>

          {/* Gold Card */}
          <Card
            variant="elevated"
            className={`p-6 flex flex-col justify-between border transition-all ${
              currentPlanCode === 'GOLD'
                ? 'border-amber-500/50 bg-amber-950/20 shadow-lg shadow-amber-500/10'
                : 'border-amber-500/30 hover:border-amber-500/60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-amber-300">Gold Plan</span>
                {currentPlanCode === 'GOLD' && <Badge variant="amber">Current</Badge>}
              </div>
              <div className="text-2xl font-bold text-white">
                {goldPriceText} <span className="text-xs font-normal text-zinc-400">/ mo</span>
              </div>
              <p className="text-xs text-zinc-400">Full Recording + AI Meeting Intelligence</p>
              <ul className="space-y-2 pt-3 border-t border-white/10 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" /> Everything in Silver
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" /> Automated transcription
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" /> AI Meeting Summary & Actions
                </li>
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
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold shadow-lg shadow-amber-500/20"
                  isLoading={paymentLoading && selectedPlanCode === 'GOLD'}
                  onClick={() => handleInitiateRazorpay('GOLD')}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upgrade to Gold</span>
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Razorpay Payment Link Modal */}
      {paymentModalOpen && paymentData && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12131a] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Upgrade to {paymentData.plan.name}
                  </h3>
                  <Badge variant={paymentData.plan.code === 'GOLD' ? 'amber' : 'rose'}>
                    {paymentData.plan.code}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Complete payment via Razorpay Payment Link or instant checkout popup.
                </p>
              </div>

              <button
                onClick={() => setPaymentModalOpen(false)}
                disabled={verifyingPayment}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Price Breakdown Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-900/90 to-zinc-900/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Total Subscription Due</span>
                <span className="text-2xl font-bold font-heading text-white">
                  ₹{(paymentData.amount / 100).toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-normal text-zinc-400">/ month</span>
                </span>
              </div>

              <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
                <div>
                  <span className="text-zinc-500">Billing Cycle:</span>{' '}
                  <span className="text-zinc-200">Monthly Recurring</span>
                </div>
                <div>
                  <span className="text-zinc-500">Payment Gateway:</span>{' '}
                  <span className="text-rose-400 font-medium">Razorpay</span>
                </div>
              </div>
            </div>

            {/* Razorpay Payment Actions */}
            <div className="space-y-3">
              {/* Action 1: Instant Razorpay Modal Checkout */}
              <Button
                type="button"
                size="md"
                variant="primary"
                onClick={handleLaunchRazorpayPopup}
                isLoading={verifyingPayment}
                className="w-full shadow-lg shadow-rose-500/20 py-3 text-sm font-semibold"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹{(paymentData.amount / 100).toLocaleString('en-IN')} via Razorpay</span>
              </Button>

              {/* Action 2: Open Razorpay Payment Link */}
              <div className="flex items-center gap-2">
                <a
                  href={paymentData.paymentLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 border border-white/10 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Open Razorpay Payment Page</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyPaymentLink}
                  className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 border border-white/10 flex items-center gap-1.5 transition-colors"
                  title="Copy payment link"
                >
                  {copiedLink ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Direct Link Information */}
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span className="text-zinc-500">Razorpay Payment Link:</span>
                <span className="font-mono text-zinc-400 text-[10px]">{paymentData.paymentLinkId}</span>
              </div>
              <p className="text-[11px] font-mono text-zinc-300 truncate bg-zinc-900/60 px-2 py-1 rounded border border-white/5 select-all">
                {paymentData.paymentLinkUrl}
              </p>
            </div>

            {/* Test Simulation Mode / Manual Completion */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Supports UPI, Cards, NetBanking</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleManualPaymentCompleted}
                  isLoading={verifyingPayment}
                  className="w-full sm:w-auto text-xs"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>I've Completed Payment</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
