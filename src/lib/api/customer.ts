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

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    timezone?: string;
    language?: string;
    country?: string;
  }): Promise<any> {
    return apiClient('/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, 'customer');
  },

  async getRecordings(params?: { limit?: number; page?: number; offset?: number }): Promise<any> {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.page) query.set('page', String(params.page));
    if (params?.offset && !params?.page) {
      const page = Math.floor(params.offset / (params.limit || 50)) + 1;
      query.set('page', String(page));
    }
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiClient(`/recordings${qs}`, {}, 'customer');
  },

  async getSubscription(): Promise<{ subscription: SubscriptionInfo | null; availablePlans: PlanInfo[] }> {
    return apiClient('/subscription', {}, 'customer');
  },

  async getPlans(): Promise<{ plans: PlanInfo[] }> {
    return apiClient('/plans', {}, 'none');
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

  async createRazorpayPaymentLink(planCode: string, callbackUrl?: string): Promise<{
    paymentLinkId: string;
    paymentLinkUrl: string;
    status: string;
    amount: number;
    currency: string;
    keyId: string;
    orderId?: string;
    isSimulation?: boolean;
    plan: {
      id?: string;
      code: string;
      name: string;
      description?: string;
      priceAmount: number;
      currency: string;
    };
  }> {
    try {
      return await apiClient('/subscription/razorpay/payment-link', {
        method: 'POST',
        body: JSON.stringify({ planCode, callbackUrl }),
      }, 'customer');
    } catch (err: any) {
      if (err?.status === 404) {
        return apiClient('/subscription/checkout', {
          method: 'POST',
          body: JSON.stringify({ planCode, successUrl: callbackUrl }),
        }, 'customer');
      }
      throw err;
    }
  },

  async createRazorpayOrder(planCode: string): Promise<{
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
    isSimulation?: boolean;
  }> {
    return apiClient('/subscription/razorpay/order', {
      method: 'POST',
      body: JSON.stringify({ planCode }),
    }, 'customer');
  },

  async verifyRazorpayPayment(data: {
    planCode: string;
    razorpayPaymentId: string;
    razorpayPaymentLinkId?: string;
    razorpayOrderId?: string;
    razorpaySignature?: string;
  }): Promise<{ success: boolean; message: string; subscription: SubscriptionInfo }> {
    try {
      return await apiClient('/subscription/razorpay/verify', {
        method: 'POST',
        body: JSON.stringify(data),
      }, 'customer');
    } catch (err: any) {
      if (err?.status === 404) {
        return apiClient('/subscription/change-plan', {
          method: 'POST',
          body: JSON.stringify({ planCode: data.planCode, targetPlan: data.planCode }),
        }, 'customer');
      }
      throw err;
    }
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
