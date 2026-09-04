'use client';

import React from 'react';
import { Card } from '../../../../components/shared/Card';
import { Badge } from '../../../../components/shared/Badge';
import { Activity, LogIn, Laptop, Video, Sparkles, CreditCard, Key } from 'lucide-react';
import { useAuth } from '../../../../lib/auth-context';

export default function CustomerActivityPage() {
  const { user } = useAuth();

  const activities = [
    {
      id: 1,
      icon: LogIn,
      title: 'Authenticated on Web Portal',
      detail: 'Session started from browser',
      time: 'Just now',
      badge: 'Auth',
    },
    {
      id: 2,
      icon: Laptop,
      title: 'Desktop Device Synchronized',
      detail: 'Registered Linux Desktop Client (Version 1.0.0)',
      time: 'Today at 09:40',
      badge: 'Device',
    },
    {
      id: 3,
      icon: Video,
      title: 'Google Meet Session Recorded',
      detail: 'Auto-recorded 43m 12s meeting with system audio & mic',
      time: 'Today at 08:30',
      badge: 'Capture',
    },
    {
      id: 4,
      icon: Sparkles,
      title: '30-Day Free Trial Activated',
      detail: 'Allocated 30 daily recording minutes and local MP4 export',
      time: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recent',
      badge: 'Plan',
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Account Activity Timeline</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Recent operational events, device authentications, and plan updates associated with your account.
        </p>
      </div>

      <Card variant="elevated" className="p-6 border-white/10 space-y-4">
        <div className="space-y-4">
          {activities.map((act) => {
            const Icon = act.icon;
            return (
              <div key={act.id} className="flex items-start gap-3.5 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                <div className="p-2 rounded-xl bg-zinc-800 text-rose-400 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white">{act.title}</h4>
                    <span className="text-[11px] text-zinc-500">{act.time}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{act.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
