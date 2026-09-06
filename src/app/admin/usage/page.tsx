'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api/admin';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { BarChart3, Clock, Video, Monitor, Apple, Terminal } from 'lucide-react';

export default function AdminUsageAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getUsageAnalytics()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton rows={6} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">System Usage Analytics</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Aggregated capture telemetry, meeting lengths, platform distribution, and app versions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <Card variant="elevated" className="p-6 border-white/10 space-y-2 bg-[#10121a]">
          <span className="text-xs text-zinc-400 font-semibold">Average Meeting Duration</span>
          <div className="text-3xl font-bold text-white font-heading">
            {data?.averageDurationMinutes ?? 0} mins
          </div>
          <p className="text-[11px] text-zinc-500">Computed live from {data?.totalRecordings ?? 0} meeting recordings</p>
        </Card>

        {/* Metric 2 */}
        <Card variant="elevated" className="p-6 border-white/10 space-y-2 bg-[#10121a]">
          <span className="text-xs text-zinc-400 font-semibold">Total Minutes Recorded</span>
          <div className="text-3xl font-bold text-white font-heading">
            {data?.totalMinutes ?? 0} mins
          </div>
          <p className="text-[11px] text-zinc-500">Across all registered user machines in DB</p>
        </Card>

        {/* Metric 3 */}
        <Card variant="elevated" className="p-6 border-white/10 space-y-2 bg-[#10121a]">
          <span className="text-xs text-zinc-400 font-semibold">Automatic Detection Rate</span>
          <div className="text-3xl font-bold text-emerald-400 font-heading">
            {data?.autoDetectionRatePercent ?? 0}%
          </div>
          <p className="text-[11px] text-zinc-500">Automated extension triggers vs manual starts</p>
        </Card>
      </div>

      {/* OS & Platform Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="elevated" className="p-6 border-white/10 space-y-4 bg-[#10121a]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Monitor className="w-4 h-4 text-sky-400" />
            <span>Operating System Breakdown (Windows, Linux, macOS)</span>
          </h3>

          <div className="space-y-4 text-xs">
            {data?.osBreakdown && data.osBreakdown.length > 0 ? (
              data.osBreakdown.map((item: any) => {
                const colorClass =
                  item.os.toLowerCase().includes('win')
                    ? 'bg-sky-500'
                    : item.os.toLowerCase().includes('mac')
                    ? 'bg-amber-500'
                    : 'bg-emerald-500';
                return (
                  <div key={item.os} className="space-y-1.5">
                    <div className="flex justify-between text-zinc-300">
                      <span className="font-medium">{item.os}</span>
                      <span className="font-semibold text-white">
                        {item.count} devices ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colorClass}`}
                        style={{ width: `${Math.max(item.percentage, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-zinc-500">No client devices registered yet.</p>
            )}
          </div>
        </Card>

        <Card variant="elevated" className="p-6 border-white/10 space-y-4 bg-[#10121a]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-rose-400" />
            <span>Usage by Subscription Tier</span>
          </h3>

          <div className="space-y-4 text-xs">
            {data?.tierBreakdown && data.tierBreakdown.length > 0 ? (
              data.tierBreakdown.map((item: any) => {
                const colorClass =
                  item.tier === 'GOLD'
                    ? 'bg-amber-500'
                    : item.tier === 'ENTERPRISE'
                    ? 'bg-purple-500'
                    : item.tier === 'SILVER'
                    ? 'bg-rose-500'
                    : 'bg-zinc-500';
                return (
                  <div key={item.tier} className="space-y-1.5">
                    <div className="flex justify-between text-zinc-300">
                      <span className="font-medium">{item.name || item.tier}</span>
                      <span className="font-semibold text-white">
                        {item.count} users ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colorClass}`}
                        style={{ width: `${Math.max(item.percentage, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-zinc-500">No subscriber data recorded yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
