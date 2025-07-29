"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RSVPButton } from '@/components/atoms/rsvp/RSVPButton';
import { RSVPStatusBadge } from '@/components/atoms/rsvp/RSVPStatusBadge';
import { useRSVP } from '@/hooks/useRSVP';
import { SessionWithRSVP } from '@/types/rsvp';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RSVPCardProps {
  session: SessionWithRSVP;
  showDetails?: boolean;
  className?: string;
}

export function RSVPCard({
  session,
  showDetails = true,
  className = '',
}: RSVPCardProps) {
  const { rsvpStatus, isLoading, isUpdating, updateRSVP } = useRSVP(session.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {session.title}
          </CardTitle>
          <RSVPButton
            status={rsvpStatus}
            onStatusChange={updateRSVP}
            isLoading={isLoading || isUpdating}
            size="sm"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Session Details */}
        {showDetails && (
          <div className="space-y-2 text-sm text-gray-600">
            {/* Date and Time */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{formatDate(session.startTime)}</span>
              <Clock className="h-4 w-4 text-gray-400 ml-2" />
              <span>
                {formatTime(session.startTime)} - {formatTime(session.endTime)}
              </span>
            </div>

            {/* Location */}
            {session.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{session.location}</span>
              </div>
            )}

            {/* Attendee Count */}
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span>
                {session.currentAttendees}
                {session.maxAttendees && ` / ${session.maxAttendees}`} attendees
              </span>
            </div>

            {/* Description */}
            {session.description && (
              <p className="text-gray-700 text-sm mt-3 line-clamp-2">
                {session.description}
              </p>
            )}
          </div>
        )}

        {/* RSVP Status Summary */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          <RSVPStatusBadge
            status="attending"
            count={session.rsvpCounts.attending}
            size="sm"
          />
          <RSVPStatusBadge
            status="maybe"
            count={session.rsvpCounts.maybe}
            size="sm"
          />
          <RSVPStatusBadge
            status="not_attending"
            count={session.rsvpCounts.not_attending}
            size="sm"
          />
        </div>
      </CardContent>
    </Card>
  );
}
