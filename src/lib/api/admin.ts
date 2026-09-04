import { apiClient, setAdminToken } from './client';
import {
  AdminDashboardMetrics,
  AdminUserListItem,
  AuditLogItem,
  SystemHealthItem,
  SubscriptionInfo,
  InvoiceInfo,
  PlanInfo,
} from '../types';

export interface AdminAuthResponse {
  admin: {
    id: string;
    email: string;
    name: string;
    status: string;
    roles: string[];
    permissions: string[];
  };
  accessToken: string;
  refreshToken: string;
}

export const adminApi = {
  async login(email: string, password: string): Promise<AdminAuthResponse> {
    const res = await apiClient<AdminAuthResponse>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, 'none');
    setAdminToken(res.accessToken);
    return res;
  },

  async logout(): Promise<void> {
    try {
      await apiClient('/admin/auth/logout', { method: 'POST' }, 'admin');
    } catch {
      // ignore
    } finally {
      setAdminToken(null);
    }
  },

  async getMe(): Promise<any> {
    return apiClient('/admin/auth/me', {}, 'admin');
  },

  async getDashboard(): Promise<AdminDashboardMetrics> {
    return apiClient<AdminDashboardMetrics>('/admin/dashboard', {}, 'admin');
  },

  async getUsers(params?: {
    search?: string;
    plan?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: AdminUserListItem[]; total: number; page: number; limit: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.plan) query.set('plan', params.plan);
    if (params?.status) query.set('status', params.status);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiClient(`/admin/users${qs}`, {}, 'admin');
  },

  async getUserDetail(id: string): Promise<any> {
    return apiClient(`/admin/users/${id}/overview`, {}, 'admin');
  },

  async extendTrial(userId: string, days: number, reason?: string): Promise<{ success: boolean; trial: any }> {
    return apiClient(`/admin/users/${userId}/trial/extend`, {
      method: 'POST',
      body: JSON.stringify({ days, reason }),
    }, 'admin');
  },

  async resetTrialDailyUsage(userId: string): Promise<{ success: boolean }> {
    return apiClient(`/admin/users/${userId}/trial/reset-daily-usage`, {
      method: 'POST',
    }, 'admin');
  },

  async endTrial(userId: string): Promise<{ success: boolean }> {
    return apiClient(`/admin/users/${userId}/trial/end`, {
      method: 'POST',
    }, 'admin');
  },

  async enableUser(id: string): Promise<{ success: boolean }> {
    return apiClient(`/admin/users/${id}/enable`, { method: 'POST' }, 'admin');
  },

  async disableUser(id: string, reason?: string): Promise<{ success: boolean }> {
    return apiClient(`/admin/users/${id}/disable`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }, 'admin');
  },

  async verifyUserEmail(id: string): Promise<{ success: boolean }> {
    return apiClient(`/admin/users/${id}/verify-email`, { method: 'POST' }, 'admin');
  },

  async forceLogoutUser(id: string): Promise<{ success: boolean }> {
    return apiClient(`/admin/users/${id}/logout-all`, { method: 'POST' }, 'admin');
  },

  async getSubscriptions(params?: { status?: string; plan?: string }): Promise<{ subscriptions: any[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.plan) query.set('plan', params.plan);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiClient(`/admin/subscriptions${qs}`, {}, 'admin');
  },

  async cancelSubscription(id: string, reason: string): Promise<{ success: boolean }> {
    return apiClient(`/admin/subscriptions/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }, 'admin');
  },

  async resumeSubscription(id: string, reason: string): Promise<{ success: boolean }> {
    return apiClient(`/admin/subscriptions/${id}/resume`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }, 'admin');
  },

  async extendSubscription(id: string, days: number, reason: string): Promise<{ success: boolean }> {
    return apiClient(`/admin/subscriptions/${id}/extend`, {
      method: 'POST',
      body: JSON.stringify({ days, reason }),
    }, 'admin');
  },

  async overrideSubscriptionStatus(id: string, status: string, reason: string): Promise<{ success: boolean }> {
    return apiClient(`/admin/subscriptions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    }, 'admin');
  },

  async changeSubscriptionPlan(id: string, targetPlan: string, reason?: string): Promise<{ success: boolean }> {
    return apiClient(`/admin/subscriptions/${id}/change-plan`, {
      method: 'POST',
      body: JSON.stringify({ targetPlan, planId: targetPlan, reason: reason || 'Admin plan change' }),
    }, 'admin');
  },

  async getPayments(): Promise<{ payments: any[]; total: number }> {
    return apiClient('/admin/payments', {}, 'admin');
  },

  async getInvoices(): Promise<{ invoices: InvoiceInfo[]; total: number }> {
    return apiClient('/admin/invoices', {}, 'admin');
  },

  async retryInvoicePayment(id: string): Promise<{ success: boolean }> {
    return apiClient(`/admin/invoices/${id}/retry-payment`, { method: 'POST' }, 'admin');
  },

  async getPlans(): Promise<{ plans: PlanInfo[] }> {
    return apiClient('/admin/plans', {}, 'admin');
  },

  async createPlan(data: any): Promise<any> {
    return apiClient('/admin/plans', {
      method: 'POST',
      body: JSON.stringify(data),
    }, 'admin');
  },

  async updatePlan(id: string, data: any): Promise<any> {
    return apiClient(`/admin/plans/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, 'admin');
  },

  async activatePlan(id: string): Promise<{ success: boolean }> {
    return apiClient(`/admin/plans/${id}/activate`, { method: 'POST' }, 'admin');
  },

  async deactivatePlan(id: string): Promise<{ success: boolean }> {
    return apiClient(`/admin/plans/${id}/deactivate`, { method: 'POST' }, 'admin');
  },

  async deletePlan(id: string): Promise<{ success: boolean; message?: string }> {
    return apiClient(`/admin/plans/${id}`, { method: 'DELETE' }, 'admin');
  },

  async getPlanFeatures(id: string): Promise<{ planId: string; features: Record<string, boolean> }> {
    return apiClient(`/admin/plans/${id}/features`, {}, 'admin');
  },

  async updatePlanFeatures(id: string, features: Record<string, boolean>): Promise<{ success: boolean }> {
    return apiClient(`/admin/plans/${id}/features`, {
      method: 'PUT',
      body: JSON.stringify({ features }),
    }, 'admin');
  },

  async listFeatures(): Promise<{ features: any[] }> {
    return apiClient('/admin/features', {}, 'admin');
  },

  async createFeature(key: string, description: string): Promise<any> {
    return apiClient('/admin/features', {
      method: 'POST',
      body: JSON.stringify({ key, description }),
    }, 'admin');
  },

  async getRecordings(): Promise<{ recordings: any[]; total: number }> {
    return apiClient('/admin/recordings', {}, 'admin');
  },

  async getUsageAnalytics(): Promise<any> {
    return apiClient('/admin/usage/summary', {}, 'admin');
  },

  async getRevenueAnalytics(): Promise<any> {
    return apiClient('/admin/analytics/revenue', {}, 'admin');
  },

  async getAuditLogs(params?: { limit?: number }): Promise<{ logs: AuditLogItem[] }> {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiClient(`/admin/audit-logs${qs}`, {}, 'admin');
  },

  async getSystemHealth(): Promise<any> {
    return apiClient('/admin/health', {}, 'admin');
  },
};
