"use client";

import { useQuery } from '@tanstack/react-query';
import { RSVPService } from '@/services/rsvpService';
import { EventStatsResponse } from '@/types/rsvp';
import { ErrorHandler } from '@/utils/errorHandler';

/**
 * Hook for fetching event RSVP statistics
 */
export function useEventStats(eventId: string) {
  const queryKey = ['event-stats', eventId];

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => RSVPService.getEventStats(eventId),
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
    enabled: !!eventId,
    onError: (error) => {
      ErrorHandler.handle(error, 'Fetching event stats');
    },
  });

  const stats = data?.data;

  // Calculate additional metrics
  const metrics = stats ? {
    totalResponses: stats.attendingCount + stats.notAttendingCount + stats.maybeCount,
    attendanceRate: stats.totalRSVPs > 0 ? (stats.attendingCount / stats.totalRSVPs) * 100 : 0,
    responseRate: stats.totalRSVPs > 0 ? ((stats.attendingCount + stats.notAttendingCount + stats.maybeCount) / stats.totalRSVPs) * 100 : 0,
    capacityUtilization: stats.capacityInfo.maxCapacity ? (stats.totalGuests / stats.capacityInfo.maxCapacity) * 100 : 0,
  } : null;

  return {
    // Data
    stats,
    metrics,
    
    // Loading states
    isLoading,
    
    // Error states
    error,
    
    // Actions
    refetch,
    
    // Helper functions
    isAtCapacity: stats?.capacityInfo.isAtCapacity || false,
    hasWaitlist: (stats?.waitlistCount || 0) > 0,
    spotsRemaining: stats?.capacityInfo.availableSpots || 0,
  };
}
