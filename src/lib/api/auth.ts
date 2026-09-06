import {
  apiClient,
  setCustomerToken,
  getCustomerRefreshToken,
  setCustomerRefreshToken,
  setCustomerUser,
} from './client';
import { UserProfile } from '../types';

export interface AuthResponse {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const authApi = {
  async signup(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    agreeToTerms: boolean;
  }): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }, 'none');
    if (res.accessToken) setCustomerToken(res.accessToken);
    if (res.refreshToken) setCustomerRefreshToken(res.refreshToken);
    if (res.user) setCustomerUser(res.user);
    return res;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, 'none');
    if (res.accessToken) setCustomerToken(res.accessToken);
    if (res.refreshToken) setCustomerRefreshToken(res.refreshToken);
    if (res.user) setCustomerUser(res.user);
    return res;
  },

  async refresh(): Promise<AuthResponse> {
    const refreshToken = getCustomerRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');
    const res = await apiClient<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }, 'none');
    if (res.accessToken) setCustomerToken(res.accessToken);
    if (res.refreshToken) setCustomerRefreshToken(res.refreshToken);
    return res;
  },

  async logout(): Promise<void> {
    const refreshToken = getCustomerRefreshToken();
    try {
      await apiClient('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }, 'customer');
    } catch {
      // ignore
    } finally {
      setCustomerToken(null);
      setCustomerRefreshToken(null);
      setCustomerUser(null);
    }
  },

  async getMe(): Promise<{ user: UserProfile }> {
    const res = await apiClient<{ user: UserProfile }>('/auth/me', {}, 'customer');
    if (res?.user) {
      setCustomerUser(res.user);
    }
    return res;
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return apiClient('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }, 'none');
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return apiClient('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }, 'none');
  },

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    return apiClient('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }, 'none');
  },

  async resendVerification(email?: string): Promise<{ message: string }> {
    return apiClient('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }, email ? 'none' : 'customer');
  },

  async getSessions(): Promise<{ sessions: any[] }> {
    return apiClient('/auth/sessions', {}, 'customer');
  },

  async revokeSession(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient(`/auth/sessions/${id}`, {
      method: 'DELETE',
    }, 'customer');
  },

  async logoutAll(keepCurrentSession?: boolean): Promise<{ success: boolean; message: string; revokedCount: number }> {
    return apiClient('/auth/logout-all', {
      method: 'POST',
      body: JSON.stringify({ keepCurrentSession }),
    }, 'customer');
  },
};
