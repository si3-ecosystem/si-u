/**
 * Admin Dashboard Types
 */

import { RSVPStatus, SessionWithRSVP } from './rsvp';

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
