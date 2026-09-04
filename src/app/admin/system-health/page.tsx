'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api/admin';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { HeartPulse, CheckCircle2, AlertTriangle, RefreshCw, Database, Server, Mail, CreditCard, HardDrive, Layers, Shield } from 'lucide-react';

export default function AdminSystemHealthPage() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadHealth = () => {
    setLoading(true);
    adminApi
      .getSystemHealth()
      .then((res) => setHealth(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHealth();
  }, []);

  const serviceMeta: Record<string, { label: string; icon: any }> = {
    api: { label: 'REST API Service', icon: Server },
    database: { label: 'PostgreSQL Database', icon: Database },
    billing: { label: 'Stripe Billing & Subscriptions', icon: CreditCard },
    email: { label: 'Transactional Email Engine', icon: Mail },
    jobs: { label: 'Background Jobs & Workers', icon: HeartPulse },
    backgroundJobs: { label: 'Background Jobs & Workers', icon: HeartPulse },
    webhooks: { label: 'Webhook Ingestion & Deliveries', icon: Layers },
    auth: { label: 'Authentication & Tokens', icon: Shield },
    authentication: { label: 'Authentication & Tokens', icon: Shield },
    recordingAuthorization: { label: 'Recording Auth & Device Verification', icon: CheckCircle2 },
    storage: { label: 'Local MP4 Storage File Watcher', icon: HardDrive },
  };

  const servicesList: Array<{
    key: string;
    label: string;
    status: string;
    latencyMs?: number;
    errorCount?: number;
    failedLast24h?: number;
    lastSuccessfulCheck?: string;
    icon: any;
  }> = [];

  if (health?.services) {
    const seen = new Set<string>();
    for (const [key, val] of Object.entries(health.services) as [string, any][]) {
      // Skip redundant alias keys like queue or duplicate backgroundJobs/jobs
      if (key === 'queue' || (key === 'backgroundJobs' && seen.has('jobs')) || (key === 'authentication' && seen.has('auth'))) {
        continue;
      }
      seen.add(key);
      const meta = serviceMeta[key] || { label: key.toUpperCase(), icon: Server };
      servicesList.push({
        key,
        label: meta.label,
        status: (val?.status || 'HEALTHY').toUpperCase(),
        latencyMs: val?.latencyMs,
        errorCount: val?.errorCount ?? 0,
        failedLast24h: val?.failedLast24h,
        lastSuccessfulCheck: val?.lastSuccessfulCheck,
        icon: meta.icon,
      });
    }
  }

  const overallStatus = (health?.status || health?.overall || 'HEALTHY').toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-heading text-white">System Health & Infrastructure</h1>
            <Badge variant={overallStatus === 'HEALTHY' ? 'emerald' : 'amber'} size="md">
              Overall: {overallStatus}
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time status checks, service latencies, and connectivity telemetry.
          </p>
        </div>

        <Button size="sm" variant="outline" onClick={loadHealth} disabled={loading}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Monitors</span>
        </Button>
      </div>

      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : servicesList.length === 0 ? (
        <Card variant="elevated" className="p-8 text-center text-xs text-zinc-400 border-white/10">
          No health telemetry returned from server.
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((svc) => {
            const Icon = svc.icon;
            const isHealthy = svc.status === 'HEALTHY' || svc.status === 'OK';
            return (
              <Card key={svc.key} variant="elevated" className="p-6 border-white/10 space-y-4 bg-[#10121a]">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl bg-zinc-800 ${isHealthy ? 'text-emerald-400' : 'text-amber-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant={isHealthy ? 'emerald' : 'rose'} size="sm">
                    {svc.status}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{svc.label}</h3>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                    Response Latency: {svc.latencyMs !== undefined ? `${svc.latencyMs}ms` : 'N/A'}
                    {svc.failedLast24h !== undefined ? ` • Failures (24h): ${svc.failedLast24h}` : ''}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>
                    Last check: {svc.lastSuccessfulCheck ? new Date(svc.lastSuccessfulCheck).toLocaleTimeString() : 'Just now'}
                  </span>
                  <span className={`${isHealthy ? 'text-emerald-400' : 'text-rose-400'} flex items-center gap-1 font-mono`}>
                    {isHealthy ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    <span>{svc.errorCount} Errors</span>
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
