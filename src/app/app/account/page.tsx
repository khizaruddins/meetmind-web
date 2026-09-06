'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
import { customerApi } from '../../../lib/api/customer';
import { authApi } from '../../../lib/api/auth';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import {
  User,
  Mail,
  Globe,
  Clock,
  ShieldCheck,
  LogOut,
  Trash2,
  Key,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function CustomerAccountPage() {
  const { user, logout, refreshUser } = useAuth();
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    timezone: 'Asia/Kolkata',
    language: 'en',
    country: 'IN',
  });

  // Sync profile data on mount and when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        displayName: user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        timezone: user.profile?.timezone || 'Asia/Kolkata',
        language: user.profile?.language || 'en',
        country: user.profile?.country || 'IN',
      });
    }

    // Also fetch fresh profile from API
    customerApi
      .getProfile()
      .then((res: any) => {
        const u = res?.user || res;
        const p = res?.profile || u?.profile;
        if (u) {
          setFormData({
            firstName: u.firstName || '',
            lastName: u.lastName || '',
            displayName: u.displayName || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
            timezone: p?.timezone || 'Asia/Kolkata',
            language: p?.language || 'en',
            country: p?.country || 'IN',
          });
        }
      })
      .catch(() => {});
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setActionMessage(null);

    try {
      await customerApi.updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        displayName: formData.displayName.trim(),
        timezone: formData.timezone,
        language: formData.language,
        country: formData.country.trim(),
      });

      await refreshUser();
      setActionMessage({ text: 'Profile details updated successfully!', type: 'success' });
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Failed to update profile details', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutAll = async () => {
    if (!confirm('Log out of all connected desktop and browser sessions?')) return;
    setLoading(true);
    try {
      await customerApi.logoutAllDevices();
      setActionMessage({ text: 'All sessions logged out successfully.', type: 'success' });
      setTimeout(() => logout(), 1200);
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Failed to logout devices', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to request account deletion? This action cannot be undone.')) return;
    setLoading(true);
    try {
      await customerApi.requestAccountDeletion();
      setActionMessage({ text: 'Account deletion requested. You will be logged out.', type: 'success' });
      setTimeout(() => logout(), 1500);
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Failed to delete account', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendingVerification(true);
    try {
      const res = await authApi.resendVerification();
      setActionMessage({
        text: res.message || 'If the account requires verification, a new verification email has been sent.',
        type: 'success',
      });
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Failed to resend verification email.', type: 'error' });
    } finally {
      setResendingVerification(false);
    }
  };

  const initials = (
    formData.displayName ||
    `${formData.firstName} ${formData.lastName}`.trim() ||
    user?.email ||
    'U'
  )
    .charAt(0)
    .toUpperCase();

  const formattedCreatedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Active';

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Account Profile</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage your personal account profile, contact details, preferences, and session security.
        </p>
      </div>

      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-zinc-400 hover:text-white ml-2">
            ×
          </button>
        </div>
      )}

      {/* User Header Card */}
      <Card variant="elevated" className="p-6 border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-rose-500/20">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                {formData.displayName || `${formData.firstName} ${formData.lastName}`.trim() || 'User Profile'}
              </h2>
              <Badge variant={user?.status === 'ACTIVE' ? 'emerald' : 'zinc'} size="sm">
                {user?.status || 'ACTIVE'}
              </Badge>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{user?.email}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Member since {formattedCreatedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(() => {
            const activeSub = user?.subscriptions?.find((s: any) => s.status === 'ACTIVE');
            const code = activeSub?.plan?.code?.toUpperCase();
            return (
              <Link href="/app/subscription">
                <Badge
                  variant={code === 'GOLD' ? 'amber' : code === 'SILVER' ? 'rose' : code === 'ENTERPRISE' ? 'indigo' : 'zinc'}
                  size="md"
                  className="cursor-pointer hover:opacity-80"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {activeSub?.plan?.name || (code ? `${code} Plan` : 'Free Trial')}
                </Badge>
              </Link>
            );
          })()}
        </div>
      </Card>

      {/* Profile Details Edit Form */}
      <Card variant="elevated" className="p-6 border-white/10 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-rose-400" />
            <span>Edit Profile Details</span>
          </h3>
          <span className="text-[11px] text-zinc-500">Changes reflect immediately across portal</span>
        </div>

        {!user?.emailVerified && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-amber-300">Your email address is unverified</p>
              <p className="text-[11px] text-zinc-400">
                Please verify your email to ensure uninterrupted access and account recovery.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleResendVerification}
              isLoading={resendingVerification}
              className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10 flex-shrink-0"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Resend Verification Email</span>
            </Button>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="e.g. Khizar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="e.g. Syed"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-400 font-medium">Display Name</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="e.g. Khizar Syed"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-400 font-medium">Email Address</label>
              <div className="px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/5 text-zinc-300 font-medium flex items-center justify-between">
                <span className="truncate">{user?.email || 'N/A'}</span>
                <Badge variant={user?.emailVerified ? 'emerald' : 'amber'} size="sm">
                  {user?.emailVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
              <p className="text-[10px] text-zinc-500">Email address cannot be changed directly.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Timezone</label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+5:30)</option>
                <option value="UTC">UTC (UTC+0)</option>
                <option value="America/New_York">America/New_York (EST - UTC-5)</option>
                <option value="America/Chicago">America/Chicago (CST - UTC-6)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST - UTC-8)</option>
                <option value="Europe/London">Europe/London (GMT - UTC+0)</option>
                <option value="Europe/Paris">Europe/Paris (CET - UTC+1)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST - UTC+4)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT - UTC+8)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST - UTC+9)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
              >
                <option value="en">English (en)</option>
                <option value="hi">Hindi (hi)</option>
                <option value="es">Spanish (es)</option>
                <option value="fr">French (fr)</option>
                <option value="de">German (de)</option>
                <option value="ja">Japanese (ja)</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-400 font-medium">Country / Region</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="e.g. IN or India"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" variant="primary" isLoading={saving} className="px-5">
              <Save className="w-3.5 h-3.5 mr-1.5" />
              <span>Save Profile Details</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* Password & Security Quick Link */}
      <Card variant="elevated" className="p-6 border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Password & Authentication</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Update account password with show/hide eye toggle, review active sessions, and configure device access.
            </p>
          </div>
          <Link href="/app/security">
            <Button size="sm" variant="outline" className="flex items-center gap-1.5">
              <span>Go to Security</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Security Actions & Danger Zone */}
      <Card variant="elevated" className="p-6 border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-rose-400" />
          <span>Session Controls & Danger Zone</span>
        </h3>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Log Out All Devices</p>
              <p className="text-[11px] text-zinc-400">
                Invalidates all active desktop app sessions and browser cookies.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={handleLogoutAll} isLoading={loading}>
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out All</span>
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-rose-500/[0.04] border border-rose-500/20 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-rose-300">Delete Account</p>
              <p className="text-[11px] text-zinc-400">
                Permanently deletes your customer account and subscription history.
              </p>
            </div>
            <Button size="sm" variant="danger" onClick={handleDeleteAccount} isLoading={loading}>
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
