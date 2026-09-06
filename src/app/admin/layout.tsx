'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '../../lib/admin-auth-context';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { getAdminToken, getAdminRefreshToken } from '../../lib/api/client';

function AuthenticatedAdminArea({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If on /admin/login, don't redirect
    if (pathname === '/admin/login') return;

    if (!loading && !admin && !getAdminToken() && !getAdminRefreshToken()) {
      router.push('/admin/login');
    }
  }, [admin, loading, router, pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading && !admin) {
    return (
      <div className="min-h-screen bg-[#07080c] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
      </div>
    );
  }

  if (!admin && !getAdminToken() && !getAdminRefreshToken()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#07080c] text-zinc-100 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AuthenticatedAdminArea>{children}</AuthenticatedAdminArea>
    </AdminAuthProvider>
  );
}
