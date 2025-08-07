/**
 * Notification Settings Service
 * Handles notification preferences API operations
 */

import { apiClient } from './api';
import { ApiResponse } from '@/types/rsvp';

export interface NotificationSettings {
  emailUpdates: boolean;
  sessionReminder: boolean;
  // marketingEmails: boolean;
  // weeklyDigest: boolean;
  // eventAnnouncements: boolean;
}

export type NotificationSettingsResponse = ApiResponse<NotificationSettings>;

export type NotificationSettingsSummaryResponse = ApiResponse<{
  notificationSettings: NotificationSettings;
  summary: {
    enabledCount: number;
    totalCount: number;
    lastUpdated: string;
  };
}>;

export type UpdateNotificationSettingsRequest = Partial<NotificationSettings>;

export class NotificationService {
  /**
   * Get current notification settings
   */
  static async getNotificationSettings(): Promise<NotificationSettingsResponse> {
    const response = await apiClient.get<NotificationSettings>('/user/notification-settings');
    return response;
  }

  /**
   * Update notification settings (full update)
   */
  static async updateNotificationSettings(
    settings: NotificationSettings
  ): Promise<NotificationSettingsResponse> {
    const response = await apiClient.put<NotificationSettings>('/user/notification-settings', settings);
    return response;
  }

  /**
   * Update notification settings (partial update)
   */
  static async updateNotificationSettingsPartial(
    settings: UpdateNotificationSettingsRequest
  ): Promise<NotificationSettingsResponse> {
    const response = await apiClient.patch<NotificationSettings>('/user/notification-settings', settings);
    return response;
  }

  /**
   * Reset notification settings to defaults
   */
  static async resetNotificationSettings(): Promise<NotificationSettingsResponse> {
    const response = await apiClient.post<NotificationSettings>('/user/notification-settings/reset');
    return response;
  }

  /**
   * Get notification settings summary
   */
  static async getNotificationSettingsSummary(): Promise<NotificationSettingsSummaryResponse> {
    const response = await apiClient.get<{
      notificationSettings: NotificationSettings;
      summary: {
        enabledCount: number;
        totalCount: number;
        lastUpdated: string;
      };
    }>('/user/notification-settings/summary');
    return response;
  }

  /**
   * Update a single notification setting
   */
  static async updateSingleSetting(
    key: keyof NotificationSettings,
    value: boolean
  ): Promise<NotificationSettingsResponse> {
    const settings = { [key]: value };
    return this.updateNotificationSettingsPartial(settings);
  }

  /**
   * Get default notification settings
   */
  static getDefaultSettings(): NotificationSettings {
    return {
      emailUpdates: true,
      sessionReminder: true,
      // marketingEmails: false,
      // weeklyDigest: true,
      // eventAnnouncements: true,
    };
  }

  /**
   * Validate notification settings object
   */
  static validateSettings(settings: Partial<NotificationSettings>): boolean {
    const validKeys: (keyof NotificationSettings)[] = [
      'emailUpdates',
      'sessionReminder',
      // 'marketingEmails',
      // 'weeklyDigest',
      // 'eventAnnouncements',
    ];

    for (const [key, value] of Object.entries(settings)) {
      if (!validKeys.includes(key as keyof NotificationSettings)) {
        return false;
      }
      if (typeof value !== 'boolean') {
        return false;
      }
    }

    return true;
  }

  /**
   * Get human-readable setting names
   */
  static getSettingDisplayNames(): Record<keyof NotificationSettings, string> {
    return {
      emailUpdates: 'Email Updates',
      sessionReminder: 'Session Reminders',
      // marketingEmails: 'Marketing Emails',
      // weeklyDigest: 'Weekly Digest',
      // eventAnnouncements: 'Event Announcements',
    };
  }

  /**
   * Get setting descriptions
   */
  static getSettingDescriptions(): Record<keyof NotificationSettings, string> {
    return {
      emailUpdates: 'Receive email notifications for important updates',
      sessionReminder: 'Get reminded about upcoming sessions',
      // marketingEmails: 'Receive promotional and marketing communications',
      // weeklyDigest: 'Get a weekly summary of activities and updates',
      // eventAnnouncements: 'Be notified about new events and announcements',
    };
  }
}
