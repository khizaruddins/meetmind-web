import {
  apiClient,
  setAdminToken,
  getAdminRefreshToken,
  setAdminRefreshToken,
  setAdminUser,
} from './client';
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
    if (res.accessToken) setAdminToken(res.accessToken);
    if (res.refreshToken) setAdminRefreshToken(res.refreshToken);
    if (res.admin) setAdminUser(res.admin);
    return res;
  },

  async logout(): Promise<void> {
    const refreshToken = getAdminRefreshToken();
    try {
      await apiClient('/admin/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }, 'admin');
    } catch {
      // ignore
    } finally {
      setAdminToken(null);
      setAdminRefreshToken(null);
      setAdminUser(null);
    }
  },

  async getMe(): Promise<any> {
    const res = await apiClient('/admin/auth/me', {}, 'admin');
    if (res?.admin) {
      setAdminUser(res.admin);
    }
    return res;
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
    const res: any = await apiClient(`/admin/users${qs}`, {}, 'admin');
    const users = res.users || res.data || (Array.isArray(res) ? res : []);
    const total = res.total ?? res.pagination?.total ?? users.length;
    return { users, total, page: res.pagination?.page || 1, limit: res.pagination?.limit || 50 };
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
    const res: any = await apiClient(`/admin/subscriptions${qs}`, {}, 'admin');
    const subscriptions = res.subscriptions || res.data || (Array.isArray(res) ? res : []);
    const total = res.total ?? res.pagination?.total ?? subscriptions.length;
    return { subscriptions, total };
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

  async changeUserPlan(userId: string, targetPlan: string, reason?: string): Promise<{ success: boolean }> {
    return apiClient(`/admin/users/${userId}/change-plan`, {
      method: 'POST',
      body: JSON.stringify({ targetPlan, planId: targetPlan, reason: reason || 'Admin plan change' }),
    }, 'admin');
  },

  async getPayments(): Promise<{ payments: any[]; total: number }> {
    const res: any = await apiClient('/admin/payments', {}, 'admin');
    const payments = res.payments || res.data || (Array.isArray(res) ? res : []);
    const total = res.total ?? res.pagination?.total ?? payments.length;
    return { payments, total };
  },

  async getInvoices(): Promise<{ invoices: InvoiceInfo[]; total: number }> {
    const res: any = await apiClient('/admin/invoices', {}, 'admin');
    const invoices = res.invoices || res.data || (Array.isArray(res) ? res : []);
    const total = res.total ?? res.pagination?.total ?? invoices.length;
    return { invoices, total };
  },

  async getInvoice(id: string): Promise<InvoiceInfo> {
    return apiClient<InvoiceInfo>(`/admin/invoices/${id}`, {}, 'admin');
  },

  async sendInvoice(id: string, recipientEmail?: string): Promise<{ success: boolean; message: string }> {
    return apiClient(`/admin/invoices/${id}/send`, {
      method: 'POST',
      body: JSON.stringify(recipientEmail ? { recipientEmail } : {}),
    }, 'admin');
  },

  async downloadInvoicePdf(id: string, invoiceNumber: string): Promise<void> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1';
    const token = typeof window !== 'undefined' ? localStorage.getItem('meetmind_admin_token') : null;

    const response = await fetch(`${apiBase}/admin/invoices/${id}/pdf`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      throw new Error(errJson?.message || 'Failed to download invoice PDF');
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `Invoice-${invoiceNumber || id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
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
    const res: any = await apiClient('/admin/recordings', {}, 'admin');
    const recordings = res.recordings || res.data || (Array.isArray(res) ? res : []);
    const total = res.total ?? res.pagination?.total ?? recordings.length;
    return { recordings, total };
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
    const res: any = await apiClient(`/admin/audit-logs${qs}`, {}, 'admin');
    const logs = res.logs || res.data || (Array.isArray(res) ? res : []);
    return { logs };
  },

  async getSystemHealth(): Promise<any> {
    return apiClient('/admin/health', {}, 'admin');
  },

  async getPlatformSettings(): Promise<{ trialDays: number; dailyMinutes: number; allowRegistration: boolean; trialPlanId?: string }> {
    const res: any = await apiClient('/admin/plans', {}, 'admin');
    const plans = res.plans || (Array.isArray(res) ? res : []);
    const trialPlan = plans.find((p: any) => p.code === 'TRIAL');
    return {
      trialDays: trialPlan?.trialDays || 30,
      dailyMinutes: Math.floor((trialPlan?.dailyRecordingLimitSeconds || 1800) / 60),
      allowRegistration: true,
      trialPlanId: trialPlan?.id,
    };
  },

  async updatePlatformSettings(settings: { trialDays: number; dailyMinutes: number }): Promise<{ success: boolean }> {
    const res: any = await apiClient('/admin/plans', {}, 'admin');
    const plans = res.plans || (Array.isArray(res) ? res : []);
    const trialPlan = plans.find((p: any) => p.code === 'TRIAL');
    if (trialPlan) {
      await apiClient(`/admin/plans/${trialPlan.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          trialDays: settings.trialDays,
          dailyRecordingLimitSeconds: settings.dailyMinutes * 60,
        }),
      }, 'admin');
    }
    return { success: true };
  },
};
