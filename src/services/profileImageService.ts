/**
 * Profile Image Upload Service
 * Handles profile image uploads to IPFS via Pinata with automatic profile updates
 */

import { apiClient } from './api';
import { ApiResponse } from '@/types/rsvp';
import { UserData } from '@/redux/slice/userSlice';

// Response interface for profile image upload
export interface ProfileImageUploadResponse {
  success: boolean;
  url: string;
  ipfsHash: string;
  originalName: string;
  user: UserData;
  message: string;
}

// Error response interface
export interface ProfileImageUploadError {
  success: false;
  error: string;
}

// File validation constraints
export const PROFILE_IMAGE_CONSTRAINTS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_DIMENSION: 2048, // Max width/height in pixels
} as const;

export class ProfileImageService {
  /**
   * Validate image file before upload
   */
  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (!PROFILE_IMAGE_CONSTRAINTS.ALLOWED_TYPES.includes(file.type as any)) {
      return {
        isValid: false,
        error: 'Please select a valid image file (JPEG, PNG, or WebP)',
      };
    }

    // Check file size
    if (file.size > PROFILE_IMAGE_CONSTRAINTS.MAX_SIZE) {
      const maxSizeMB = PROFILE_IMAGE_CONSTRAINTS.MAX_SIZE / (1024 * 1024);
      return {
        isValid: false,
        error: `Image size must be less than ${maxSizeMB}MB`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validate image dimensions (optional - for better UX)
   */
  static async validateImageDimensions(file: File): Promise<{ isValid: boolean; error?: string }> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        
        if (img.width > PROFILE_IMAGE_CONSTRAINTS.MAX_DIMENSION || 
            img.height > PROFILE_IMAGE_CONSTRAINTS.MAX_DIMENSION) {
          resolve({
            isValid: false,
            error: `Image dimensions must be less than ${PROFILE_IMAGE_CONSTRAINTS.MAX_DIMENSION}x${PROFILE_IMAGE_CONSTRAINTS.MAX_DIMENSION} pixels`,
          });
        } else {
          resolve({ isValid: true });
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          isValid: false,
          error: 'Invalid image file',
        });
      };

      img.src = url;
    });
  }

  /**
   * Upload profile image to IPFS and update user profile
   * Uses the recommended /api/pinata/upload-profile-image endpoint
   */
  static async uploadProfileImage(file: File): Promise<ApiResponse<ProfileImageUploadResponse>> {
    // Validate file before upload
    const validation = this.validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Optional: Validate dimensions for better UX
    const dimensionValidation = await this.validateImageDimensions(file);
    if (!dimensionValidation.isValid) {
      throw new Error(dimensionValidation.error);
    }

    // Create FormData for multipart upload
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Use apiClient which handles authentication headers automatically
      const response = await apiClient.post<ProfileImageUploadResponse>(
        '/pinata/upload-profile-image',
        formData
      );

      console.log('📡 ProfileImageService - Raw API Response:', response);
      console.log('📡 ProfileImageService - Response Type:', typeof response);
      console.log('📡 ProfileImageService - Response Keys:', Object.keys(response || {}));

      // Check if response is already in ApiResponse format or direct data
      if (response && typeof response === 'object') {
        // If response has a 'data' property, it's already wrapped
        if ('data' in response) {
          console.log('📡 Response already wrapped, using as-is');
          return response as ApiResponse<ProfileImageUploadResponse>;
        } else {
          // If response is the direct data, wrap it
          console.log('📡 Response is direct data, wrapping it');
          const wrappedResponse: ApiResponse<ProfileImageUploadResponse> = {
            status: 'success',
            data: response as unknown as ProfileImageUploadResponse
          };
          console.log('📡 ProfileImageService - Wrapped Response:', wrappedResponse);
          console.log('📡 ProfileImageService - User Data:', wrappedResponse.data?.user);
          return wrappedResponse;
        }
      }

      throw new Error('Invalid response format');
    } catch (error) {
      // Handle specific error cases
      if (error instanceof Error) {
        throw new Error(`Profile image upload failed: ${error.message}`);
      }
      throw new Error('Profile image upload failed. Please try again.');
    }
  }

  /**
   * Upload image to IPFS without updating profile (for general use)
   * Uses the /api/pinata/upload endpoint
   */
  static async uploadImageOnly(file: File): Promise<ApiResponse<{
    success: boolean;
    url: string;
    ipfsHash: string;
    originalName: string;
  }>> {
    // Validate file before upload
    const validation = this.validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Create FormData for multipart upload
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Use apiClient for consistent error handling
      const response = await apiClient.post<{
        success: boolean;
        url: string;
        ipfsHash: string;
        originalName: string;
      }>('/pinata/upload', formData);

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Image upload failed: ${error.message}`);
      }
      throw new Error('Image upload failed. Please try again.');
    }
  }

  /**
   * Get file size in human-readable format
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Create a preview URL for the selected file
   */
  static createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Clean up preview URL to prevent memory leaks
   */
  static revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}
