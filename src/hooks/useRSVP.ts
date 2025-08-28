"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RSVPStatus, CreateRSVPRequest, UpdateRSVPRequest } from '@/types/rsvp';
import { RSVPService } from '@/services/rsvpService';
import { ErrorHandler } from '@/utils/errorHandler';
import { useAppSelector } from '@/redux/store';
import { GuidesSession } from '@/types/siherguides/session';

/**
 * Hook for managing RSVP operations with optimistic updates
 * Enhanced to work with the new guides session structure
 */
export function useRSVP(eventId: string, sessionConfig?: GuidesSession) {
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
        ErrorHandler.showWarning('⚠️ Please verify your email address in your profile before RSVPing to events.');
      } else if (errorMessage.includes('full') || errorMessage.includes('capacity')) {
        ErrorHandler.showWarning('🚫 Sorry, this session is at full capacity. Try joining the waitlist!');
      } else if (errorMessage.includes('deadline')) {
        ErrorHandler.showWarning('⏰ RSVP deadline has passed for this session.');
      } else if (errorMessage.includes('duplicate')) {
        ErrorHandler.showInfo('📝 You\'ve already RSVPed for this session.');
      } else {
        ErrorHandler.handle(error, 'RSVP creation');
      }
    },

    onSuccess: (data) => {
      if (data.status === 'success') {
        const rsvp = data.data;
        let message = 'RSVP created successfully!';
        
        // More specific success messages
        if (rsvp?.status === RSVPStatus.ATTENDING) {
          message = '🎉 You\'re attending! RSVP confirmed successfully.';
        } else if (rsvp?.status === RSVPStatus.MAYBE) {
          message = '🤔 Marked as "Maybe" - you can update this anytime.';
        } else if (rsvp?.status === RSVPStatus.NOT_ATTENDING) {
          message = '👋 Thanks for letting us know you can\'t attend.';
        } else if (rsvp?.status === RSVPStatus.WAITLISTED) {
          message = '⏳ You\'ve been added to the waitlist.';
        }
        
        ErrorHandler.showSuccess(message);

        // Invalidate related queries to ensure fresh data
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: ['event-stats', eventId] });
        // Also invalidate session lists to update the UI
        queryClient.invalidateQueries({ queryKey: ['fixSessions'] });
        queryClient.invalidateQueries({ queryKey: ['siher-guides-session'] });
        queryClient.invalidateQueries({ queryKey: ['user-rsvps'] });
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
        ErrorHandler.showWarning('⚠️ Please verify your email address in your profile before updating RSVP.');
      } else if (errorMessage.includes('not found')) {
        ErrorHandler.showWarning('🔍 RSVP not found. Please try creating a new RSVP.');
      } else if (errorMessage.includes('deadline')) {
        ErrorHandler.showWarning('⏰ Cannot update RSVP - deadline has passed.');
      } else {
        ErrorHandler.handle(error, 'RSVP update');
      }
    },

    onSuccess: (data) => {
      if (data.status === 'success') {
        const rsvp = data.data;
        let message = 'RSVP updated successfully!';
        
        // More specific success messages
        if (rsvp?.status === RSVPStatus.ATTENDING) {
          message = '✅ Updated to "Attending" - see you there!';
        } else if (rsvp?.status === RSVPStatus.MAYBE) {
          message = '🤔 Updated to "Maybe" - you can change this anytime.';
        } else if (rsvp?.status === RSVPStatus.NOT_ATTENDING) {
          message = '❌ Updated to "Not Attending" - thanks for the update.';
        } else if (rsvp?.status === RSVPStatus.WAITLISTED) {
          message = '⏳ You\'re now on the waitlist.';
        }
        
        ErrorHandler.showSuccess(message);
        
        // Invalidate related queries to ensure fresh data
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: ['event-stats', eventId] });
        // Also invalidate session lists to update the UI
        queryClient.invalidateQueries({ queryKey: ['fixSessions'] });
        queryClient.invalidateQueries({ queryKey: ['siher-guides-session'] });
        queryClient.invalidateQueries({ queryKey: ['user-rsvps'] });
      }
    },
  });

  // Mutation for deleting RSVP
  const deleteRSVPMutation = useMutation({
    mutationFn: (rsvpId: string) => RSVPService.deleteRSVP(rsvpId),

    onError: (error: any) => {
      const errorMessage = error?.message || error?.error?.message || '';
      if (errorMessage.includes('not verified') || errorMessage.includes('verify your email')) {
        ErrorHandler.showWarning('⚠️ Please verify your email address in your profile before canceling RSVP.');
      } else if (errorMessage.includes('not found')) {
        ErrorHandler.showInfo('🤷‍♂️ No RSVP found to cancel.');
      } else {
        ErrorHandler.handle(error, 'RSVP cancellation');
      }
    },

    onSuccess: () => {
      ErrorHandler.showSuccess('🚫 RSVP cancelled successfully - you can always RSVP again later!');
      
      // Invalidate related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['event-stats', eventId] });
      // Also invalidate session lists to update the UI
      queryClient.invalidateQueries({ queryKey: ['fixSessions'] });
      queryClient.invalidateQueries({ queryKey: ['siher-guides-session'] });
      queryClient.invalidateQueries({ queryKey: ['user-rsvps'] });
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
    // Use rsvpDeadline if provided, otherwise use session end date or start date
    const deadline = rsvpSettings?.rsvpDeadline || sessionConfig?.endDate || sessionConfig?.date;
    if (!deadline) return false;
    return new Date() > new Date(deadline);
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
        ErrorHandler.showWarning('📧 Please update your email address in your profile before RSVPing');
        if (typeof window !== 'undefined') {
          window.location.href = '/profile';
        }
        return;
      }
      createRSVPMutation.mutate(data);
    },
    updateRSVP: (data: UpdateRSVPRequest) => {
      if (!canUserRSVP()) {
        ErrorHandler.showWarning('📧 Please update your email address in your profile before updating RSVP');
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
        ErrorHandler.showWarning('🤷‍♂️ No RSVP to cancel');
      }
    },

    // Quick status update helper
    updateStatus: (status: RSVPStatus) => {
      if (!isRSVPEnabled) {
        ErrorHandler.showWarning('⚠️ RSVP is not enabled for this session');
        return;
      }

      if (isRSVPDeadlinePassed()) {
        ErrorHandler.showWarning('⏰ RSVP deadline has passed for this session');
        return;
      }

      if (!canUserRSVP()) {
        ErrorHandler.showWarning('📧 Please update your email address in your profile before RSVPing');
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
