'use client';

import React, { useEffect, useState } from 'react';
import { Video, Search, HardDrive, RefreshCw } from 'lucide-react';
import { customerApi } from '../../../lib/api/customer';
import { RecordingMetadata } from '../../../lib/types';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../../components/shared/EmptyState';

export default function CustomerRecordingsPage() {
  const [recordings, setRecordings] = useState<RecordingMetadata[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchRecordings = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res: any = await customerApi.getRecordings({ limit: 100 });
      // Handles paginated structure ({ data, pagination: { total } }) or ({ recordings, total }) or raw array
      const rawList = Array.isArray(res) ? res : (res?.data || res?.recordings || res?.items || []);
      let totalCount = res?.pagination?.total ?? res?.total ?? rawList.length;

      let items = rawList;
      // If primary list is empty, also try to fetch dashboard overview as fallback to guarantee sync
      if (items.length === 0) {
        try {
          const overview: any = await customerApi.getDashboardOverview().catch(() => customerApi.getDashboard());
          const recent = overview?.recordings?.recent || overview?.recentRecordings || [];
          if (recent.length > 0) {
            items = recent;
            totalCount = recent.length;
          }
        } catch {
          // ignore fallback error
        }
      }

      const normalized: RecordingMetadata[] = items.map((rec: any) => ({
        id: rec.id || `rec-${Math.random()}`,
        userId: rec.userId || '',
        title: rec.title || rec.meetingTitle || 'Manual Recording',
        platform: rec.platform || rec.meetingPlatform || 'Manual',
        durationSeconds: Number(rec.durationSeconds) || 0,
        captureMode: rec.captureMode || (rec.autoStarted ? 'Auto' : 'Manual'),
        deviceName: rec.deviceName || 'Desktop App',
        status: rec.status || 'COMPLETED',
        createdAt: rec.createdAt || rec.startedAt || new Date().toISOString(),
      }));

      setRecordings(normalized);
      setTotal(totalCount);
    } catch (err) {
      console.error('Failed to load recordings:', err);
      // Fallback to dashboard overview on error
      try {
        const overview: any = await customerApi.getDashboardOverview().catch(() => customerApi.getDashboard());
        const recent = overview?.recordings?.recent || overview?.recentRecordings || [];
        const normalized: RecordingMetadata[] = recent.map((rec: any) => ({
          id: rec.id || `rec-${Math.random()}`,
          userId: rec.userId || '',
          title: rec.title || rec.meetingTitle || 'Manual Recording',
          platform: rec.platform || rec.meetingPlatform || 'Manual',
          durationSeconds: Number(rec.durationSeconds) || 0,
          captureMode: rec.captureMode || (rec.autoStarted ? 'Auto' : 'Manual'),
          deviceName: rec.deviceName || 'Desktop App',
          status: rec.status || 'COMPLETED',
          createdAt: rec.createdAt || rec.startedAt || new Date().toISOString(),
        }));
        setRecordings(normalized);
        setTotal(normalized.length);
      } catch {
        setRecordings([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  const formatSeconds = (sec: number = 0) => {
    const hours = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const remainingSec = sec % 60;
    if (hours > 0) return `${hours}h ${mins}m ${remainingSec}s`;
    return `${mins}m ${remainingSec}s`;
  };

  const filtered = recordings.filter((r) =>
    (r.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.platform || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.deviceName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Recording Metadata History</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Browse duration, platform, and device metadata synchronized from your desktop application.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchRecordings(true)}
            disabled={loading || refreshing}
            className="text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>

          {/* Local Storage Privacy Reminder */}
          <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 flex items-center gap-2 text-xs text-zinc-300">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>Local MP4: video files remain on your physical drive</span>
          </div>
        </div>
      </div>

      <Card variant="elevated" className="p-6 border-white/10 space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search meetings by title, platform, or device..."
              className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton rows={5} />
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-400">
                  <th className="py-2.5 px-3">Meeting Title</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Platform</th>
                  <th className="py-2.5 px-3">Capture Type</th>
                  <th className="py-2.5 px-3">Device</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {filtered.map((rec) => (
                  <tr key={rec.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{rec.title}</td>
                    <td className="py-3 px-3 text-zinc-400">
                      {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="py-3 px-3 font-mono">{formatSeconds(rec.durationSeconds)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/5 text-[11px] capitalize">
                        {rec.platform}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-400">{rec.captureMode || 'Manual'}</td>
                    <td className="py-3 px-3 text-zinc-400">{rec.deviceName || 'Desktop App'}</td>
                    <td className="py-3 px-3">
                      <Badge variant={rec.status === 'COMPLETED' ? 'emerald' : rec.status === 'ACTIVE' || rec.status === 'RECORDING' ? 'amber' : 'rose'} size="sm">
                        {rec.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Video}
            title="No recordings found"
            description={
              search
                ? 'No meetings match your search query.'
                : 'Your meeting history will populate here as you record meetings with the MeetMind desktop client.'
            }
          />
        )}
      </Card>
    </div>
  );
}
