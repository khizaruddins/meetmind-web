export interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  emailVerified: boolean;
  status: 'ACTIVE' | 'DISABLED' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
  trial?: TrialInfo | null;
  subscriptions?: SubscriptionInfo[];
  profile?: {
    timezone: string;
    language: string;
    country: string | null;
    avatarUrl: string | null;
  };
}

export interface TrialInfo {
  id: string;
  userId: string;
  startedAt: string;
  expiresAt: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CONVERTED';
  extendedDays: number;
}

export interface PlanInfo {
  id: string;
  code: 'TRIAL' | 'SILVER' | 'GOLD' | string;
  name: string;
  description: string;
  priceAmount: number; // in cents, e.g. 1900 = $19.00
  currency: string;
  billingInterval: 'NONE' | 'MONTHLY' | 'YEARLY';
  trialDays: number;
  dailyRecordingLimitSeconds: number | null;
  active: boolean;
}

export interface SubscriptionInfo {
  id: string;
  userId: string;
  planId: string;
  plan: PlanInfo;
  status: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  cancelledAt: string | null;
  trialStart?: string;
  trialEnd?: string;
}

export interface RecordingMetadata {
  id: string;
  userId: string;
  title: string;
  platform: string; // 'Google Meet', 'Manual', etc.
  durationSeconds: number;
  captureMode: string;
  status: 'COMPLETED' | 'FAILED' | 'RECORDING' | 'ACTIVE' | string;
  deviceName?: string;
  devicePlatform?: string;
  createdAt: string;
}

export interface InvoiceInfo {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'PAID' | 'OPEN' | 'VOID' | 'UNCOLLECTIBLE';
  createdAt: string;
  paidAt: string | null;
  periodStart: string;
  periodEnd: string;
  pdfUrl?: string;
  planName?: string;
}

export interface PaymentMethodInfo {
  id: string;
  brand: string; // 'Visa', 'Mastercard', etc.
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface DeviceInfo {
  id: string;
  installationId: string;
  deviceName: string;
  platform: string; // 'Linux', 'Windows', 'macOS'
  appVersion: string;
  lastSeenAt: string;
  createdAt: string;
  status: 'ACTIVE' | 'REVOKED';
}

export interface CustomerDashboardMetrics {
  currentPlan: string;
  trialDaysRemaining?: number;
  usageTodaySeconds: number;
  dailyLimitSeconds: number | null;
  recordingsToday: number;
  recordingsThisMonth: number;
  totalRecordingSecondsMonth: number;
  recentRecordings: RecordingMetadata[];
  latestInvoice?: InvoiceInfo;
  activeDevicesCount: number;
}

export interface AdminUserListItem {
  id: string;
  email: string;
  displayName: string;
  status: string;
  planCode: string;
  subscriptionStatus: string;
  trialStatus: string;
  recordingsCount: number;
  usageTodaySeconds: number;
  totalUsageSeconds: number;
  devicesCount: number;
  lastActiveAt: string | null;
  createdAt: string;
}

export interface AdminDashboardMetrics {
  totalClients: number;
  activeToday: number;
  trialAccounts: number;
  silverAccounts: number;
  goldAccounts: number;
  activeSubscriptions: number;
  pastDueCount: number;
  cancelledCount: number;
  recordingsToday: number;
  recordingMinutesToday: number;
  monthlyRevenue: number;
  failedPaymentsCount: number;
}

export interface AuditLogItem {
  id: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  targetEmail?: string;
  details: Record<string, any>;
  timestamp: string;
}

export interface SystemHealthItem {
  service: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  latencyMs: number;
  lastCheck: string;
  error?: string;
}
