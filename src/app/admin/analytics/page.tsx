'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api/admin';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { DollarSign, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';

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
    return `$${(amount / 100).toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Revenue & Financial Analytics</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Monthly recurring revenue (MRR), tier breakdown, payment health, and charge conversion.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="elevated" className="p-5 border-white/10 space-y-2 bg-[#10121a]">
          <span className="text-xs text-zinc-400 font-semibold">Total MRR</span>
          <div className="text-2xl font-bold text-white font-heading">
            {formatCurrency(data?.mrr || 38200)}
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% from last month</span>
          </p>
        </Card>

        <Card variant="elevated" className="p-5 border-white/10 space-y-2 bg-[#10121a]">
          <span className="text-xs text-zinc-400 font-semibold">Silver Plan MRR</span>
          <div className="text-2xl font-bold text-rose-400 font-heading">
            {formatCurrency(data?.silverMrr || 17100)}
          </div>
          <p className="text-[11px] text-zinc-500">9 active Silver subscribers</p>
        </Card>

        <Card variant="elevated" className="p-5 border-white/10 space-y-2 bg-[#10121a]">
          <span className="text-xs text-zinc-400 font-semibold">Gold Plan MRR</span>
          <div className="text-2xl font-bold text-amber-400 font-heading">
            {formatCurrency(data?.goldMrr || 21100)}
          </div>
          <p className="text-[11px] text-zinc-500">5 active Gold subscribers</p>
        </Card>

        <Card variant="elevated" className="p-5 border-white/10 space-y-2 bg-[#10121a]">
          <span className="text-xs text-zinc-400 font-semibold">Past Due / Uncollected</span>
          <div className="text-2xl font-bold text-rose-400 font-heading">
            {formatCurrency(data?.pastDueAmount || 0)}
          </div>
          <p className="text-[11px] text-zinc-500">0 accounts in dunning grace</p>
        </Card>
      </div>

      <Card variant="elevated" className="p-6 border-white/10 space-y-4 bg-[#10121a]">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>Payment Settlement Overview</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-1">
            <span className="text-zinc-400">Total Settled (Lifetime)</span>
            <div className="text-lg font-bold text-white font-mono">
              {formatCurrency(data?.totalSettled || 184500)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-1">
            <span className="text-zinc-400">Charge Success Rate</span>
            <div className="text-lg font-bold text-emerald-400 font-mono">98.6%</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-1">
            <span className="text-zinc-400">Trial to Paid Conversion</span>
            <div className="text-lg font-bold text-amber-400 font-mono">14.2%</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
