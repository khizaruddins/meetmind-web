'use client';

import React, { useEffect, useState } from 'react';
import { customerApi } from '../../../lib/api/customer';
import { DeviceInfo } from '../../../lib/types';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../../components/shared/EmptyState';
import { Laptop, Monitor, Apple, Terminal, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function CustomerDevicesPage() {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDevices = () => {
    setLoading(true);
    customerApi
      .getDevices()
      .then((res) => setDevices(res.devices || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const handleRevoke = async (id: string) => {
    if (!confirm('Revoke this device? It will be signed out from recording.')) return;
    try {
      await customerApi.revokeDevice(id);
      loadDevices();
    } catch (err) {
      console.error(err);
    }
  };

  const getDeviceIcon = (platform: string = '') => {
    const p = platform.toLowerCase();
    if (p.includes('win')) return Monitor;
    if (p.includes('mac') || p.includes('apple')) return Apple;
    return Terminal;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Registered Devices</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Devices authorized to use your MeetMind license and record meetings.
          </p>
        </div>
      </div>

      <Card variant="elevated" className="p-6 border-white/10 space-y-4">
        {loading ? (
          <LoadingSkeleton rows={4} />
        ) : devices.length > 0 ? (
          <div className="space-y-3">
            {devices.map((device) => {
              const Icon = getDeviceIcon(device.platform);
              const isRevoked = device.status === 'REVOKED';

              return (
                <div
                  key={device.id}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                    isRevoked
                      ? 'bg-zinc-950/40 border-rose-500/20 opacity-60'
                      : 'bg-zinc-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-zinc-800 text-white">
                      <Icon className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">{device.deviceName}</h4>
                        <Badge variant={isRevoked ? 'rose' : 'emerald'} size="sm">
                          {device.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {device.platform} • App Version {device.appVersion || '1.0.0'} • Last Active:{' '}
                        {new Date(device.lastSeenAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {!isRevoked && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRevoke(device.id)}
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    >
                      Revoke Device
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Laptop}
            title="No devices registered"
            description="Launch the MeetMind desktop application and sign in with your account to register this computer."
          />
        )}
      </Card>
    </div>
  );
}
