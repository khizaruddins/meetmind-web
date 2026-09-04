'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api/admin';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { Video, HardDrive, Info } from 'lucide-react';

export default function AdminRecordingsPage() {
  const [recordings, setRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getRecordings()
      .then((res) => setRecordings(res.recordings || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatSeconds = (sec: number = 0) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${mins}m ${remainingSec}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Global Recording Telemetry</h1>
          <p className="text-xs text-zinc-400 mt-1">
            System-wide meeting capture sessions across all active clients.
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 flex items-center gap-2 text-xs text-zinc-300">
          <HardDrive className="w-4 h-4 text-rose-400" />
          <span>Local-First Policy: Raw video/audio files remain on user machines.</span>
        </div>
      </div>

      <Card variant="elevated" className="p-6 border-white/10 space-y-4 bg-[#10121a]">
        {loading ? (
          <LoadingSkeleton rows={5} />
        ) : recordings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-400">
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Meeting Title</th>
                  <th className="py-2.5 px-3">Platform</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Capture Mode</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {recordings.map((rec) => (
                  <tr key={rec.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-medium text-white">{rec.user?.email || rec.userId}</td>
                    <td className="py-3 px-3">{rec.title}</td>
                    <td className="py-3 px-3">{rec.platform}</td>
                    <td className="py-3 px-3 font-mono">{formatSeconds(rec.durationSeconds)}</td>
                    <td className="py-3 px-3 text-zinc-400">{rec.captureMode || 'Auto'}</td>
                    <td className="py-3 px-3">
                      <Badge variant={rec.status === 'COMPLETED' ? 'emerald' : 'rose'} size="sm">
                        {rec.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-zinc-500">
                      {new Date(rec.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-400 text-xs">No recording telemetry records found.</div>
        )}
      </Card>
    </div>
  );
}
