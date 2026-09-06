'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api/admin';
import { Card } from '../../../components/shared/Card';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { Settings, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [trialDays, setTrialDays] = useState(30);
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    adminApi
      .getPlatformSettings()
      .then((settings) => {
        if (settings) {
          if (settings.trialDays) setTrialDays(settings.trialDays);
          if (settings.dailyMinutes) setDailyMinutes(settings.dailyMinutes);
          if (settings.allowRegistration !== undefined) setAllowRegistration(settings.allowRegistration);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await adminApi.updatePlatformSettings({
        trialDays,
        dailyMinutes,
      });
      setMessage({ text: 'Platform settings saved to database and live in application.', type: 'success' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to update platform settings.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Platform Settings & Policy</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Configurable live database settings for trial periods, daily recording quotas, and self-service registration.
        </p>
      </div>

      <Card variant="elevated" className="p-6 border-white/10 space-y-5 bg-[#10121a]">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-amber-400" />
          <span>Evaluation Quotas & Trial Limits (Configured in Database)</span>
        </h3>

        {message && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-zinc-300 font-medium">Default Trial Duration (Days)</label>
            <input
              type="number"
              min={1}
              max={365}
              value={trialDays}
              onChange={(e) => setTrialDays(Number(e.target.value))}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white"
            />
            <p className="text-[11px] text-zinc-500">Days allocated to newly registered trial accounts in database.</p>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-300 font-medium">Daily Trial Recording Limit (Minutes)</label>
            <input
              type="number"
              min={1}
              max={1440}
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white"
            />
            <p className="text-[11px] text-zinc-500">Maximum daily minutes enforced by watchdog on client machines.</p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="reg"
              checked={allowRegistration}
              onChange={(e) => setAllowRegistration(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-800 text-amber-500 h-4 w-4"
            />
            <label htmlFor="reg" className="text-zinc-300 select-none cursor-pointer">
              Enable public self-service registration and downloads
            </label>
          </div>

          <Button
            type="submit"
            size="sm"
            isLoading={saving}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold"
          >
            <Save className="w-3.5 h-3.5 mr-1" />
            <span>Persist Settings to DB</span>
          </Button>
        </form>
      </Card>
    </div>
  );
}
