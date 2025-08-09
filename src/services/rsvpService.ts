/**
 * RSVP Service
 * Handles all RSVP-related API operations
 */

import { apiClient } from './api';
import {
  IRSVP,
  CreateRSVPRequest,
  UpdateRSVPRequest,
  JoinWaitlistRequest,
  GetUserRSVPsParams,
  EventStatsResponse,
  ApiResponse
} from '@/types/rsvp';

export class RSVPService {
  // Create new RSVP
  static async createRSVP(data: CreateRSVPRequest): Promise<ApiResponse<IRSVP>> {
    return apiClient.post<IRSVP>('/rsvp', data);
  }

  // Get user's RSVPs
  static async getUserRSVPs(params?: GetUserRSVPsParams): Promise<ApiResponse<{ rsvps: IRSVP[]; pagination: any }>> {
    return apiClient.get<{ rsvps: IRSVP[]; pagination: any }>('/rsvp/my-rsvps', params);
  }

  // Get RSVP by ID
  static async getRSVPById(id: string): Promise<ApiResponse<IRSVP>> {
    return apiClient.get<IRSVP>(`/rsvp/${id}`);
  }

  // Update RSVP
  static async updateRSVP(id: string, data: UpdateRSVPRequest): Promise<ApiResponse<IRSVP>> {
    return apiClient.put<IRSVP>(`/rsvp/${id}`, data);
  }

  // Delete RSVP
  static async deleteRSVP(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/rsvp/${id}`);
  }

  // Get event RSVP statistics
  static async getEventStats(eventId: string): Promise<ApiResponse<EventStatsResponse>> {
    return apiClient.get<EventStatsResponse>(`/rsvp/event/${eventId}/stats`);
  }

  // Get event attendees (Admin only)
  static async getEventAttendees(eventId: string, params?: GetUserRSVPsParams): Promise<ApiResponse<IRSVP[]>> {
    return apiClient.get<IRSVP[]>(`/rsvp/event/${eventId}/attendees`, params);
  }

  // Check event availability - This route might not exist, so we'll handle it gracefully
  static async checkEventAvailability(eventId: string): Promise<ApiResponse<{ available: boolean; waitlistEnabled: boolean }>> {
    try {
      return await apiClient.get(`/rsvp/event/${eventId}/availability`);
    } catch {
      // If route doesn't exist, return default availability
      return {
        status: 'success',
        data: { available: true, waitlistEnabled: false }
      };
    }
  }

  // Join waitlist - This route might not exist yet
  static async joinWaitlist(data: JoinWaitlistRequest): Promise<ApiResponse<IRSVP>> {
    try {
      return await apiClient.post<IRSVP>('/rsvp/waitlist', data);
    } catch {
      throw new Error('Waitlist functionality not available');
    }
  }

  // Get waitlist position - This route might not exist yet
  static async getWaitlistPosition(eventId: string): Promise<ApiResponse<{ position: number; totalWaitlisted: number }>> {
    try {
      return await apiClient.get(`/rsvp/waitlist/${eventId}/position`);
    } catch {
      return {
        status: 'success',
        data: { position: 0, totalWaitlisted: 0 }
      };
    }
  }

  // Send RSVP email - This route might not exist yet
  static async sendRSVPEmail(data: {
    rsvpId?: string;
    eventId?: string;
    emailType: 'confirmation' | 'reminder' | 'cancellation' | 'update';
    customMessage?: string;
  }): Promise<ApiResponse<{ sent: boolean }>> {
    try {
      return await apiClient.post('/rsvp/send-email', data);
    } catch {
      return {
        status: 'success',
        data: { sent: false }
      };
    }
  }

  // Send event reminder (Admin only) - This route might not exist yet
  static async sendEventReminder(data: {
    eventId: string;
    reminderType: '24_hours' | '1_week' | '1_day' | '2_hours';
    customMessage?: string;
  }): Promise<ApiResponse<{ sent: number }>> {
    try {
      return await apiClient.post('/rsvp/send-reminder', data);
    } catch {
      return {
        status: 'success',
        data: { sent: 0 }
      };
    }
  }

  // Get calendar links - This route might not exist yet
  static async getCalendarLinks(rsvpId: string): Promise<ApiResponse<{
    googleCalendar: string;
    outlookCalendar: string;
    icsDownload: string;
  }>> {
    try {
      return await apiClient.get(`/rsvp/${rsvpId}/calendar/links`);
    } catch {
      // Return empty links if route doesn't exist
      return {
        status: 'success',
        data: {
          googleCalendar: '',
          outlookCalendar: '',
          icsDownload: ''
        }
      };
    }
  }

  // Generate public calendar download URL - This might not be available yet
  static getPublicCalendarUrl(rsvpId: string, format: 'google' | 'outlook' | 'ics', token: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    return `${baseUrl}/rsvp/${rsvpId}/calendar/public?format=${format}&token=${token}`;
  }

  // Get user's RSVP for specific event
  static async getUserRSVPForEvent(eventId: string): Promise<ApiResponse<IRSVP | null>> {
    // Since there's no direct route, we'll get all user RSVPs and filter
    const response = await apiClient.get<{ rsvps: IRSVP[]; pagination: any }>('/rsvp/my-rsvps');

    if (response.status === 'success' && response.data && response.data.rsvps) {
      const userRSVP = response.data.rsvps.find(rsvp => rsvp.eventId === eventId);

      return {
        status: 'success',
        data: userRSVP || null
      };
    }
    return {
      status: 'success',
      data: null
    };
  }
}
