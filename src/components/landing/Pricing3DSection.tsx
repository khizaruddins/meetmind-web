'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, Shield, Clock, ArrowRight, Building2 } from 'lucide-react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';

interface PlanItem {
  id: string;
  code: string;
  name: string;
  description?: string;
  priceAmount: number;
  currency: string;
  billingInterval?: string;
  trialDays?: number;
  dailyRecordingLimitSeconds?: number | null;
}

export const Pricing3DSection: React.FC = () => {
  const [plans, setPlans] = useState<PlanItem[]>([
    {
      id: 'trial',
      code: 'TRIAL',
      name: 'Free Trial',
      description: '30-day evaluation period',
      priceAmount: 0,
      currency: 'INR',
      trialDays: 30,
      dailyRecordingLimitSeconds: 1800,
    },
    {
      id: 'silver',
      code: 'SILVER',
      name: 'Silver Plan',
      description: 'Unlimited daily local recording',
      priceAmount: 54900,
      currency: 'INR',
    },
    {
      id: 'gold',
      code: 'GOLD',
      name: 'Gold Plan',
      description: 'Full Recording + AI Meeting Intelligence',
      priceAmount: 124900,
      currency: 'INR',
    },
  ]);

  useEffect(() => {
    fetch('/api/v1/plans')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          const list = data.plans || (Array.isArray(data) ? data : []);
          if (list.length > 0) {
            // Sort by price
            list.sort((a: PlanItem, b: PlanItem) => (a.priceAmount || 0) - (b.priceAmount || 0));
            setPlans(list);
          }
        }
      })
      .catch(() => {});
  }, []);

  const getPlanFeatures = (plan: PlanItem) => {
    if (plan.code === 'TRIAL') {
      return [
        '30 recording minutes per day',
        'Google Meet auto-recording',
        'Local MP4 export',
        'System + Microphone audio capture',
        'Acoustic Echo Cancellation (AEC)',
      ];
    }
    if (plan.code === 'SILVER') {
      return [
        'Unlimited recording time',
        'Hardware acceleration (NVENC/VAAPI)',
        'Full screen, window & region capture',
        'PNG & JPEG screenshot engine',
        'Crash recovery auto-remuxing',
        'Desktop session management',
      ];
    }
    if (plan.code === 'GOLD') {
      return [
        'Everything in Silver plan',
        'Automated speech transcription',
        'AI Meeting Summary & Notes',
        'Extracted Action Items & Owners',
        'Key Decisions & Timelines',
        'Executive Briefing Generation',
      ];
    }
    if (plan.code === 'ENTERPRISE') {
      return [
        'Everything in Gold plan',
        'Dedicated Enterprise account support',
        'Custom daily recording limits',
        'Team-wide centralized billing',
        'Custom SSO & security onboarding',
        'SLA & priority feature access',
      ];
    }
    return [
      plan.description || 'Full featured recording tier',
      'High fidelity audio and video capture',
      'Unlimited local MP4 remuxing',
      'Priority customer support',
    ];
  };

  const getPlanIcon = (code: string) => {
    switch (code) {
      case 'TRIAL':
        return <Clock className="w-4 h-4 text-zinc-400" />;
      case 'SILVER':
        return <Shield className="w-4 h-4 text-rose-400" />;
      case 'GOLD':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      default:
        return <Building2 className="w-4 h-4 text-purple-400" />;
    }
  };

  const getPlanBorderColor = (code: string) => {
    switch (code) {
      case 'TRIAL':
        return 'border-white/10';
      case 'SILVER':
        return 'border-rose-500/30 bg-gradient-to-b from-rose-500/[0.05] to-transparent';
      case 'GOLD':
        return 'border-amber-500/40 bg-gradient-to-b from-amber-500/[0.08] to-transparent shadow-2xl shadow-amber-500/10 relative';
      case 'ENTERPRISE':
        return 'border-purple-500/40 bg-gradient-to-b from-purple-500/[0.08] to-transparent shadow-2xl shadow-purple-500/10 relative';
      default:
        return 'border-white/10';
    }
  };

  return (
    <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <Badge variant="amber">Transparent Commercial Plans</Badge>
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
          Start Free. Upgrade When You Need Unlimited Power.
        </h2>
        <p className="text-sm text-zinc-400">
          Every new account includes a 30-day trial with 30 minutes of recording per day. No credit card required.
        </p>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(plans.length, 4)} gap-8 items-stretch`}
      >
        {plans.map((plan) => {
          const isGold = plan.code === 'GOLD';
          const isEnterprise = plan.code === 'ENTERPRISE';
          const isTrial = plan.code === 'TRIAL';
          const features = getPlanFeatures(plan);
          const priceDisplay =
            plan.priceAmount === 0
              ? '₹0'
              : `₹${((plan.priceAmount || 0) / 100).toLocaleString('en-IN')}`;

          return (
            <Card
              key={plan.id || plan.code}
              variant="elevated"
              className={`p-8 flex flex-col justify-between ${getPlanBorderColor(plan.code)}`}
            >
              {isGold && (
                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-bold uppercase tracking-wider shadow">
                  Most Popular
                </div>
              )}
              {isEnterprise && (
                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                  Enterprise
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-semibold ${
                      isGold
                        ? 'text-amber-300'
                        : isEnterprise
                        ? 'text-purple-300'
                        : plan.code === 'SILVER'
                        ? 'text-rose-300'
                        : 'text-zinc-300'
                    }`}
                  >
                    {plan.name}
                  </span>
                  <span className="p-2 rounded-xl bg-zinc-800/80">{getPlanIcon(plan.code)}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white font-heading">{priceDisplay}</span>
                    {!isTrial && <span className="text-xs text-zinc-400">/ month</span>}
                  </div>
                  <p className="text-xs text-zinc-400">
                    {plan.description || (isTrial ? '30-day evaluation period' : 'Commercial monthly subscription')}
                  </p>
                </div>

                <ul className="space-y-3 pt-6 border-t border-white/10 text-xs text-zinc-300">
                  {features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check
                        className={`w-4 h-4 flex-shrink-0 ${
                          isGold
                            ? 'text-amber-400'
                            : isEnterprise
                            ? 'text-purple-400'
                            : plan.code === 'SILVER'
                            ? 'text-rose-400'
                            : 'text-emerald-400'
                        }`}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link href="/register" className="w-full block">
                  <Button
                    variant={isGold ? 'primary' : isEnterprise ? 'primary' : 'outline'}
                    size="md"
                    className={`w-full ${
                      isGold
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold shadow-amber-500/20'
                        : isEnterprise
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold shadow-purple-500/20'
                        : ''
                    }`}
                  >
                    <span>{isTrial ? 'Start 30-Day Trial' : `Choose ${plan.name}`}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
