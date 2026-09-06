'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api/admin';
import { Card } from '../../../components/shared/Card';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { IndianRupee, TrendingUp, Download, CheckCircle2, Award, Zap } from 'lucide-react';

export default function AdminRevenueAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getRevenueAnalytics()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton rows={6} />;

  const formatCurrency = (amount: number = 0) => {
    return `₹${((amount || 0) / 100).toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Revenue & Financial Analytics</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Live real-time recurring revenue (MRR in INR ₹), tier breakdown, payment health, downloads, and trial conversion.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="elevated" className="p-5 border-white/10 space-y-2 bg-[#10121a]">
          <span className="text-xs text-zinc-400 font-semibold">Total Monthly MRR</span>
          <div className="text-2xl font-bold text-emerald-400 font-heading">
            {formatCurrency(data?.mrr ?? 0)}
          </div>
          <p className="text-[11px] text-zinc-400">
            {data?.paidCount ?? 0} active paid subscriptions
          </p>
        </Card>

        <Card variant="elevated" className="p-5 border-white/10 space-y-2 bg-[#10121a]">
          <span className="text-xs text-zinc-400 font-semibold">Silver Tier MRR</span>
          <div className="text-2xl font-bold text-rose-400 font-heading">
            {formatCurrency(data?.silverMrr ?? 0)}
          </div>
          <p className="text-[11px] text-zinc-500">Live active Silver accounts</p>
        </Card>

        <Card variant="elevated" className="p-5 border-white/10 space-y-2 bg-[#10121a]">
          <span className="text-xs text-zinc-400 font-semibold">Gold Tier MRR</span>
          <div className="text-2xl font-bold text-amber-400 font-heading">
            {formatCurrency(data?.goldMrr ?? 0)}
          </div>
          <p className="text-[11px] text-zinc-500">Live active Gold accounts</p>
        </Card>

        <Card variant="elevated" className="p-5 border-white/10 space-y-2 bg-[#10121a]">
          <span className="text-xs text-zinc-400 font-semibold">Enterprise Tier MRR</span>
          <div className="text-2xl font-bold text-purple-400 font-heading">
            {formatCurrency(data?.enterpriseMrr ?? 0)}
          </div>
          <p className="text-[11px] text-zinc-500">Live active Enterprise accounts</p>
        </Card>
      </div>

      {/* Trial to Paid Conversion & Downloads */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="elevated" className="p-5 border-white/10 space-y-2 bg-[#10121a]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-semibold">Total App Downloads</span>
            <Download className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-heading">
            {data?.totalDownloads ?? 0}
          </div>
          <p className="text-[11px] text-zinc-500">Clients registered & initiated trial period</p>
        </Card>

        <Card variant="elevated" className="p-5 border-white/10 space-y-2 bg-[#10121a]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-semibold">Converted Customers</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-heading">
            {data?.convertedUsers ?? 0}
          </div>
          <p className="text-[11px] text-zinc-500">Converted from trial to paid subscription</p>
        </Card>

        <Card variant="elevated" className="p-5 border-white/10 space-y-2 bg-[#10121a]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-semibold">Conversion Rate</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-heading">
            {data?.conversionRate ?? 0}%
          </div>
          <p className="text-[11px] text-zinc-500">Trial evaluation to paid customer conversion</p>
        </Card>
      </div>

      <Card variant="elevated" className="p-6 border-white/10 space-y-4 bg-[#10121a]">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-emerald-400" />
          <span>Payment Settlement & Invoicing Health</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-1">
            <span className="text-zinc-400">Total Settled (Lifetime)</span>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {formatCurrency(data?.totalSettled ?? 0)}
            </div>
            <p className="text-[11px] text-zinc-500">Lifetime collected payments in DB</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-1">
            <span className="text-zinc-400">Charge Success Rate</span>
            <div className="text-lg font-bold text-white font-mono">
              {data?.chargeSuccessRate ?? 100}%
            </div>
            <p className="text-[11px] text-zinc-500">Settled vs failed charge ratio</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-1">
            <span className="text-zinc-400">Uncollected / Past Due</span>
            <div className="text-lg font-bold text-rose-400 font-mono">
              {formatCurrency(data?.pastDueAmount ?? 0)}
            </div>
            <p className="text-[11px] text-zinc-500">
              {data?.pastDueCount ?? 0} subscriptions currently past due
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
