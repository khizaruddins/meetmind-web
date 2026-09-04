'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  Clock,
  Video,
  BarChart3,
  Activity,
  HeartPulse,
  Settings,
  ShieldCheck,
  LogOut,
  Package,
  Layers,
} from 'lucide-react';
import { useAdminAuth } from '../../lib/admin-auth-context';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'User Directory', icon: Users },
    { href: '/admin/trials', label: 'Trial Management', icon: Clock },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { href: '/admin/plans', label: 'Plan Management', icon: Package },
    { href: '/admin/payments', label: 'Payments', icon: Receipt },
    { href: '/admin/invoices', label: 'Invoices', icon: Layers },
    { href: '/admin/recordings', label: 'Global Recordings', icon: Video },
    { href: '/admin/usage', label: 'Usage Analytics', icon: BarChart3 },
    { href: '/admin/analytics', label: 'Revenue Analytics', icon: Activity },
    { href: '/admin/audit-logs', label: 'Audit Trail', icon: ShieldCheck },
    { href: '/admin/system-health', label: 'System Health', icon: HeartPulse },
    { href: '/admin/settings', label: 'Platform Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-white/[0.08] bg-[#0b0c12] flex flex-col justify-between p-4 min-h-screen">
      <div className="space-y-6">
        {/* Brand Logo */}
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-md shadow-amber-500/20">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-white font-heading">
              MeetMind
            </span>
            <span className="block text-[10px] text-amber-400 font-mono -mt-1">Staff Administration</span>
          </div>
        </Link>

        {/* Nav Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin Profile & Logout */}
      <div className="pt-4 border-t border-white/[0.08] space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xs font-bold text-amber-300">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-200 truncate">
              {admin?.name || 'Administrator'}
            </p>
            <p className="text-[10px] text-zinc-500 truncate">{admin?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Admin Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
