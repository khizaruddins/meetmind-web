'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { authApi } from '../../../lib/api/auth';
import { Button } from '../../../components/shared/Button';
import { Card } from '../../../components/shared/Card';
import { CheckCircle2, AlertCircle, Mail } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const initialEmail = searchParams.get('email') || '';

  const [loading, setLoading] = useState(Boolean(token));
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [resendEmail, setResendEmail] = useState(initialEmail);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      authApi
        .verifyEmail(token)
        .then(() => setSuccess(true))
        .catch((err: any) => setError(err.message || 'Verification token invalid or expired'))
        .finally(() => setLoading(false));
    }
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;
    setResending(true);
    setResendMessage(null);
    try {
      const res = await authApi.resendVerification(resendEmail.trim());
      setResendMessage(res.message || 'If the account requires verification, a new verification email has been sent.');
    } catch (err: any) {
      setResendMessage(err.message || 'Failed to resend verification email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <Card variant="elevated" className="p-8 border-white/10 text-center space-y-4">
      {loading ? (
        <div className="py-6 space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-rose-500/30 border-t-rose-500 animate-spin mx-auto" />
          <p className="text-xs text-zinc-400">Verifying your email address...</p>
        </div>
      ) : success ? (
        <div className="space-y-4 py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-semibold text-white">Email Verified Successfully!</h2>
          <p className="text-xs text-zinc-400">
            Your account is now verified. You can sign in and start recording meetings immediately.
          </p>
          <Link href="/login" className="block pt-2">
            <Button size="sm" className="w-full">
              Proceed to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4 py-4">
          <div className={`w-12 h-12 rounded-full ${error ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-zinc-800 text-zinc-400 border border-white/10'} flex items-center justify-center mx-auto`}>
            {error ? <AlertCircle className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
          </div>
          <h2 className="text-base font-semibold text-white">
            {error ? 'Verification Issue' : 'Verify Your Email'}
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {error || 'Please check your inbox and click the verification link we emailed you to activate all features.'}
          </p>

          <form onSubmit={handleResend} className="pt-2 text-left space-y-3">
            <div>
              <label htmlFor="resendEmail" className="block text-xs font-medium text-zinc-400 mb-1">
                Need a new verification link?
              </label>
              <input
                id="resendEmail"
                type="email"
                placeholder="Enter your registered email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/50"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              variant="outline"
              disabled={resending || !resendEmail.trim()}
              className="w-full"
            >
              {resending ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          </form>

          {resendMessage && (
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-zinc-300 text-left">
              {resendMessage}
            </div>
          )}

          <Link href="/login" className="block pt-2">
            <Button variant="ghost" size="sm" className="w-full text-zinc-400 hover:text-white">
              Back to Sign In
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-center items-center px-4 relative">
      <div className="w-full max-w-md space-y-6 relative z-10">
        <Suspense fallback={<div className="text-center text-xs text-zinc-500">Loading...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
