"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RSVPStatus, RSVPMutationData, SessionWithRSVP } from '@/types/rsvp';
import { updateRSVP, getRSVPStatus } from '@/lib/server-actions/rsvp';

/**
 * Hook for managing RSVP operations with optimistic updates
 */
export function useRSVP(sessionId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['rsvp', sessionId];

  // Query to get current RSVP status
  const {
    data: rsvpData,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => getRSVPStatus(sessionId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Mutation for updating RSVP status
  const rsvpMutation = useMutation({
    mutationFn: ({ sessionId, status }: RSVPMutationData) => updateRSVP(sessionId, status),
    
    onMutate: async ({ status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });
      
      // Snapshot the previous value
      const previousRSVP = queryClient.getQueryData(queryKey);
      
      // Optimistically update the RSVP status
      queryClient.setQueryData(queryKey, {
        success: true,
        data: {
          sessionId,
          userId: 'current-user-id',
          status,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });

      // Also update session data if it exists in cache
      const sessionsQueryKey = ['sessions', 'upcoming'];
      const previousSessions = queryClient.getQueryData<SessionWithRSVP[]>(sessionsQueryKey);
      
      if (previousSessions) {
        const updatedSessions = previousSessions.map(session => {
          if (session.id === sessionId) {
            return {
              ...session,
              userRSVP: {
                sessionId,
                userId: 'current-user-id',
                status,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            };
          }
          return session;
        });
        
        queryClient.setQueryData(sessionsQueryKey, updatedSessions);
      }
      
      return { previousRSVP, previousSessions };
    },
    
    onError: (error, variables, context) => {
      // Rollback optimistic updates
      if (context?.previousRSVP) {
        queryClient.setQueryData(queryKey, context.previousRSVP);
      }
      if (context?.previousSessions) {
        queryClient.setQueryData(['sessions', 'upcoming'], context.previousSessions);
      }
      
      toast.error('Failed to update RSVP. Please try again.');
      console.error('RSVP mutation error:', error);
    },
    
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || 'RSVP updated successfully!');
        
        // Invalidate related queries to ensure fresh data
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: ['sessions', 'upcoming'] });
      } else {
        toast.error(data.error || 'Failed to update RSVP');
      }
    },
  });

  return {
    // Data
    rsvpStatus: rsvpData?.data?.status || null,
    rsvpData: rsvpData?.data,
    
    // Loading states
    isLoading,
    isUpdating: rsvpMutation.isPending,
    
    // Error states
    error,
    
    // Actions
    updateRSVP: (status: RSVPStatus) => rsvpMutation.mutate({ sessionId, status }),
  };
}
