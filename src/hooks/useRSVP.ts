"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RSVPStatus, CreateRSVPRequest, UpdateRSVPRequest } from '@/types/rsvp';
import { RSVPService } from '@/services/rsvpService';
import { ErrorHandler } from '@/utils/errorHandler';
import { useAppSelector } from '@/redux/store';

/**
 * Hook for managing RSVP operations with optimistic updates
 * Enhanced to work with the new guides session structure
 */
export function useRSVP(eventId: string, sessionConfig?: { rsvpSettings?: any }) {
  const queryClient = useQueryClient();
  const queryKey = ['rsvp', 'event', eventId];

  // Get user data from Redux store
  const currentUser = useAppSelector(state => state.user);

  // Query to get current RSVP status for the event
  const {
    data: rsvpData,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => RSVPService.getUserRSVPForEvent(eventId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Reduce retries since some routes might not exist
    enabled: !!eventId,
    // Don't throw on error, handle gracefully
    throwOnError: false,
  });

  // Mutation for creating RSVP
  const createRSVPMutation = useMutation({
    mutationFn: (data: CreateRSVPRequest) => RSVPService.createRSVP(data),

    onError: (error: any) => {
      // Check if it's an email verification error
      const errorMessage = error?.message || error?.error?.message || '';
      if (errorMessage.includes('not verified') || errorMessage.includes('verify your email')) {
        ErrorHandler.showWarning('Please verify your email address in your profile before RSVPing to events.');
      } else {
        ErrorHandler.handle(error, 'RSVP creation');
      }
    },

    onSuccess: (data) => {
      if (data.status === 'success') {
        ErrorHandler.showSuccess('RSVP created successfully!');

        // Invalidate related queries to ensure fresh data
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: ['event-stats', eventId] });
      }
    },
  });

  // Mutation for updating RSVP
  const updateRSVPMutation = useMutation({
    mutationFn: ({ rsvpId, data }: { rsvpId: string; data: UpdateRSVPRequest }) =>
      RSVPService.updateRSVP(rsvpId, data),

    onError: (error: any) => {
      const errorMessage = error?.message || error?.error?.message || '';
      if (errorMessage.includes('not verified') || errorMessage.includes('verify your email')) {
        ErrorHandler.showWarning('Please verify your email address in your profile before updating RSVP.');
      } else {
        ErrorHandler.handle(error, 'RSVP update');
      }
    },

    onSuccess: (data) => {
      if (data.status === 'success') {
        ErrorHandler.showSuccess('RSVP updated successfully!');
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: ['event-stats', eventId] });
      }
    },
  });

  // Mutation for deleting RSVP
  const deleteRSVPMutation = useMutation({
    mutationFn: (rsvpId: string) => RSVPService.deleteRSVP(rsvpId),

    onError: (error: any) => {
      const errorMessage = error?.message || error?.error?.message || '';
      if (errorMessage.includes('not verified') || errorMessage.includes('verify your email')) {
        ErrorHandler.showWarning('Please verify your email address in your profile before canceling RSVP.');
      } else {
        ErrorHandler.handle(error, 'RSVP deletion');
      }
    },

    onSuccess: () => {
      ErrorHandler.showSuccess('RSVP cancelled successfully!');
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['event-stats', eventId] });
    },
  });

  const currentRSVP = rsvpData?.data;
  const rsvpSettings = sessionConfig?.rsvpSettings;

  // Helper functions for session configuration
  const isRSVPEnabled = rsvpSettings?.enabled !== false; // Default to true if not specified
  const hasCapacityLimit = !!rsvpSettings?.maxCapacity;
  const isWaitlistEnabled = rsvpSettings?.waitlistEnabled || false;
  const allowsGuests = rsvpSettings?.allowGuests || false;
  const maxGuests = rsvpSettings?.maxGuestsPerRSVP || 1;
  const requiresApproval = rsvpSettings?.requiresApproval || false;
  const collectsContactInfo = rsvpSettings?.collectContactInfo !== false; // Default to true

  // Check if RSVP deadline has passed
  const isRSVPDeadlinePassed = () => {
    if (!rsvpSettings?.rsvpDeadline) return false;
    return new Date() > new Date(rsvpSettings.rsvpDeadline);
  };

  // Check if user has a temporary email
  const isTemporaryEmail = (email: string) => {
    return email.endsWith('.temp') || email.includes('wallet') || email.includes('@wallet.temp');
  };

  // Check if user can RSVP (has valid email)
  const canUserRSVP = () => {
    const user = currentUser?.user;
    if (!user?.email) return false;
    return !isTemporaryEmail(user.email);
  };

  return {
    // Data
    rsvp: currentRSVP,
    rsvpStatus: currentRSVP?.status || null,
    hasRSVP: !!currentRSVP,

    // Loading states
    isLoading,
    isCreating: createRSVPMutation.isPending,
    isUpdating: updateRSVPMutation.isPending,
    isDeleting: deleteRSVPMutation.isPending,

    // Error states
    error,

    // Actions
    createRSVP: (data: CreateRSVPRequest) => {
      if (!canUserRSVP()) {
        ErrorHandler.showWarning('Please update your email address in your profile before RSVPing');
        if (typeof window !== 'undefined') {
          window.location.href = '/profile';
        }
        return;
      }
      createRSVPMutation.mutate(data);
    },
    updateRSVP: (data: UpdateRSVPRequest) => {
      if (!canUserRSVP()) {
        ErrorHandler.showWarning('Please update your email address in your profile before updating RSVP');
        if (typeof window !== 'undefined') {
          window.location.href = '/profile';
        }
        return;
      }
      if (currentRSVP) {
        updateRSVPMutation.mutate({ rsvpId: currentRSVP._id, data });
      }
    },
    deleteRSVP: () => {
      if (currentRSVP && currentRSVP._id && currentRSVP._id !== 'temp-id') {
        deleteRSVPMutation.mutate(currentRSVP._id);
      } else {
        ErrorHandler.showWarning('No RSVP to cancel');
      }
    },

    // Quick status update helper
    updateStatus: (status: RSVPStatus) => {
      if (!isRSVPEnabled) {
        ErrorHandler.showWarning('RSVP is not enabled for this session');
        return;
      }

      if (isRSVPDeadlinePassed()) {
        ErrorHandler.showWarning('RSVP deadline has passed');
        return;
      }

      if (!canUserRSVP()) {
        ErrorHandler.showWarning('Please update your email address in your profile before RSVPing');
        // Optionally redirect to profile page
        if (typeof window !== 'undefined') {
          window.location.href = '/profile';
        }
        return;
      }

      if (currentRSVP && currentRSVP._id && currentRSVP._id !== 'temp-id') {
        // Only update if we have a real RSVP ID
        updateRSVPMutation.mutate({ rsvpId: currentRSVP._id, data: { status } });
      } else {
        // Create new RSVP
        createRSVPMutation.mutate({ eventId, status, guestCount: 1 });
      }
    },

    // Configuration helpers
    config: {
      isRSVPEnabled,
      hasCapacityLimit,
      isWaitlistEnabled,
      allowsGuests,
      maxGuests,
      requiresApproval,
      collectsContactInfo,
      isDeadlinePassed: isRSVPDeadlinePassed(),
      maxCapacity: rsvpSettings?.maxCapacity,
      rsvpDeadline: rsvpSettings?.rsvpDeadline,
      canUserRSVP: canUserRSVP(),
      hasValidEmail: canUserRSVP(),
    },
  };
}
