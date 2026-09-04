'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from './types';
import { authApi } from './api/auth';
import { getCustomerToken, setCustomerToken } from './api/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: (redirectOrEvent?: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshUser = async () => {
    const token = getCustomerToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res: any = await authApi.getMe();
      const userData = res?.user || res;
      setUser(userData);
    } catch {
      setCustomerToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await authApi.login(email, pass);
      setUser(res.user);
      router.push('/app/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await authApi.signup({ ...data, agreeToTerms: true });
      setUser(res.user);
      router.push('/app/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const logout = async (redirectOrEvent?: any) => {
    await authApi.logout();
    setUser(null);
    const path = typeof redirectOrEvent === 'string' ? redirectOrEvent : '/login';
    if (path) {
      router.push(path);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      loading: false,
      login: async () => {},
      signup: async () => {},
      logout: async () => {},
      refreshUser: async () => {},
    };
  }
  return context;
};
