const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1';

export class ApiError extends Error {
  code?: string;
  status: number;
  details?: any;

  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function getCustomerToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('meetmind_customer_token');
}

export function setCustomerToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('meetmind_customer_token', token);
  } else {
    localStorage.removeItem('meetmind_customer_token');
  }
}

export function getCustomerRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('meetmind_customer_refresh_token');
}

export function setCustomerRefreshToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('meetmind_customer_refresh_token', token);
  } else {
    localStorage.removeItem('meetmind_customer_refresh_token');
  }
}

export function getCustomerUser(): any | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('meetmind_customer_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCustomerUser(user: any | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('meetmind_customer_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('meetmind_customer_user');
  }
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('meetmind_admin_token');
}

export function setAdminToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('meetmind_admin_token', token);
  } else {
    localStorage.removeItem('meetmind_admin_token');
  }
}

export function getAdminRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('meetmind_admin_refresh_token');
}

export function setAdminRefreshToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('meetmind_admin_refresh_token', token);
  } else {
    localStorage.removeItem('meetmind_admin_refresh_token');
  }
}

export function getAdminUser(): any | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('meetmind_admin_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAdminUser(admin: any | null): void {
  if (typeof window === 'undefined') return;
  if (admin) {
    localStorage.setItem('meetmind_admin_user', JSON.stringify(admin));
  } else {
    localStorage.removeItem('meetmind_admin_user');
  }
}

let customerRefreshPromise: Promise<string | null> | null = null;
async function refreshCustomerAccessToken(): Promise<string | null> {
  const refreshToken = getCustomerRefreshToken();
  if (!refreshToken) return null;
  if (!customerRefreshPromise) {
    customerRefreshPromise = (async () => {
      try {
        const refreshUrl = `${API_BASE}/auth/refresh`;
        const res = await fetch(refreshUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) {
          setCustomerToken(null);
          setCustomerRefreshToken(null);
          setCustomerUser(null);
          return null;
        }
        const data = await res.json();
        if (data?.accessToken) {
          setCustomerToken(data.accessToken);
          if (data.refreshToken) {
            setCustomerRefreshToken(data.refreshToken);
          }
          return data.accessToken as string;
        }
        return null;
      } catch {
        return null;
      } finally {
        customerRefreshPromise = null;
      }
    })();
  }
  return customerRefreshPromise;
}

let adminRefreshPromise: Promise<string | null> | null = null;
async function refreshAdminAccessToken(): Promise<string | null> {
  const refreshToken = getAdminRefreshToken();
  if (!refreshToken) return null;
  if (!adminRefreshPromise) {
    adminRefreshPromise = (async () => {
      try {
        const refreshUrl = `${API_BASE}/admin/auth/refresh`;
        const res = await fetch(refreshUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) {
          setAdminToken(null);
          setAdminRefreshToken(null);
          setAdminUser(null);
          return null;
        }
        const data = await res.json();
        if (data?.accessToken) {
          setAdminToken(data.accessToken);
          if (data.refreshToken) {
            setAdminRefreshToken(data.refreshToken);
          }
          return data.accessToken as string;
        }
        return null;
      } catch {
        return null;
      } finally {
        adminRefreshPromise = null;
      }
    })();
  }
  return adminRefreshPromise;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {},
  tokenType: 'customer' | 'admin' | 'none' = 'customer'
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (tokenType === 'customer') {
    const token = getCustomerToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } else if (tokenType === 'admin') {
    const token = getAdminToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Automatically refresh access token if expired (401) and retry once
  if (
    response.status === 401 &&
    tokenType === 'customer' &&
    !endpoint.includes('/auth/login') &&
    !endpoint.includes('/auth/refresh') &&
    !endpoint.includes('/auth/logout') &&
    !endpoint.includes('/auth/signup')
  ) {
    const newToken = await refreshCustomerAccessToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, {
        ...options,
        headers,
      });
    }
  } else if (
    response.status === 401 &&
    tokenType === 'admin' &&
    !endpoint.includes('/admin/auth/login') &&
    !endpoint.includes('/admin/auth/refresh') &&
    !endpoint.includes('/admin/auth/logout')
  ) {
    const newAdminToken = await refreshAdminAccessToken();
    if (newAdminToken) {
      headers['Authorization'] = `Bearer ${newAdminToken}`;
      response = await fetch(url, {
        ...options,
        headers,
      });
    }
  }

  const contentType = response.headers.get('content-type');
  let data: any = null;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message = data?.error?.message || data?.message || `Request failed with status ${response.status}`;
    const code = data?.error?.code || data?.code;
    throw new ApiError(message, response.status, code, data);
  }

  return data as T;
}
