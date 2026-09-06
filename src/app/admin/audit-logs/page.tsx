'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api/admin';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { ShieldCheck, Terminal, Globe } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getAuditLogs({ limit: 50 })
      .then((res: any) => setLogs(res.logs || res.data || res.items || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatMetadata = (metadata: any) => {
    if (!metadata) return '—';
    if (typeof metadata === 'string') return metadata;
    try {
      return Object.entries(metadata)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
        .join(' | ');
    } catch {
      return JSON.stringify(metadata);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Administrative Audit Trail</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Cryptographically recorded log of administrative actions, plan mutations, and security events ({logs.length} logged events).
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
                  <th className="py-2.5 px-3">Actor</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Target Entity</th>
                  <th className="py-2.5 px-3">Event Metadata / Reason</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-semibold text-white">
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant={log.actorType === 'ADMIN' ? 'amber' : 'zinc'}
                          size="sm"
                        >
                          {log.actorType || 'ADMIN'}
                        </Badge>
                        <span className="font-mono text-[11px] text-zinc-400">
                          {log.actorEmail || (log.actorId ? `${log.actorId.slice(0, 8)}...` : 'System')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[11px] text-emerald-400">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-zinc-300">
                      <span className="text-zinc-500 mr-1">[{log.entityType || 'SYSTEM'}]</span>
                      {log.entityId ? `${log.entityId.slice(0, 10)}...` : 'Global'}
                    </td>
                    <td className="py-3 px-3 text-zinc-300 font-mono text-[11px]">
                      {formatMetadata(log.metadataJson || log.metadata || log.details)}
                    </td>
                    <td className="py-3 px-3 text-zinc-500 font-mono text-[11px]">
                      {log.ipAddress || 'Internal'}
                    </td>
                    <td className="py-3 px-3 text-zinc-400">
                      {new Date(log.createdAt || log.timestamp).toLocaleString()}
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
