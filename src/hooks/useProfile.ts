"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateProfileRequest } from '@/services/profileService';
import { ErrorHandler } from '@/utils/errorHandler';
import { useAppSelector } from '@/redux/store';
import { useCurrentUserV2 } from '@/hooks/auth/useCurrentUserV2';
import { UnifiedAuthService } from '@/services/authService';

/**
 * Hook for managing user profile operations
 */
export function useProfile() {
  const queryClient = useQueryClient();

  // Prefer authV2 user; fallback to legacy only if authV2 not authenticated
  const { user: v2User, isAuthenticated: v2Authed, isLoading: v2Loading } = useCurrentUserV2();
  const legacyState = useAppSelector(state => state.user);
  const srcUser = v2Authed ? (v2User as any) : (legacyState?.user as any);

  // Extract profile data from selected source
  const profile = srcUser ? {
    _id: srcUser._id,
    email: srcUser.email,
    username: srcUser.username,
    name: srcUser.name || `${srcUser.firstName || ''} ${srcUser.lastName || ''}`.trim(),
    firstName: srcUser.firstName,
    lastName: srcUser.lastName,
    phone: srcUser.phone,
    bio: srcUser.bio,
    avatar: srcUser.avatar,
    profileImage: srcUser.profileImage,
    roles: srcUser.roles || [],
    isVerified: srcUser.isVerified || srcUser.isEmailVerified || false,
    isEmailVerified: srcUser.isEmailVerified || srcUser.isVerified || false,
    newsletter: srcUser.newsletter || false,
    interests: srcUser.interests || [],
    companyName: srcUser.companyName,
    wallet_address: srcUser.wallet_address,
    personalValues: srcUser.personalValues || [],
    companyAffiliation: srcUser.companyAffiliation,
    digitalLinks: srcUser.digitalLinks || [],
    telegramHandle: srcUser.telegramHandle,
    createdAt: srcUser.createdAt,
    updatedAt: srcUser.updatedAt,
  } : null;

  // Loading derived from authV2 primarily
  const isLoading = v2Loading && !v2Authed;
  const error = null; // No error since we're using Redux-driven data

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => UnifiedAuthService.updateProfile(data),

    onError: (error) => {
      ErrorHandler.handle(error, 'Profile update');
    },

    onSuccess: async (data) => {
      console.log('🎉 Profile update success - Response data:', data);
      ErrorHandler.showSuccess('Profile updated successfully!');

      // If the response doesn't contain updated user data, force refresh from server
      if (!data || !data.username) {
        try {
          await UnifiedAuthService.forceRefreshUserData();
        } catch (error) {
          console.error('❌ Failed to refresh user data:', error);
        }
      }

      // Invalidate related queries (like RSVP queries that depend on user data)
      queryClient.invalidateQueries({ queryKey: ['user-rsvps'] });
      queryClient.invalidateQueries({ queryKey: ['rsvp'] });
    },
  });

  // Mutation for updating email specifically
  const updateEmailMutation = useMutation({
    mutationFn: (email: string) => UnifiedAuthService.updateProfile({ email }),

    onError: (error) => {
      ErrorHandler.handle(error, 'Email update');
    },

    onSuccess: async (data) => {
      ErrorHandler.showSuccess('Email updated successfully!');

      if (!data || !data.email) {
        try {
          await UnifiedAuthService.forceRefreshUserData();
        } catch (error) {
          console.error('❌ Failed to refresh user data:', error);
        }
      }

      queryClient.invalidateQueries({ queryKey: ['user-rsvps'] });
      queryClient.invalidateQueries({ queryKey: ['rsvp'] });
    },
  });

  const updateNameMutation = useMutation({
    mutationFn: (name: string) => UnifiedAuthService.updateProfile({ name }),

    onError: (error) => {
      ErrorHandler.handle(error, 'Name update');
    },

    onSuccess: async (data) => {
      console.log('👤 Name update success - Response data:', data);
      ErrorHandler.showSuccess('Name updated successfully!');

      if (!data || !data.name) {
        console.log('⚠️ API response missing updated user data, forcing refresh...');
        try {
          await UnifiedAuthService.forceRefreshUserData();
          console.log('✅ User data refreshed successfully');
        } catch (error) {
          console.error('❌ Failed to refresh user data:', error);
        }
      }

      queryClient.invalidateQueries({ queryKey: ['user-rsvps'] });
    },
  });

  const isTemporaryEmail = (email?: string) => {
    if (!email) return true;
    return email.endsWith('.temp') || email.includes('wallet') || email.includes('@wallet.temp');
  };

  const isProfileComplete = () => {
    if (!profile) return false;
    return !isTemporaryEmail(profile.email) && !!profile.name;
  };

  const getProfileCompletion = () => {
    if (!profile) return 0;

    let completed = 0;
    const total = 5;

    if (profile.email && !isTemporaryEmail(profile.email)) completed++;
    if (profile.name) completed++;
    if (profile.phone) completed++;
    if (profile.bio) completed++;
    if (profile.companyName || profile.companyAffiliation) completed++;

    return Math.round((completed / total) * 100);
  };

  // Force refresh user data (if backend doesn't return new token)
  const forceRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return {
    // Data
    profile,
    isTemporaryEmail: isTemporaryEmail(profile?.email),
    isProfileComplete: isProfileComplete(),
    profileCompletion: getProfileCompletion(),
    
    // Loading states
    isLoading,
    isUpdating: updateProfileMutation.isPending,
    isUpdatingEmail: updateEmailMutation.isPending,
    isUpdatingName: updateNameMutation.isPending,
    
    // Error states
    error,
    
    // Actions
    updateProfile: (data: UpdateProfileRequest) => updateProfileMutation.mutate(data),
    updateEmail: (email: string) => updateEmailMutation.mutate(email),
    updateName: (name: string) => updateNameMutation.mutate(name),
    forceRefresh,

    // Helper functions
    checkTemporaryEmail: isTemporaryEmail,
  };
}
