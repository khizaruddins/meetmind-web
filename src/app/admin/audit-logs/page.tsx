'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api/admin';
import { AuditLogItem } from '../../../lib/types';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { ShieldCheck, UserCheck, Terminal } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getAuditLogs({ limit: 50 })
      .then((res) => setLogs(res.logs || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Administrative Audit Trail</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Cryptographically recorded log of all manual administrative actions and plan overrides.
        </p>
      </div>

      <Card variant="elevated" className="p-6 border-white/10 space-y-4 bg-[#10121a]">
        {loading ? (
          <LoadingSkeleton rows={5} />
        ) : logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-400">
                  <th className="py-2.5 px-3">Administrator</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Target Client</th>
                  <th className="py-2.5 px-3">Details / Reason</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-semibold text-white">{log.adminEmail}</td>
                    <td className="py-3 px-3">
                      <Badge variant="amber" size="sm">{log.action}</Badge>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-zinc-300">
                      {log.targetEmail || log.targetId}
                    </td>
                    <td className="py-3 px-3 text-zinc-400">
                      {log.details ? JSON.stringify(log.details) : 'Administrative intervention'}
                    </td>
                    <td className="py-3 px-3 text-zinc-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-400 text-xs">
            No administrative actions recorded in the current audit window.
          </div>
        )}
      </Card>
    </div>
  );
}
