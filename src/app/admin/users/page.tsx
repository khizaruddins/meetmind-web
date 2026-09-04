'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '../../../lib/api/admin';
import { AdminUserListItem } from '../../../lib/types';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { Search, Filter, Eye, ArrowRight, UserCheck, UserX } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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

  const formatSeconds = (sec: number = 0) => {
    const mins = Math.floor(sec / 60);
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Client Directory</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Browse, filter, and inspect customer profiles, trial statuses, and subscription lifecycles ({total} total).
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
            <option value="TRIAL">Trial</option>
            <option value="SILVER">Silver</option>
            <option value="GOLD">Gold</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-xs text-zinc-200 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PAST_DUE">Past Due</option>
            <option value="CANCELLED">Cancelled</option>
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
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3">Subscription</th>
                  <th className="py-2.5 px-3">Recordings</th>
                  <th className="py-2.5 px-3">Usage Today</th>
                  <th className="py-2.5 px-3">Devices</th>
                  <th className="py-2.5 px-3">Joined</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">
                      {u.displayName || 'Client'}
                    </td>
                    <td className="py-3 px-3 text-zinc-400 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={u.planCode === 'GOLD' ? 'amber' : u.planCode === 'SILVER' ? 'rose' : 'zinc'}
                        size="sm"
                      >
                        {u.planCode || 'TRIAL'}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[11px] font-semibold ${
                          u.subscriptionStatus === 'ACTIVE'
                            ? 'text-emerald-400'
                            : u.subscriptionStatus === 'PAST_DUE'
                            ? 'text-rose-400'
                            : 'text-zinc-400'
                        }`}
                      >
                        {u.subscriptionStatus || 'TRIAL'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">{u.recordingsCount || 0}</td>
                    <td className="py-3 px-3 font-mono text-zinc-400">{formatSeconds(u.usageTodaySeconds)}</td>
                    <td className="py-3 px-3">{u.devicesCount || 1}</td>
                    <td className="py-3 px-3 text-zinc-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link href={`/admin/users/${u.id}`}>
                        <Button size="sm" variant="outline" className="hover:border-amber-500/40">
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>Inspect</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-zinc-400 text-xs">
            No customers match the specified filter criteria.
          </div>
        )}
      </Card>
    </div>
  );
}
