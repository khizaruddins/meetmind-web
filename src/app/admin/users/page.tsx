'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '../../../lib/api/admin';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { Search, Eye, Monitor, Apple, Terminal, CheckCircle2, XCircle, Layers } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);

  useEffect(() => {
    adminApi.getPlans().then((res) => {
      setAvailablePlans(res.plans || []);
    }).catch(() => {});
  }, []);

  const loadUsers = () => {
    setLoading(true);
    adminApi
      .getUsers({
        search: search || undefined,
        plan: planFilter || undefined,
        status: statusFilter || undefined,
      })
      .then((res) => {
        setUsers(res.users || []);
        setTotal(res.total || 0);
      })
      .catch((err) => console.error('Failed to load admin users:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, [planFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers();
  };

  const getPlatformIcon = (platform?: string) => {
    const p = (platform || '').toLowerCase();
    if (p.includes('win')) return <Monitor className="w-3.5 h-3.5 text-sky-400" />;
    if (p.includes('mac') || p.includes('darwin')) return <Apple className="w-3.5 h-3.5 text-amber-400" />;
    if (p.includes('linux')) return <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
    return <Monitor className="w-3.5 h-3.5 text-zinc-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Client Directory</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Browse, filter, and inspect customer profiles, trial statuses, OS platforms, and subscriptions ({total} total).
          </p>
        </div>
      </div>

      <Card variant="elevated" className="p-6 border-white/10 space-y-4 bg-[#10121a]">
        {/* Filters and Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name or email..."
              className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-xs text-zinc-200 focus:outline-none"
          >
            <option value="">All Plans</option>
            <option value="TRIAL">Free Trial</option>
            {availablePlans
              .filter((p) => p.code !== 'TRIAL')
              .map((p) => (
                <option key={p.id} value={p.code}>
                  {p.name} ({p.code})
                </option>
              ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-xs text-zinc-200 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Disabled</option>
          </select>

          <Button type="submit" size="sm" variant="secondary">
            Filter
          </Button>
        </form>

        {/* User Table */}
        {loading ? (
          <LoadingSkeleton rows={6} />
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-400">
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">OS Platform</th>
                  <th className="py-2.5 px-3">Current Plan</th>
                  <th className="py-2.5 px-3">Subscriptions</th>
                  <th className="py-2.5 px-3">Usage Today</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Registered</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {users.map((u) => {
                  const planCode = u.plan || u.planCode || 'TRIAL';
                  const subs = u.subscriptions || [];

                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">
                        {u.displayName || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Client'}
                      </td>
                      <td className="py-3 px-3 text-zinc-400 font-mono text-[11px]">{u.email}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 text-zinc-300">
                          {getPlatformIcon(u.lastSeenPlatform || u.platform)}
                          <span className="capitalize">{u.lastSeenPlatform || u.platform || 'web'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            planCode === 'GOLD'
                              ? 'amber'
                              : planCode === 'SILVER'
                              ? 'rose'
                              : planCode === 'ENTERPRISE'
                              ? 'emerald'
                              : 'zinc'
                          }
                          size="sm"
                        >
                          {planCode}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap items-center gap-1">
                          {subs.length > 0 ? (
                            subs.map((s: any) => (
                              <span
                                key={s.id}
                                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                                  s.status === 'ACTIVE'
                                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                    : s.status === 'PAST_DUE'
                                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                                    : 'bg-zinc-800 text-zinc-400'
                                }`}
                              >
                                {s.plan} ({s.status.toLowerCase()})
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-zinc-500">Free Trial</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        {Math.round((u.usageTodaySeconds || 0) / 60)}m / 30m
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={u.status === 'ACTIVE' ? 'emerald' : 'rose'} size="sm">
                          {u.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-zinc-500 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link href={`/admin/users/${u.id}`}>
                          <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-white">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-400 text-xs">
            No customers match the specified filter criteria.
          </div>
        )}
      </Card>
    </div>
  );
}
