'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, SubscriptionInfo } from './types';
import { authApi } from './api/auth';
import {
  getCustomerToken,
  setCustomerToken,
  getCustomerRefreshToken,
  setCustomerRefreshToken,
  getCustomerUser,
  setCustomerUser,
} from './api/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  activePlan: string;
  isTrial: boolean;
  activeSubscription: SubscriptionInfo | null;
  login: (email: string, pass: string) => Promise<any>;
  signup: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<any>;
  logout: (redirectOrEvent?: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function getActiveSubscription(user: UserProfile | null): SubscriptionInfo | null {
  if (!user || !user.subscriptions) return null;
  return user.subscriptions.find((s) => s.status === 'ACTIVE') || null;
}

export function getUserActivePlanCode(user: UserProfile | null): string {
  if (!user) return 'TRIAL';
  const activeSub = getActiveSubscription(user);
  if (activeSub && activeSub.plan?.code && activeSub.plan.code !== 'TRIAL') {
    return activeSub.plan.code.toUpperCase();
  }
  return 'TRIAL';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const activeSubscription = user?.subscriptions?.find((s) => s.status === 'ACTIVE') || null;
  const isPaidActive = Boolean(
    activeSubscription &&
    activeSubscription.plan?.code &&
    activeSubscription.plan.code !== 'TRIAL'
  );
  const activePlan = isPaidActive ? activeSubscription!.plan.code.toUpperCase() : 'TRIAL';
  const isTrial = !isPaidActive;

  const refreshUser = async () => {
    const token = getCustomerToken();
    const refreshToken = getCustomerRefreshToken();
    if (!token && !refreshToken) {
      setUser(null);
      setCustomerUser(null);
      setLoading(false);
      return;
    }
    try {
      const res: any = await authApi.getMe();
      const userData = res?.user || res;
      setUser(userData);
      setCustomerUser(userData);
    } catch (err: any) {
      // If 401/403, attempt a refresh call directly
      if (err?.status === 401 || err?.status === 403) {
        try {
          const refreshRes = await authApi.refresh();
          if (refreshRes?.accessToken) {
            const res2: any = await authApi.getMe();
            const userData = res2?.user || res2;
            setUser(userData);
            setCustomerUser(userData);
            return;
          }
        } catch {
          // Token is truly invalid or revoked
          setCustomerToken(null);
          setCustomerRefreshToken(null);
          setCustomerUser(null);
          setUser(null);
        }
      } else {
        // For network errors / offline / server hiccups, keep the cached user
        const cached = getCustomerUser();
        if (cached) {
          setUser(cached);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = getCustomerUser();
    if (cached) {
      setUser(cached);
    }
    refreshUser();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await authApi.login(email, pass);
      setUser(res.user);
      setCustomerUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await authApi.signup({ ...data, agreeToTerms: true });
      setUser(res.user);
      setCustomerUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (redirectOrEvent?: any) => {
    await authApi.logout();
    setUser(null);
    setCustomerUser(null);
    const path = typeof redirectOrEvent === 'string' ? redirectOrEvent : '/login';
    if (path) {
      router.push(path);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        activePlan,
        isTrial,
        activeSubscription,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
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
      activePlan: 'TRIAL',
      isTrial: true,
      activeSubscription: null,
      login: async () => {},
      signup: async () => {},
      logout: async () => {},
      refreshUser: async () => {},
    };
  }
  return context;
};

