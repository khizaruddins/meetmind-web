'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { adminApi, AdminAuthResponse } from './api/admin';
import {
  getAdminToken,
  setAdminToken,
  getAdminRefreshToken,
  setAdminRefreshToken,
  getAdminUser,
  setAdminUser,
} from './api/client';
import { useRouter } from 'next/navigation';

interface AdminAuthContextType {
  admin: AdminAuthResponse['admin'] | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminAuthResponse['admin'] | null>(() => getAdminUser());
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshAdmin = async () => {
    const token = getAdminToken();
    const refreshToken = getAdminRefreshToken();
    if (!token && !refreshToken) {
      setAdmin(null);
      setAdminUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await adminApi.getMe();
      const adminData = res?.admin || res;
      setAdmin(adminData);
      setAdminUser(adminData);
    } catch (err: any) {
      if (err?.status === 401 || err?.status === 403) {
        setAdminToken(null);
        setAdminRefreshToken(null);
        setAdminUser(null);
        setAdmin(null);
      } else {
        const cached = getAdminUser();
        if (cached) setAdmin(cached);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAdmin();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await adminApi.login(email, pass);
      setAdmin(res.admin);
      setAdminUser(res.admin);
      router.push('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await adminApi.logout();
    setAdmin(null);
    setAdminUser(null);
    router.push('/admin/login');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, refreshAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

