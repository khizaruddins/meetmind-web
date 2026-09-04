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

  const response = await fetch(url, {
    ...options,
    headers,
  });

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
