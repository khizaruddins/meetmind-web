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
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

const CANCELLATION_REASONS = [
  'Pricing is too expensive',
  'Not using the service enough',
  'Missing required features',
  'Switched to another platform',
  'Technical or audio recording issues',
  'Temporary break / project ended',
];
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
  const [plans, setPlans] = useState<any[]>([]);
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

  // Cancellation Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReasonOption, setCancelReasonOption] = useState('');
  const [cancelReasonDetails, setCancelReasonDetails] = useState('');

  // Load subscription and plans dynamically from backend API
  const loadSubscription = useCallback(async () => {
    setLoading(true);
    try {
      const [subRes, plansRes] = await Promise.all([
        customerApi.getSubscription().catch(() => ({ subscription: null, availablePlans: [] })),
        customerApi.getPlans().catch(() => ({ plans: [] })),
      ]);

      setSubData(subRes);
      const rawList = plansRes.plans?.length ? plansRes.plans : subRes.availablePlans || [];
      const hasTrial = rawList.some((p: any) => p.code === 'TRIAL');
      const allPlans = hasTrial
        ? rawList
        : [
            {
              id: 'trial',
              code: 'TRIAL',
              name: 'Free Trial',
              description: '30-day evaluation period',
              billingInterval: 'MONTHLY',
              priceAmount: 0,
              currency: 'INR',
              trialDays: 30,
              dailyRecordingLimitSeconds: 1800,
              active: true,
            },
            ...rawList,
          ];
      allPlans.sort((a: any, b: any) => (a.priceAmount || 0) - (b.priceAmount || 0));
      setPlans(allPlans);
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


  const handleCopyPaymentLink = () => {
    if (!paymentData?.paymentLinkUrl) return;
    navigator.clipboard.writeText(paymentData.paymentLinkUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenCancelModal = () => {
    setCancelReasonOption('');
    setCancelReasonDetails('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    setActionLoading(true);
    setMessage(null);
    try {
      let finalReason: string | undefined = undefined;
      const option = cancelReasonOption.trim();
      const details = cancelReasonDetails.trim();
      if (option && details) {
        finalReason = `${option}: ${details}`;
      } else if (option) {
        finalReason = option;
      } else if (details) {
        finalReason = details;
      }

      await customerApi.cancelSubscription(finalReason);
      setCancelModalOpen(false);
      setMessage({
        text: 'Your subscription renewal has been cancelled. Your plan will remain active until the end of the billing period.',
        type: 'success',
      });
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
  const activeSub = sub && sub.status === 'ACTIVE' ? sub : null;
  const isSubActive = Boolean(activeSub);
  const currentPlanCode = activeSub ? activeSub.plan.code.toUpperCase() : 'TRIAL';

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
                <h3 className="text-base font-bold text-white font-heading">
                  {currentPlanCode === 'TRIAL' ? 'Free Evaluation' : `${currentPlanCode} Plan`}
                </h3>
                <Badge variant={activeSub ? 'emerald' : sub?.status === 'PAST_DUE' ? 'rose' : currentPlanCode === 'TRIAL' ? 'amber' : 'zinc'}>
                  {activeSub ? activeSub.status : currentPlanCode === 'TRIAL' ? 'TRIAL' : sub?.status || 'INACTIVE'}
                </Badge>
                {activeSub?.provider && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase font-mono tracking-wider">
                    {activeSub.provider}
                  </span>
                )}
                {sub && sub.status === 'CANCELLED' && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono">
                    Previous {sub.plan?.name || sub.plan?.code} Cancelled
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
          {activeSub && (
            <div>
              {activeSub.cancelAtPeriodEnd ? (
                <Button size="sm" variant="outline" onClick={handleResume} isLoading={actionLoading}>
                  Resume Auto-Renewal
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={handleOpenCancelModal} isLoading={actionLoading}>
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
              {activeSub?.currentPeriodStart
                ? new Date(activeSub.currentPeriodStart).toLocaleDateString()
                : user?.trial?.startedAt
                ? new Date(user.trial.startedAt).toLocaleDateString()
                : user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
          <div>
            <span className="block text-zinc-500 text-[11px]">
              {activeSub ? 'Next Renewal / Expiry' : 'Trial Expiry'}
            </span>
            <span className="font-medium text-zinc-200">
              {activeSub?.currentPeriodEnd
                ? new Date(activeSub.currentPeriodEnd).toLocaleDateString()
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
              {activeSub
                ? activeSub.cancelAtPeriodEnd
                  ? 'Cancels at period end'
                  : 'Enabled'
                : 'Disabled (Trial Evaluation)'}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p) => {
            const isCurrent = currentPlanCode === p.code;
            const isTrial = p.code === 'TRIAL';
            const isGold = p.code === 'GOLD';
            const isEnterprise = p.code === 'ENTERPRISE';
            const isSilver = p.code === 'SILVER';

            const priceText = isTrial
              ? '₹0'
              : `₹${((p.priceAmount || 0) / 100).toLocaleString('en-IN')}`;

            const features = isTrial
              ? [
                  '30-day evaluation',
                  '30 minutes recording per day',
                  'Google Meet auto-record',
                  'Echo cancellation',
                ]
              : isSilver
              ? [
                  'Unlimited recording time',
                  'Hardware acceleration',
                  'Screenshots & multi-monitor',
                  'Crash recovery auto-remuxing',
                ]
              : isGold
              ? [
                  'Everything in Silver',
                  'Automated speech transcription',
                  'AI Meeting Summary & Notes',
                  'Extracted Action Items & Decisions',
                ]
              : isEnterprise
              ? [
                  'Everything in Gold',
                  'Dedicated Enterprise support',
                  'Custom daily recording limits',
                  'Team-wide centralized billing',
                ]
              : [
                  p.description || 'Full featured recording tier',
                  'High fidelity capture engine',
                  'Unlimited local MP4 remuxing',
                  'Priority support',
                ];

            return (
              <Card
                key={p.id || p.code}
                variant="elevated"
                className={`p-6 flex flex-col justify-between border transition-all ${
                  isCurrent
                    ? isGold
                      ? 'border-amber-500/50 bg-amber-950/20 shadow-lg shadow-amber-500/10'
                      : isEnterprise
                      ? 'border-purple-500/50 bg-purple-950/20 shadow-lg shadow-purple-500/10'
                      : isSilver
                      ? 'border-rose-500/50 bg-rose-950/20 shadow-lg shadow-rose-500/10'
                      : 'border-zinc-500/50 bg-zinc-900/40'
                    : isGold
                    ? 'border-amber-500/30 hover:border-amber-500/60'
                    : isEnterprise
                    ? 'border-purple-500/30 hover:border-purple-500/60'
                    : isSilver
                    ? 'border-white/10 hover:border-rose-500/30'
                    : 'border-white/10'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-semibold ${
                        isGold
                          ? 'text-amber-300'
                          : isEnterprise
                          ? 'text-purple-300'
                          : isSilver
                          ? 'text-rose-300'
                          : 'text-zinc-200'
                      }`}
                    >
                      {p.name}
                    </span>
                    {isCurrent && (
                      <Badge
                        variant={
                          isGold
                            ? 'amber'
                            : isEnterprise
                            ? 'indigo'
                            : isSilver
                            ? 'rose'
                            : 'zinc'
                        }
                      >
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {priceText}{' '}
                    {!isTrial && <span className="text-xs font-normal text-zinc-400">/ mo</span>}
                  </div>
                  <p className="text-xs text-zinc-400">
                    {p.description || (isTrial ? '30-day evaluation period' : 'Monthly commercial subscription')}
                  </p>
                  <ul className="space-y-2 pt-3 border-t border-white/10 text-xs text-zinc-300">
                    {features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check
                          className={`w-3.5 h-3.5 flex-shrink-0 ${
                            isGold
                              ? 'text-amber-400'
                              : isEnterprise
                              ? 'text-purple-400'
                              : isSilver
                              ? 'text-rose-400'
                              : 'text-emerald-400'
                          }`}
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  {isCurrent ? (
                    <Button size="sm" variant="outline" disabled className="w-full">
                      Active Plan
                    </Button>
                  ) : isTrial ? (
                    <Button size="sm" variant="outline" disabled className="w-full">
                      Free Trial
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant={isGold ? 'primary' : isEnterprise ? 'primary' : 'primary'}
                      className={`w-full ${
                        isGold
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold shadow-lg shadow-amber-500/20'
                          : isEnterprise
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-purple-500/20'
                          : 'shadow-rose-500/20'
                      }`}
                      isLoading={paymentLoading && selectedPlanCode === p.code}
                      onClick={() => handleInitiateRazorpay(p.code)}
                    >
                      {isGold ? (
                        <Sparkles className="w-3.5 h-3.5" />
                      ) : (
                        <CreditCard className="w-3.5 h-3.5" />
                      )}
                      <span>Upgrade to {p.name}</span>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
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

            {/* Payment security info */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Supports UPI, Cards, NetBanking</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">Secured by Razorpay</span>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12131a] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Cancel Subscription Renewal
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    We're sorry to see you go. Let us know how we can improve.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                disabled={actionLoading}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Prompt Callout */}
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1.5">
              <p className="text-xs font-semibold text-rose-200">
                Are you sure you want to cancel your subscription renewal?
              </p>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Your <strong className="text-white font-medium">{sub?.plan?.name || 'current'}</strong> plan benefits will remain fully active until{' '}
                <span className="text-rose-300 font-medium">
                  {sub?.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : 'the end of your billing cycle'}
                </span>
                . After that, auto-renewal stops and your account reverts to the Free tier. You will not be charged again.
              </p>
            </div>

            {/* Optional Reason Selection */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-300">
                  Why are you cancelling? <span className="text-zinc-500 font-normal">(optional)</span>
                </label>
                {cancelReasonOption && (
                  <button
                    type="button"
                    onClick={() => setCancelReasonOption('')}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300 underline"
                  >
                    Clear selection
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CANCELLATION_REASONS.map((reason) => {
                  const isSelected = cancelReasonOption === reason;
                  return (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setCancelReasonOption(isSelected ? '' : reason)}
                      className={`text-left text-xs px-3 py-2 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-rose-500/15 border-rose-500/50 text-rose-200 font-medium shadow-sm shadow-rose-500/10'
                          : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:border-white/15 hover:text-zinc-200'
                      }`}
                    >
                      {reason}
                    </button>
                  );
                })}
              </div>

              {/* Optional Detailed Feedback */}
              <div className="pt-1">
                <textarea
                  value={cancelReasonDetails}
                  onChange={(e) => setCancelReasonDetails(e.target.value)}
                  placeholder="Additional feedback or thoughts (optional)..."
                  rows={3}
                  className="w-full text-xs bg-zinc-900/70 border border-white/10 rounded-xl px-3 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 resize-none transition-colors"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-white/10 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setCancelModalOpen(false)}
                disabled={actionLoading}
                className="w-full sm:w-auto text-xs"
              >
                Keep My Subscription
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleConfirmCancel}
                isLoading={actionLoading}
                className="w-full sm:w-auto text-xs font-semibold"
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
