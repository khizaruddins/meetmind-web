'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { customerApi } from '../../../lib/api/customer';
import { authApi } from '../../../lib/api/auth';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { User, Mail, Globe, Clock, ShieldCheck, LogOut, Trash2, Key } from 'lucide-react';

export default function CustomerAccountPage() {
  const { user, logout } = useAuth();
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogoutAll = async () => {
    if (!confirm('Log out of all connected desktop and browser sessions?')) return;
    setLoading(true);
    try {
      await customerApi.logoutAllDevices();
      setActionMessage('All sessions logged out successfully.');
      setTimeout(() => logout(), 1200);
    } catch (err: any) {
      setActionMessage(err.message || 'Failed to logout devices');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to request account deletion? This action cannot be undone.')) return;
    setLoading(true);
    try {
      await customerApi.requestAccountDeletion();
      setActionMessage('Account deletion requested. You will be logged out.');
      setTimeout(() => logout(), 1500);
    } catch (err: any) {
      setActionMessage(err.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const [resendingVerification, setResendingVerification] = useState(false);

  const handleResendVerification = async () => {
    setResendingVerification(true);
    try {
      const res = await authApi.resendVerification();
      setActionMessage(res.message || 'If the account requires verification, a new verification email has been sent.');
    } catch (err: any) {
      setActionMessage(err.message || 'Failed to resend verification email.');
    } finally {
      setResendingVerification(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Account Profile</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage your personal account profile, credentials, and global session security.
        </p>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-zinc-400 hover:text-white ml-2">×</button>
        </div>
      )}

      {/* Account Info Card */}
      <Card variant="elevated" className="p-6 border-white/10 space-y-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-rose-400" />
          <span>Profile Details</span>
        </h3>

        {!user?.emailVerified && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-zinc-400">Full Name</label>
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-medium">
              {user?.displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Email Address</label>
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-medium flex items-center justify-between">
              <span className="truncate">{user?.email}</span>
              <Badge variant={user?.emailVerified ? 'emerald' : 'amber'} size="sm">
                {user?.emailVerified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Timezone</label>
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300">
              {user?.profile?.timezone || 'UTC'}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Language</label>
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300">
              {user?.profile?.language || 'en'}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Account Created</label>
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Account Status</label>
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-emerald-400 font-semibold">
              {user?.status || 'ACTIVE'}
            </div>
          </div>
        </div>
      </Card>

      {/* Security Actions Card */}
      <Card variant="elevated" className="p-6 border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-400" />
          <span>Security & Sessions</span>
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
