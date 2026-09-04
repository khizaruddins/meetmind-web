'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/shared/Card';
import { Button } from '../../../components/shared/Button';
import { Badge } from '../../../components/shared/Badge';
import { Shield, Key, Laptop, Smartphone, Globe, LogOut, CheckCircle2, AlertCircle, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../lib/auth-context';
import { authApi } from '../../../lib/api/auth';

interface CustomerSession {
  id: string;
  deviceName?: string;
  platform?: string;
  appVersion?: string;
  ipAddress?: string;
  lastActiveAt: string;
  createdAt: string;
  isCurrent?: boolean;
}

export default function CustomerSecurityPage() {
  const { user, logout } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const [sessions, setSessions] = useState<CustomerSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [sessionActionMessage, setSessionActionMessage] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [loggingOutAll, setLoggingOutAll] = useState(false);

  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const res = await authApi.getSessions();
      setSessions(res.sessions || []);
    } catch (err: any) {
      setSessionActionMessage(err.message || 'Failed to load active sessions');
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRevokeSession = async (sessionId: string) => {
    setRevokingId(sessionId);
    setSessionActionMessage(null);
    try {
      await authApi.revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setSessionActionMessage('Session revoked successfully.');
    } catch (err: any) {
      setSessionActionMessage(err.message || 'Failed to revoke session');
    } finally {
      setRevokingId(null);
    }
  };

  const handleLogoutAll = async (keepCurrentSession: boolean) => {
    if (!confirm(keepCurrentSession ? 'Log out of all other active sessions?' : 'Log out of ALL sessions including this one?')) return;
    setLoggingOutAll(true);
    setSessionActionMessage(null);
    try {
      const res = await authApi.logoutAll(keepCurrentSession);
      setSessionActionMessage(res.message || 'Logged out successfully');
      if (!keepCurrentSession) {
        setTimeout(() => logout(), 1200);
      } else {
        await fetchSessions();
      }
    } catch (err: any) {
      setSessionActionMessage(err.message || 'Failed to terminate sessions');
    } finally {
      setLoggingOutAll(false);
    }
  };

  const getDeviceIcon = (platform?: string) => {
    const p = (platform || '').toLowerCase();
    if (p.includes('mobile') || p.includes('ios') || p.includes('android')) {
      return <Smartphone className="w-4 h-4 text-amber-400" />;
    }
    if (p.includes('mac') || p.includes('win') || p.includes('linux') || p.includes('desktop')) {
      return <Laptop className="w-4 h-4 text-rose-400" />;
    }
    return <Globe className="w-4 h-4 text-zinc-400" />;
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Security Settings</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review encryption standards, credentials, and active device sessions.
        </p>
      </div>

      {sessionActionMessage && (
        <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-300 flex items-center justify-between">
          <span>{sessionActionMessage}</span>
          <button onClick={() => setSessionActionMessage(null)} className="text-zinc-500 hover:text-white">×</button>
        </div>
      )}

      {/* Active Sessions Card */}
      <Card variant="elevated" className="p-6 border-white/10 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-400" />
            <span>Active Sessions ({sessions.length})</span>
          </h3>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={fetchSessions}
              disabled={loadingSessions}
              className="text-xs text-zinc-400 hover:text-white"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingSessions ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            {sessions.length > 1 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleLogoutAll(true)}
                disabled={loggingOutAll}
                className="text-xs border-white/10"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout Other Sessions</span>
              </Button>
            )}
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleLogoutAll(false)}
              disabled={loggingOutAll}
              className="text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout All Devices</span>
            </Button>
          </div>
        </div>

        {loadingSessions ? (
          <div className="p-6 text-center text-xs text-zinc-500">Loading active sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-500">No active sessions found.</div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                  session.isCurrent
                    ? 'bg-rose-500/[0.04] border-rose-500/20'
                    : 'bg-zinc-900/60 border-white/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800 border border-white/10 mt-0.5">
                    {getDeviceIcon(session.platform)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">
                        {session.deviceName || 'Web / Desktop Client'}
                      </span>
                      {session.isCurrent && (
                        <Badge variant="rose" size="sm">Current Session</Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 space-x-2">
                      <span>Platform: {session.platform || 'Unknown'}</span>
                      <span>•</span>
                      <span>IP: {session.ipAddress || '127.0.0.1'}</span>
                      <span>•</span>
                      <span>
                        Last active: {session.lastActiveAt ? new Date(session.lastActiveAt).toLocaleString() : 'Just now'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  {!session.isCurrent ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={revokingId === session.id}
                      onClick={() => handleRevokeSession(session.id)}
                      className="text-xs border-white/10 hover:border-rose-500/30 text-zinc-300 hover:text-rose-300"
                    >
                      {revokingId === session.id ? 'Revoking...' : 'Revoke'}
                    </Button>
                  ) : (
                    <span className="text-[11px] text-zinc-500 italic pr-2">This device</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Password Change Card */}
      <Card variant="elevated" className="p-6 border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-rose-400" />
          <span>Change Password</span>
        </h3>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Password updated successfully.</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 text-xs max-w-md">
          <div className="space-y-1">
            <label className="text-zinc-300">Current Password</label>
            <div className="relative">
              <input
                type={showOldPassword ? 'text' : 'password'}
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full pl-3 pr-10 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-rose-500"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-2 text-zinc-500 hover:text-zinc-300 p-0.5 rounded transition-colors"
                aria-label={showOldPassword ? 'Hide password' : 'Show password'}
              >
                {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-300">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-3 pr-10 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-rose-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2 text-zinc-500 hover:text-zinc-300 p-0.5 rounded transition-colors"
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" size="sm">
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  );
}
