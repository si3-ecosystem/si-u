"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService, UpdateProfileRequest } from '@/services/profileService';
import { ErrorHandler } from '@/utils/errorHandler';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import { updateUserProfile } from '@/redux/slice/userSlice';

/**
 * Hook for managing user profile operations
 */
export function useProfile() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

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
    roles: currentUser.user.roles || [],
    isVerified: currentUser.user.isVerified || false,
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

  const isLoading = false; // No loading since we're using Redux data
  const error = null; // No error since we're using Redux data

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => ProfileService.updateProfile(data),

    onError: (error) => {
      ErrorHandler.handle(error, 'Profile update');
    },

    onSuccess: (data) => {
      if (data.status === 'success' && data.data) {
        ErrorHandler.showSuccess('Profile updated successfully!');

        // Preserve current user session while updating profile data
        let updatedUser;

        if (data.data.user && data.data.token) {
          // Backend returned { user: {...}, token: "..." }
          updatedUser = {
            ...currentUser.user, // Preserve existing user data
            ...data.data.user,   // Apply updates
            _id: currentUser.user._id || data.data.user._id || data.data.user.id,
            // Preserve authentication-related fields
            isLoggedIn: true,
            wallet_address: currentUser.user.wallet_address,
          };

          // Update token in localStorage
          localStorage.setItem('si3-jwt', data.data.token);
        } else if (data.data.token) {
          // Backend returned user data with token field
          const { token, ...userData } = data.data;
          updatedUser = {
            ...currentUser.user, // Preserve existing user data
            ...userData,         // Apply updates
            _id: currentUser.user._id,
            isLoggedIn: true,
            wallet_address: currentUser.user.wallet_address,
          };
          localStorage.setItem('si3-jwt', token);
        } else {
          // Fallback: merge with existing user data without token update
          updatedUser = {
            ...currentUser.user,
            ...data.data,
            _id: currentUser.user._id || data.data._id,
            isLoggedIn: true,
            wallet_address: currentUser.user.wallet_address,
          };
        }

        // Update Redux store with merged user data using profile-specific action
        dispatch(updateUserProfile(updatedUser));

        // Invalidate related queries (like RSVP queries that depend on user data)
        queryClient.invalidateQueries({ queryKey: ['user-rsvps'] });
        queryClient.invalidateQueries({ queryKey: ['rsvp'] });
      }
    },
  });

  // Mutation for updating email specifically
  const updateEmailMutation = useMutation({
    mutationFn: (email: string) => ProfileService.updateEmail(email),

    onError: (error) => {
      ErrorHandler.handle(error, 'Email update');
    },

    onSuccess: (data) => {
      if (data.status === 'success' && data.data) {
        ErrorHandler.showSuccess('Email updated successfully!');

        // Preserve session while updating email
        let updatedUser;

        if (data.data.user && data.data.token) {
          updatedUser = {
            ...currentUser.user,
            ...data.data.user,
            _id: currentUser.user._id || data.data.user._id || data.data.user.id,
            isLoggedIn: true,
            wallet_address: currentUser.user.wallet_address,
          };
          localStorage.setItem('si3-jwt', data.data.token);
        } else if (data.data.token) {
          const { token, ...userData } = data.data;
          updatedUser = {
            ...currentUser.user,
            ...userData,
            _id: currentUser.user._id,
            isLoggedIn: true,
            wallet_address: currentUser.user.wallet_address,
          };
          localStorage.setItem('si3-jwt', token);
        } else {
          updatedUser = {
            ...currentUser.user,
            ...data.data,
            isLoggedIn: true,
            wallet_address: currentUser.user.wallet_address,
          };
        }

        dispatch(updateUserProfile(updatedUser));

        // Invalidate RSVP queries since email validation affects RSVP
        queryClient.invalidateQueries({ queryKey: ['user-rsvps'] });
        queryClient.invalidateQueries({ queryKey: ['rsvp'] });
      }
    },
  });

  // Mutation for updating name specifically
  const updateNameMutation = useMutation({
    mutationFn: (name: string) => ProfileService.updateName(name),

    onError: (error) => {
      ErrorHandler.handle(error, 'Name update');
    },

    onSuccess: (data) => {
      if (data.status === 'success' && data.data) {
        ErrorHandler.showSuccess('Name updated successfully!');

        // Preserve session while updating name
        let updatedUser;

        if (data.data.user && data.data.token) {
          updatedUser = {
            ...currentUser.user,
            ...data.data.user,
            _id: currentUser.user._id || data.data.user._id || data.data.user.id,
            isLoggedIn: true,
            wallet_address: currentUser.user.wallet_address,
          };
          localStorage.setItem('si3-jwt', data.data.token);
        } else if (data.data.token) {
          const { token, ...userData } = data.data;
          updatedUser = {
            ...currentUser.user,
            ...userData,
            _id: currentUser.user._id,
            isLoggedIn: true,
            wallet_address: currentUser.user.wallet_address,
          };
          localStorage.setItem('si3-jwt', token);
        } else {
          updatedUser = {
            ...currentUser.user,
            ...data.data,
            isLoggedIn: true,
            wallet_address: currentUser.user.wallet_address,
          };
        }

        dispatch(updateUserProfile(updatedUser));

        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['user-rsvps'] });
      }
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
