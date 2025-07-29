"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RSVPCard } from '@/components/molecules/rsvp/RSVPCard';
import { SessionWithRSVP } from '@/types/rsvp';
import { Loader2, Calendar, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface UpcomingSessionsListProps {
  className?: string;
}

// Mock function - replace with actual API call
const fetchUpcomingSessions = async (): Promise<SessionWithRSVP[]> => {
  // This would be replaced with actual API call
  const response = await fetch('/api/sessions/upcoming');
  if (!response.ok) {
    throw new Error('Failed to fetch sessions');
  }
  return response.json();
};

export function UpcomingSessionsList({ className = '' }: UpcomingSessionsListProps) {
  const {
    data: sessions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['sessions', 'upcoming'],
    queryFn: fetchUpcomingSessions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading upcoming sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('py-6', className)}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load upcoming sessions. 
            <button 
              onClick={() => refetch()} 
              className="ml-2 underline hover:no-underline"
            >
              Try again
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Upcoming Sessions
        </h3>
        <p className="text-gray-600">
          There are no upcoming sessions scheduled at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Upcoming Sessions
        </h2>
        <span className="text-sm text-gray-500">
          {sessions.length} session{sessions.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <RSVPCard
            key={session.id}
            session={session}
            showDetails={true}
          />
        ))}
      </div>
    </div>
  );
}
