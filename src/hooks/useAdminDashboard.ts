"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AdminDashboardStats, CronJobStatus, ReminderRequest, BulkAction } from '@/types/admin';

/**
 * Hook for admin dashboard data and operations
 */
export function useAdminDashboard() {
  const queryClient = useQueryClient();

  // Fetch dashboard stats
  const {
    data: dashboardData,
    isLoading: isLoadingStats,
    error: statsError,
  } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });

  // Fetch RSVPs with filters
  const fetchRSVPs = async (params: {
    sessionId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params.sessionId) searchParams.set('sessionId', params.sessionId);
    if (params.status) searchParams.set('status', params.status);
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());

    const response = await fetch(`/api/admin/rsvps?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch RSVPs');
    return response.json();
  };

  // Send reminder mutation
  const sendReminderMutation = useMutation({
    mutationFn: async (reminderData: ReminderRequest) => {
      const response = await fetch('/api/admin/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminderData),
      });
      if (!response.ok) throw new Error('Failed to send reminder');
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(`Reminders sent to ${data.data.remindersSent} users`);
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
    onError: (error) => {
      toast.error('Failed to send reminders');
      console.error('Send reminder error:', error);
    },
  });

  // Bulk action mutation
  const bulkActionMutation = useMutation({
    mutationFn: async (bulkData: BulkAction) => {
      const response = await fetch('/api/admin/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkData),
      });
      if (!response.ok) throw new Error('Failed to perform bulk action');
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.data.message);
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
    onError: (error) => {
      toast.error('Failed to perform bulk action');
      console.error('Bulk action error:', error);
    },
  });

  return {
    // Data
    stats: dashboardData?.data?.stats as AdminDashboardStats | undefined,
    cronJobs: dashboardData?.data?.cronJobs as CronJobStatus[] | undefined,
    
    // Loading states
    isLoadingStats,
    isSendingReminder: sendReminderMutation.isPending,
    isPerformingBulkAction: bulkActionMutation.isPending,
    
    // Error states
    statsError,
    
    // Actions
    fetchRSVPs,
    sendReminder: sendReminderMutation.mutate,
    performBulkAction: bulkActionMutation.mutate,
    
    // Utilities
    refreshStats: () => queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] }),
  };
}
