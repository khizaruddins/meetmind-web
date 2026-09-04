import { apiClient } from './client';
import {
  CustomerDashboardMetrics,
  RecordingMetadata,
  SubscriptionInfo,
  PlanInfo,
  InvoiceInfo,
  PaymentMethodInfo,
  DeviceInfo,
  UserProfile,
} from '../types';

export const customerApi = {
  async getDashboard(): Promise<CustomerDashboardMetrics> {
    return apiClient<CustomerDashboardMetrics>('/dashboard', {}, 'customer');
  },

  async getDashboardOverview(): Promise<any> {
    return apiClient('/dashboard/overview', {}, 'customer');
  },

  async getProfile(): Promise<{ profile: UserProfile['profile']; user: UserProfile }> {
    return apiClient('/profile', {}, 'customer');
  },

  async getRecordings(params?: { limit?: number; offset?: number }): Promise<{ recordings: RecordingMetadata[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiClient(`/recordings${qs}`, {}, 'customer');
  },

  async getSubscription(): Promise<{ subscription: SubscriptionInfo | null; availablePlans: PlanInfo[] }> {
    return apiClient('/subscription', {}, 'customer');
  },

  async changePlanPreview(targetPlan: string): Promise<any> {
    return apiClient('/subscription/change-plan/preview', {
      method: 'POST',
      body: JSON.stringify({ targetPlan }),
    }, 'customer');
  },

  async changePlan(targetPlan: string): Promise<{ success: boolean; subscription: SubscriptionInfo }> {
    return apiClient('/subscription/change-plan', {
      method: 'POST',
      body: JSON.stringify({ targetPlan, planCode: targetPlan }),
    }, 'customer');
  },

  async cancelSubscription(): Promise<{ success: boolean; subscription: SubscriptionInfo }> {
    return apiClient('/subscription/cancel', { method: 'POST' }, 'customer');
  },

  async resumeSubscription(): Promise<{ success: boolean; subscription: SubscriptionInfo }> {
    return apiClient('/subscription/resume', { method: 'POST' }, 'customer');
  },

  async getInvoices(): Promise<{ invoices: InvoiceInfo[] }> {
    return apiClient('/invoices', {}, 'customer');
  },

  async getPaymentMethods(): Promise<{ paymentMethods: PaymentMethodInfo[] }> {
    return apiClient('/payment-methods', {}, 'customer');
  },

  async addPaymentMethod(data: { brand: string; last4: string; expMonth: number; expYear: number; isDefault?: boolean }): Promise<{ paymentMethod: PaymentMethodInfo }> {
    return apiClient('/payment-methods/setup', {
      method: 'POST',
      body: JSON.stringify(data),
    }, 'customer');
  },

  async setDefaultPaymentMethod(id: string): Promise<{ success: boolean }> {
    return apiClient(`/payment-methods/${id}/default`, { method: 'POST' }, 'customer');
  },

  async deletePaymentMethod(id: string): Promise<{ success: boolean }> {
    return apiClient(`/payment-methods/${id}`, { method: 'DELETE' }, 'customer');
  },

  async getDevices(): Promise<{ devices: DeviceInfo[] }> {
    return apiClient('/devices', {}, 'customer');
  },

  async revokeDevice(id: string): Promise<{ success: boolean }> {
    return apiClient(`/devices/${id}/revoke`, { method: 'POST' }, 'customer');
  },

  async getUsageToday(): Promise<{
    allowed: boolean;
    dailyLimitSeconds: number | null;
    usedTodaySeconds: number;
    remainingTodaySeconds: number | null;
  }> {
    return apiClient('/usage/today', {}, 'customer');
  },

  async logoutAllDevices(): Promise<{ success: boolean }> {
    return apiClient('/sessions', { method: 'DELETE' }, 'customer');
  },

  async requestAccountDeletion(): Promise<{ success: boolean; message: string }> {
    return apiClient('/account/request-deletion', { method: 'POST' }, 'customer');
  },
};
