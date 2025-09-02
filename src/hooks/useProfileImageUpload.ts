/**
 * Custom hook for profile image upload functionality
 * Handles file validation, upload state, Redux updates, and user data refetching
 */

import React, { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector, store } from '@/redux/store';
import { updateUserProfile } from '@/redux/slice/userSlice';
import { mergeUser as mergeUserV2 } from '@/redux/slice/authSliceV2';
import { ProfileImageService, ProfileImageUploadResponse } from '@/services/profileImageService';
import { UnifiedAuthService } from '@/services/authService';
import { ErrorHandler } from '@/utils/errorHandler';

interface UseProfileImageUploadOptions {
  onSuccess?: (imageUrl: string, userData: any) => void;
  onError?: (error: string) => void;
  autoRefreshUserData?: boolean; // Whether to automatically refresh user data after upload
}

interface UseProfileImageUploadReturn {
  // State
  isUploading: boolean;
  uploadProgress: number;
  previewUrl: string | null;
  selectedFile: File | null;
  error: string | null;
  
  // Actions
  selectFile: (file: File) => void;
  uploadImage: () => Promise<void>;
  clearSelection: () => void;
  clearError: () => void;
  
  // Utilities
  validateFile: (file: File) => { isValid: boolean; error?: string };
  formatFileSize: (bytes: number) => string;
}

export function useProfileImageUpload(
  options: UseProfileImageUploadOptions = {}
): UseProfileImageUploadReturn {
  const {
    onSuccess,
    onError,
    autoRefreshUserData = true,
  } = options;

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const currentUser = useAppSelector(state => state.user.user);

  // Local state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setUploadProgress(10);
      const response = await ProfileImageService.uploadProfileImage(file);
      setUploadProgress(90);
      return response;
    },
    
    onSuccess: async (response) => {
      try {
        setUploadProgress(95);

        console.log('🎉 Profile image upload success:', response);
        console.log('📦 Full response data:', JSON.stringify(response.data, null, 2));

        // Check current Redux state before update
        const stateBefore = store.getState();
        console.log('🔍 Redux state BEFORE update:', {
          profileImage: stateBefore.user.user.profileImage,
          avatar: stateBefore.user.user.avatar,
          lastUpdated: stateBefore.user.lastUpdated,
          isLoggedIn: stateBefore.user.isLoggedIn
        });

        // Update Redux store with new user data immediately
        if (response.data?.user) {
          console.log('🔄 Updating Redux with new user data:', response.data.user);
          console.log('🖼️ New profileImage URL:', response.data.user.profileImage);

          dispatch(updateUserProfile(response.data.user));
          // Also update authV2 store so all v2 consumers update immediately
          dispatch(mergeUserV2({ profileImage: response.data.user.profileImage }));
          console.log('✅ Redux dispatch called');

          // Verify Redux state was updated immediately
          const stateAfter = store.getState();
          console.log('🔍 Redux state AFTER update:', {
            profileImage: stateAfter.user.user.profileImage,
            avatar: stateAfter.user.user.avatar,
            lastUpdated: stateAfter.user.lastUpdated,
            isLoggedIn: stateAfter.user.isLoggedIn
          });

          // Check if the update actually worked
          if (stateAfter.user.user.profileImage === response.data.user.profileImage) {
            console.log('✅ Redux state updated successfully!');
          } else {
            console.error('❌ Redux state NOT updated correctly!', {
              expected: response.data.user.profileImage,
              actual: stateAfter.user.user.profileImage
            });
          }
        } else {
          console.error('❌ No user data in response:', response.data);
        }

        // Refresh user data to ensure consistency (but don't await to avoid overriding)
        if (autoRefreshUserData) {
          // Don't await this to prevent it from overriding our immediate update
          UnifiedAuthService.refreshUserData().catch(error => {
            console.warn('Failed to refresh user data after image upload:', error);
          });
        }

        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        queryClient.invalidateQueries({ queryKey: ['user-rsvps'] });

        setUploadProgress(100);

        // Show success message
        toast.success('Profile image updated successfully!');

        // Call success callback
        if (onSuccess && response.data) {
          onSuccess(response.data.url, response.data.user);
        }

        // Clear selection after successful upload
        clearSelection();

      } catch (error) {
        console.error('Error in upload success handler:', error);
        // Still show success since the upload worked
        toast.success('Profile image updated successfully!');
      }
    },
    
    onError: (error) => {
      setUploadProgress(0);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed. Please try again.';
      setError(errorMessage);
      
      // Show error toast
      toast.error(errorMessage);
      
      // Handle error with ErrorHandler
      ErrorHandler.handle(error, 'Profile image upload');
      
      // Call error callback
      if (onError) {
        onError(errorMessage);
      }
    },
  });

  // File selection handler
  const selectFile = useCallback((file: File) => {
    // Clear previous error
    setError(null);
    
    // Validate file
    const validation = ProfileImageService.validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      toast.error(validation.error || 'Invalid file');
      return;
    }

    // Clean up previous preview URL
    if (previewUrl) {
      ProfileImageService.revokePreviewUrl(previewUrl);
    }

    // Set new file and create preview
    setSelectedFile(file);
    const newPreviewUrl = ProfileImageService.createPreviewUrl(file);
    setPreviewUrl(newPreviewUrl);
    
    // Reset upload progress
    setUploadProgress(0);
  }, [previewUrl]);

  // Upload handler
  const uploadImage = useCallback(async () => {
    if (!selectedFile) {
      const errorMsg = 'No file selected';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Additional validation before upload
    const validation = ProfileImageService.validateImageFile(selectedFile);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      toast.error(validation.error || 'Invalid file');
      return;
    }

    // Start upload
    uploadMutation.mutate(selectedFile);
  }, [selectedFile, uploadMutation]);

  // Clear selection handler
  const clearSelection = useCallback(() => {
    if (previewUrl) {
      ProfileImageService.revokePreviewUrl(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setError(null);
  }, [previewUrl]);

  // Clear error handler
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Validate file utility
  const validateFile = useCallback((file: File) => {
    return ProfileImageService.validateImageFile(file);
  }, []);

  // Format file size utility
  const formatFileSize = useCallback((bytes: number) => {
    return ProfileImageService.formatFileSize(bytes);
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        ProfileImageService.revokePreviewUrl(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    // State
    isUploading: uploadMutation.isPending,
    uploadProgress,
    previewUrl,
    selectedFile,
    error,
    
    // Actions
    selectFile,
    uploadImage,
    clearSelection,
    clearError,
    
    // Utilities
    validateFile,
    formatFileSize,
  };
}
