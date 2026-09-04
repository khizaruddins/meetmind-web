'use client';

import React, { useEffect, useState } from 'react';
import { Video, Search, Filter, HardDrive, Info } from 'lucide-react';
import { customerApi } from '../../../lib/api/customer';
import { RecordingMetadata } from '../../../lib/types';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../../components/shared/EmptyState';

export default function CustomerRecordingsPage() {
  const [recordings, setRecordings] = useState<RecordingMetadata[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    customerApi
      .getRecordings()
      .then((res) => {
        setRecordings(res.recordings || []);
        setTotal(res.total || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatSeconds = (sec: number = 0) => {
    const hours = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const remainingSec = sec % 60;
    if (hours > 0) return `${hours}:${String(mins).padStart(2, '0')}:${String(remainingSec).padStart(2, '0')}`;
    return `${mins}:${String(remainingSec).padStart(2, '0')}`;
  };

  const filtered = recordings.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.platform.toLowerCase().includes(search.toLowerCase())
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

        {/* Local Storage Privacy Reminder */}
        <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 flex items-center gap-2 text-xs text-zinc-300">
          <HardDrive className="w-4 h-4 text-emerald-400" />
          <span>Local MP4 storage: video files remain on your physical drive</span>
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
              placeholder="Search meetings by title or platform..."
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
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-mono">{formatSeconds(rec.durationSeconds)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/5 text-[11px]">
                        {rec.platform}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-400">{rec.captureMode || 'Auto'}</td>
                    <td className="py-3 px-3 text-zinc-400">{rec.deviceName || 'Desktop App'}</td>
                    <td className="py-3 px-3">
                      <Badge variant={rec.status === 'COMPLETED' ? 'emerald' : 'rose'} size="sm">
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
