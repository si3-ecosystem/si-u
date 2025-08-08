"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RSVPService } from '@/services/rsvpService';
import { JoinWaitlistRequest } from '@/types/rsvp';
import { ErrorHandler } from '@/utils/errorHandler';

/**
 * Hook for managing waitlist operations
 */
export function useWaitlist(eventId: string) {
  const queryClient = useQueryClient();
  const positionQueryKey = ['waitlist-position', eventId];

  // Query to get waitlist position
  const {
    data: positionData,
    isLoading: isLoadingPosition,
    error: positionError,
  } = useQuery({
    queryKey: positionQueryKey,
    queryFn: () => RSVPService.getWaitlistPosition(eventId),
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
    enabled: !!eventId,
    onError: (error) => {
      ErrorHandler.handle(error, 'Fetching waitlist position');
    },
  });

  // Mutation for joining waitlist
  const joinWaitlistMutation = useMutation({
    mutationFn: (data: JoinWaitlistRequest) => RSVPService.joinWaitlist(data),
    
    onError: (error) => {
      ErrorHandler.handle(error, 'Joining waitlist');
    },
    
    onSuccess: (data) => {
      if (data.status === 'success') {
        ErrorHandler.showSuccess('Successfully joined the waitlist!');
        
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: positionQueryKey });
        queryClient.invalidateQueries({ queryKey: ['rsvp', 'event', eventId] });
        queryClient.invalidateQueries({ queryKey: ['event-stats', eventId] });
      }
    },
  });

  const position = positionData?.data;

  return {
    // Data
    position: position?.position,
    totalWaitlisted: position?.totalWaitlisted,
    isOnWaitlist: !!position,
    
    // Loading states
    isLoadingPosition,
    isJoining: joinWaitlistMutation.isPending,
    
    // Error states
    positionError,
    
    // Actions
    joinWaitlist: (data: JoinWaitlistRequest) => joinWaitlistMutation.mutate(data),
    
    // Helper functions
    getPositionMessage: () => {
      if (!position) return null;
      return `You are #${position.position} on the waitlist (${position.totalWaitlisted} total)`;
    },
  };
}
