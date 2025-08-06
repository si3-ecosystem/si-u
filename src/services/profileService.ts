/**
 * Profile Service
 * Handles user profile-related API operations
 */

import { apiClient } from './api';
import { ApiResponse } from '@/types/rsvp';

export interface UserProfile {
  _id: string;
  email: string;
  username?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  roles: string[];
  isVerified: boolean;
  newsletter: boolean;
  interests: string[];
  companyName?: string;
  wallet_address?: string;
  personalValues: string[];
  companyAffiliation?: string;
  digitalLinks: Array<{
    platform: string;
    url: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  email?: string;
  username?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  companyName?: string;
  companyAffiliation?: string;
  interests?: string[];
  personalValues?: string[];
  newsletter?: boolean;
  isVerified?: boolean;
  digitalLinks?: Array<{
    platform: string;
    url: string;
  }>;
}

export class ProfileService {
  // Get current user profile
  static async getCurrentProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>('/auth/me');
  }

  // Refresh user data and get new JWT token
  static async refreshUserData(): Promise<ApiResponse<{ user: UserProfile; token: string }>> {
    return apiClient.post<{ user: UserProfile; token: string }>('/auth/refresh-profile');
  }

  // Update user profile
  static async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> {
    return apiClient.patch<UserProfile>('/auth/profile', data);
  }

  // Update email specifically
  static async updateEmail(email: string): Promise<ApiResponse<UserProfile>> {
    return apiClient.patch<UserProfile>('/auth/profile', { email });
  }

  // Update name specifically
  static async updateName(name: string): Promise<ApiResponse<UserProfile>> {
    return apiClient.patch<UserProfile>('/auth/profile', { name });
  }

  // Verify email
  static async verifyEmail(token: string): Promise<ApiResponse<{ verified: boolean }>> {
    return apiClient.post('/auth/verify-email', { token });
  }

  // Resend verification email
  static async resendVerificationEmail(): Promise<ApiResponse<{ sent: boolean }>> {
    return apiClient.post('/auth/resend-verification', {});
  }

  // Check if email is available
  static async checkEmailAvailability(email: string): Promise<ApiResponse<{ available: boolean }>> {
    return apiClient.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
  }

  // Upload profile avatar
  static async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    // For FormData, we need to let the browser set the Content-Type header
    return apiClient.post('/auth/upload-avatar', formData, {
      headers: {
        // Don't set Content-Type for FormData - let browser handle it
      },
    });
  }

  // Delete account
  static async deleteAccount(): Promise<ApiResponse<{ deleted: boolean }>> {
    return apiClient.delete('/auth/profile');
  }
}
