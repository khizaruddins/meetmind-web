'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Video,
  CreditCard,
  Receipt,
  Wallet,
  Laptop,
  User,
  Shield,
  Download,
  Activity,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

export const CustomerSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/app/recordings', label: 'Recent Recordings', icon: Video },
    { href: '/app/subscription', label: 'Subscription & Plans', icon: Sparkles },
    { href: '/app/billing', label: 'Billing Summary', icon: CreditCard },
    { href: '/app/invoices', label: 'Invoices', icon: Receipt },
    { href: '/app/payment-methods', label: 'Payment Methods', icon: Wallet },
    { href: '/app/devices', label: 'Registered Devices', icon: Laptop },
    { href: '/app/account', label: 'Profile & Account', icon: User },
    { href: '/app/security', label: 'Security & Sessions', icon: Shield },
    { href: '/app/downloads', label: 'App Downloads', icon: Download },
    { href: '/app/account/activity', label: 'Activity Log', icon: Activity },
  ];

  return (
    <aside className="w-64 border-r border-white/[0.08] bg-[#0c0d13] flex flex-col justify-between p-4 min-h-screen">
      <div className="space-y-6">
        {/* Brand Logo */}
        <Link href="/app/dashboard" className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-md shadow-rose-500/20">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-white font-heading">
              MeetMind
            </span>
            <span className="block text-[10px] text-zinc-500 font-mono -mt-1">Customer Portal</span>
          </div>
        </Link>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
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

      {/* User info & Sign out at bottom */}
      <div className="pt-4 border-t border-white/[0.08] space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500/30 to-amber-500/30 border border-rose-500/40 flex items-center justify-center text-xs font-bold text-rose-300">
            {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-200 truncate">
              {user?.displayName || user?.email}
            </p>
            <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
