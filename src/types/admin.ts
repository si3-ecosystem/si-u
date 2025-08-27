/**
 * Admin Dashboard Types
 */

import { RSVPStatus } from './rsvp';

export interface AdminUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  createdAt: string;
  lastActive?: string;
}

export interface AdminRSVPData {
  id: string;
  sessionId: string;
  userId: string;
  status: RSVPStatus;
  createdAt: string;
  updatedAt: string;
  user: AdminUser;
  session: {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    location?: string;
  };
}

export interface AdminSessionStats {
  sessionId: string;
  sessionTitle: string;
  startTime: string;
  totalRSVPs: number;
  attending: number;
  maybe: number;
  notAttending: number;
  remindersSent: number;
  lastReminderSent?: string;
}

export interface AdminDashboardStats {
  totalSessions: number;
  totalRSVPs: number;
  upcomingSessions: number;
  activeUsers: number;
  remindersSentToday: number;
  systemHealth: 'healthy' | 'warning' | 'error';
  lastCronRun?: string;
}

export interface ReminderRequest {
  sessionId: string;
  userIds?: string[]; // If empty, send to all RSVP'd users
  message?: string;
  type: 'email' | 'sms' | 'both';
}

export interface BulkAction {
  action: 'delete' | 'remind' | 'export';
  rsvpIds: string[];
  sessionId?: string;
  message?: string;
}

export interface CronJobStatus {
  name: string;
  lastRun?: string;
  status: 'success' | 'failed' | 'running';
  nextRun?: string;
  message?: string;
}

// Admin Users Table Types
export interface AdminUserTableData {
  _id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  roles: string[];
  isVerified: boolean;
  newsletter: boolean;
  interests: string[];
  companyName?: string;
  companyAffiliation?: string;
  wallet_address?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  personalValues: string[];
  digitalLinks: Array<{
    platform: string;
    url: string;
  }>;
  walletInfo?: {
    address?: string;
    connectedWallet?: 'Zerion' | 'MetaMask' | 'WalletConnect' | 'Other';
    network?: 'Mainnet' | 'Polygon' | 'Arbitrum' | 'Base' | 'Optimism';
    connectedAt?: string;
    lastUsed?: string;
  };
}

export interface AdminUsersFilters {
  search: string;
  role: string;
  isVerified?: boolean | null;
  hasWallet?: boolean | null;
  newsletter?: boolean | null;
}

export interface AdminUsersSorting {
  sortBy: 'email' | 'name' | 'role' | 'isVerified' | 'lastLogin' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export interface AdminUsersResponse {
  success: boolean;
  data: AdminUserTableData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats: {
    totalUsers: number;
    verifiedUsers: number;
    usersWithWallet: number;
    newsletterSubscribers: number;
    roleStats: Record<string, number>;
  };
}

export interface AdminUsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string; // verified, unverified, wallet_verified, all
  hasWallet?: string;
  newsletter?: string;
  sortBy?: string;
  sortOrder?: string;
}
