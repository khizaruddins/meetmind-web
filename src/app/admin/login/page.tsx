'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminApi } from '../../../lib/api/admin';
import { Button } from '../../../components/shared/Button';
import { Card } from '../../../components/shared/Card';
import { Lock, Mail, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminApi.login(email, password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Access Denied: Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-zinc-100 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Amber glow for admin branding */}
      <div className="absolute w-[450px] h-[320px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -top-20" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-xl shadow-amber-500/20 mx-auto mb-3">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Staff Administration Portal</h1>
          <p className="text-xs text-zinc-400">
            Restricted administrative area. Role-based access control enforced.
          </p>
        </div>

        <Card variant="elevated" className="p-8 border-white/10 space-y-5 bg-[#0e0f17]/90">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@meetingrecorder.local"
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">Admin Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="md"
              isLoading={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold shadow-amber-500/20"
            >
              <span>Authenticate Staff</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center text-[11px] text-zinc-500">
            Standard customers must log in via{' '}
            <Link href="/login" className="text-zinc-400 hover:text-white underline">
              Customer Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
