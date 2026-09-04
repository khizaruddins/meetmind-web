'use client';

import React, { useState } from 'react';
import { Card } from '../../../components/shared/Card';
import { Button } from '../../../components/shared/Button';
import { Badge } from '../../../components/shared/Badge';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [trialDays, setTrialDays] = useState(30);
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Platform Settings & Policy</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Global registration rules, default evaluation policies, and backend quotas.
        </p>
      </div>

      <Card variant="elevated" className="p-6 border-white/10 space-y-5 bg-[#10121a]">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-amber-400" />
          <span>Evaluation Quotas & Defaults</span>
        </h3>

        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Platform settings saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-zinc-300">Default Trial Duration (Days)</label>
            <input
              type="number"
              value={trialDays}
              onChange={(e) => setTrialDays(Number(e.target.value))}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white"
            />
            <p className="text-[11px] text-zinc-500">Days allocated to newly registered trial accounts.</p>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-300">Daily Trial Recording Limit (Minutes)</label>
            <input
              type="number"
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white"
            />
            <p className="text-[11px] text-zinc-500">Maximum daily seconds enforced by monotonic countdown watchdog.</p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="reg"
              checked={allowRegistration}
              onChange={(e) => setAllowRegistration(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-800 text-amber-500"
            />
            <label htmlFor="reg" className="text-zinc-300 select-none cursor-pointer">
              Enable public self-service registration
            </label>
          </div>

          <Button type="submit" size="sm" className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold">
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </Button>
        </form>
      </Card>
    </div>
  );
}
