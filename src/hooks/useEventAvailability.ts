"use client";

import { useQuery } from '@tanstack/react-query';
import { RSVPService } from '@/services/rsvpService';
import { ErrorHandler } from '@/utils/errorHandler';

/**
 * Hook for checking event availability
 */
export function useEventAvailability(eventId: string) {
  const queryKey = ['event-availability', eventId];

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => RSVPService.checkEventAvailability(eventId),
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
    enabled: !!eventId,
    onError: (error) => {
      ErrorHandler.handle(error, 'Checking event availability');
    },
  });

  const availability = data?.data;

  return {
    // Data
    isAvailable: availability?.available || false,
    isWaitlistEnabled: availability?.waitlistEnabled || false,
    
    // Loading states
    isLoading,
    
    // Error states
    error,
    
    // Actions
    refetch,
    
    // Helper functions
    canRSVP: availability?.available || false,
    shouldShowWaitlist: !availability?.available && availability?.waitlistEnabled,
  };
}
