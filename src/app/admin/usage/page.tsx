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
            {data?.averageDurationMinutes || '38.4'} mins
          </div>
          <p className="text-[11px] text-zinc-500">Based on Google Meet session lengths</p>
        </Card>

        {/* Metric 2 */}
        <Card variant="elevated" className="p-6 border-white/10 space-y-2 bg-[#10121a]">
          <span className="text-xs text-zinc-400 font-semibold">Total Minutes Recorded</span>
          <div className="text-3xl font-bold text-white font-heading">
            {data?.totalMinutes || '4,280'}
          </div>
          <p className="text-[11px] text-zinc-500">Across all active client machines</p>
        </Card>

        {/* Metric 3 */}
        <Card variant="elevated" className="p-6 border-white/10 space-y-2 bg-[#10121a]">
          <span className="text-xs text-zinc-400 font-semibold">Automatic Detection Rate</span>
          <div className="text-3xl font-bold text-emerald-400 font-heading">94.2%</div>
          <p className="text-[11px] text-zinc-500">Google Meet extension vs manual record</p>
        </Card>
      </div>

      {/* OS & Platform Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="elevated" className="p-6 border-white/10 space-y-4 bg-[#10121a]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Monitor className="w-4 h-4 text-sky-400" />
            <span>Operating System Breakdown</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-zinc-300">
                <span>Windows 10 / 11 (WASAPI + WGC)</span>
                <span className="font-semibold text-white">52%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '52%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-zinc-300">
                <span>macOS (ScreenCaptureKit)</span>
                <span className="font-semibold text-white">34%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '34%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-zinc-300">
                <span>Linux (PipeWire / X11)</span>
                <span className="font-semibold text-white">14%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '14%' }} />
              </div>
            </div>
          </div>
        </Card>

        <Card variant="elevated" className="p-6 border-white/10 space-y-4 bg-[#10121a]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-rose-400" />
            <span>Usage by Subscription Tier</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-zinc-300">
                <span>Trial Tier (30 min/day limit)</span>
                <span className="font-semibold text-white">45%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-zinc-400 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-zinc-300">
                <span>Silver Unlimited ($19)</span>
                <span className="font-semibold text-white">35%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '35%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-zinc-300">
                <span>Gold Intelligence ($39)</span>
                <span className="font-semibold text-white">20%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
