"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateProfileRequest } from '@/services/profileService';
import { ErrorHandler } from '@/utils/errorHandler';
import { useAppSelector } from '@/redux/store';
import { UnifiedAuthService } from '@/services/authService';

/**
 * Hook for managing user profile operations
 */
export function useProfile() {
  const queryClient = useQueryClient();

  // Get user data from Redux store instead of API call
  const currentUser = useAppSelector(state => state.user);

  // Extract profile data from Redux user state
  const profile = currentUser?.user ? {
    _id: currentUser.user._id,
    email: currentUser.user.email,
    username: currentUser.user.username,
    name: currentUser.user.name || `${currentUser.user.firstName || ''} ${currentUser.user.lastName || ''}`.trim(),
    firstName: currentUser.user.firstName,
    lastName: currentUser.user.lastName,
    phone: currentUser.user.phone,
    bio: currentUser.user.bio,
    avatar: currentUser.user.avatar,
    profileImage: currentUser.user.profileImage,
    roles: currentUser.user.roles || [],
    isVerified: currentUser.user.isVerified || currentUser.user.isEmailVerified || false,
    isEmailVerified: currentUser.user.isEmailVerified || currentUser.user.isVerified || false,
    newsletter: currentUser.user.newsletter || false,
    interests: currentUser.user.interests || [],
    companyName: currentUser.user.companyName,
    wallet_address: currentUser.user.wallet_address,
    personalValues: currentUser.user.personalValues || [],
    companyAffiliation: currentUser.user.companyAffiliation,
    digitalLinks: currentUser.user.digitalLinks || [],
    createdAt: currentUser.user.createdAt,
    updatedAt: currentUser.user.updatedAt,
  } : null;

  // Check if we're still loading user data
  const isLoading = !currentUser?.isInitialized || (!currentUser?.user && currentUser?.isLoggedIn);
  const error = null; // No error since we're using Redux data

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => UnifiedAuthService.updateProfile(data),

    onError: (error) => {
      ErrorHandler.handle(error, 'Profile update');
    },

    onSuccess: (data) => {
      ErrorHandler.showSuccess('Profile updated successfully!');

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

    onSuccess: (data) => {
      ErrorHandler.showSuccess('Email updated successfully!');

      // Invalidate RSVP queries since email validation affects RSVP
      queryClient.invalidateQueries({ queryKey: ['user-rsvps'] });
      queryClient.invalidateQueries({ queryKey: ['rsvp'] });
    },
  });

  // Mutation for updating name specifically
  const updateNameMutation = useMutation({
    mutationFn: (name: string) => UnifiedAuthService.updateProfile({ name }),

    onError: (error) => {
      ErrorHandler.handle(error, 'Name update');
    },

    onSuccess: (data) => {
      ErrorHandler.showSuccess('Name updated successfully!');

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['user-rsvps'] });
    },
  });

  // Check if user has temporary email
  const isTemporaryEmail = (email?: string) => {
    if (!email) return true;
    return email.endsWith('.temp') || email.includes('wallet') || email.includes('@wallet.temp');
  };

  // Check if profile is complete
  const isProfileComplete = () => {
    if (!profile) return false;
    return !isTemporaryEmail(profile.email) && !!profile.name;
  };

  // Get profile completion percentage
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
