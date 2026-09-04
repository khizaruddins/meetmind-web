'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '../../lib/auth-context';
import { CustomerSidebar } from '../../components/customer/CustomerSidebar';
import { CustomerHeader } from '../../components/customer/CustomerHeader';
import { getCustomerToken } from '../../lib/api/client';

function AuthenticatedCustomerArea({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && !getCustomerToken()) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-rose-500/30 border-t-rose-500 animate-spin" />
      </div>
    );
  }

  if (!user && !getCustomerToken()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex">
      <CustomerSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <CustomerHeader />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <AuthenticatedCustomerArea>{children}</AuthenticatedCustomerArea>;
}
