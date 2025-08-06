"use client";

import { useQuery } from '@tanstack/react-query';
import { RSVPService } from '@/services/rsvpService';
import { GetUserRSVPsParams, RSVPStatus } from '@/types/rsvp';
import { ErrorHandler } from '@/utils/errorHandler';

/**
 * Hook for fetching and managing user's RSVPs
 */
export function useUserRSVPs(params?: GetUserRSVPsParams) {
  const queryKey = ['user-rsvps', params];

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => RSVPService.getUserRSVPs(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    onError: (error) => {
      ErrorHandler.handle(error, 'Fetching user RSVPs');
    },
  });

  const rsvps = data?.data || [];
  const pagination = data?.pagination;

  // Helper functions for filtering
  const filterByStatus = (status?: RSVPStatus) => {
    const newParams = { ...params, status, page: 1 };
    return refetch();
  };

  const loadMore = () => {
    if (pagination?.hasNextPage) {
      const newParams = { ...params, page: (pagination.page || 1) + 1 };
      return refetch();
    }
  };

  // Group RSVPs by status
  const groupedRSVPs = {
    attending: rsvps.filter(rsvp => rsvp.status === RSVPStatus.ATTENDING),
    maybe: rsvps.filter(rsvp => rsvp.status === RSVPStatus.MAYBE),
    not_attending: rsvps.filter(rsvp => rsvp.status === RSVPStatus.NOT_ATTENDING),
    waitlisted: rsvps.filter(rsvp => rsvp.status === RSVPStatus.WAITLISTED),
  };

  // Statistics
  const stats = {
    total: rsvps.length,
    attending: groupedRSVPs.attending.length,
    maybe: groupedRSVPs.maybe.length,
    not_attending: groupedRSVPs.not_attending.length,
    waitlisted: groupedRSVPs.waitlisted.length,
  };

  return {
    // Data
    rsvps,
    groupedRSVPs,
    stats,
    pagination,
    
    // Loading states
    isLoading,
    
    // Error states
    error,
    
    // Actions
    refetch,
    filterByStatus,
    loadMore,
  };
}
