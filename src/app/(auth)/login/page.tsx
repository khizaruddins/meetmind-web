'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '../../../lib/api/auth';
import { useAuth } from '../../../lib/auth-context';
import { getCustomerToken, getCustomerRefreshToken } from '../../../lib/api/client';
import { Button } from '../../../components/shared/Button';
import { Card } from '../../../components/shared/Card';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { user, loading: authLoading, login } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getCustomerToken();
    const refreshToken = getCustomerRefreshToken();
    if (!authLoading) {
      if (user || token || refreshToken) {
        const redirectParam = typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('redirect')
          : null;
        router.replace(redirectParam || '/app/dashboard');
      } else {
        setCheckingAuth(false);
      }
    }
  }, [user, authLoading, router]);

  if (authLoading || (checkingAuth && typeof window !== 'undefined' && (getCustomerToken() || getCustomerRefreshToken()))) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-rose-500/30 border-t-rose-500 animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      const redirectParam = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('redirect')
        : null;
      router.push(redirectParam || '/app/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email.trim()) return;
    setResending(true);
    setResendStatus(null);
    try {
      const res = await authApi.resendVerification(email.trim());
      setResendStatus(res.message || 'Verification email sent if account exists.');
    } catch (err: any) {
      setResendStatus(err.message || 'Unable to send verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute w-[400px] h-[300px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none -top-20" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-heading">MeetMind</span>
          </Link>
          <h1 className="text-2xl font-bold font-heading text-white">Sign in to your account</h1>
          <p className="text-xs text-zinc-400">
            Use the same credentials across the website and desktop application.
          </p>
        </div>

        <Card variant="elevated" className="p-8 border-white/10 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
              <div className="pt-1 flex items-center gap-3 border-t border-rose-500/20">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || !email.trim()}
                  className="text-xs text-rose-300 underline hover:text-white disabled:opacity-50"
                >
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>
                <Link
                  href={`/verify-email?email=${encodeURIComponent(email)}`}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  Verification Help
                </Link>
              </div>
            </div>
          )}

          {resendStatus && (
            <div className="p-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-300">
              {resendStatus}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-zinc-300">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-zinc-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 p-0.5 rounded transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-800 text-rose-500 focus:ring-rose-500"
              />
              <label htmlFor="remember" className="text-xs text-zinc-400 select-none cursor-pointer">
                Remember this device
              </label>
            </div>

            <Button type="submit" size="md" isLoading={loading} className="w-full shadow-rose-500/20">
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center text-xs text-zinc-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-rose-400 font-semibold hover:underline">
              Create a free trial account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
