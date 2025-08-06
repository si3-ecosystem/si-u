"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserRSVPs } from '@/hooks/useUserRSVPs';
import { RSVPErrorBoundary } from '@/components/molecules/errors/RSVPErrorBoundary';
import { RSVPLoadingState, RSVPListSkeleton } from '@/components/atoms/loading/RSVPLoadingState';
import { RSVPErrorDisplay } from '@/components/atoms/errors/RSVPErrorDisplay';
import { CalendarIntegrationCard } from '@/components/molecules/calendar/CalendarIntegrationCard';
import { RSVPStatus } from '@/types/rsvp';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Download } from 'lucide-react';
import moment from 'moment';

export default function MyRSVPsPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const { rsvps, groupedRSVPs, stats, isLoading, error, refetch } = useUserRSVPs();

  const getStatusColor = (status: RSVPStatus) => {
    switch (status) {
      case RSVPStatus.ATTENDING:
        return 'bg-green-100 text-green-800 border-green-200';
      case RSVPStatus.MAYBE:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case RSVPStatus.NOT_ATTENDING:
        return 'bg-red-100 text-red-800 border-red-200';
      case RSVPStatus.WAITLISTED:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: RSVPStatus) => {
    switch (status) {
      case RSVPStatus.ATTENDING:
        return 'Attending';
      case RSVPStatus.MAYBE:
        return 'Maybe';
      case RSVPStatus.NOT_ATTENDING:
        return 'Not Attending';
      case RSVPStatus.WAITLISTED:
        return 'Waitlisted';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return moment(dateString).format('MMM DD, YYYY');
  };

  const formatTime = (dateString: string) => {
    return moment(dateString).format('h:mm A');
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <RSVPErrorDisplay
          error={error}
          onRetry={refetch}
          title="Failed to Load RSVPs"
        />
      </div>
    );
  }

  return (
    <RSVPErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My RSVPs</h1>
          <p className="text-gray-600">Manage your event registrations and calendar</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total RSVPs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.attending}</div>
              <div className="text-sm text-gray-500">Attending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.maybe}</div>
              <div className="text-sm text-gray-500">Maybe</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.waitlisted}</div>
              <div className="text-sm text-gray-500">Waitlisted</div>
            </CardContent>
          </Card>
        </div>

        {/* RSVP Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="attending">Attending ({stats.attending})</TabsTrigger>
            <TabsTrigger value="maybe">Maybe ({stats.maybe})</TabsTrigger>
            <TabsTrigger value="not_attending">Not Attending ({stats.not_attending})</TabsTrigger>
            <TabsTrigger value="waitlisted">Waitlisted ({stats.waitlisted})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <RSVPList rsvps={rsvps} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="attending" className="mt-6">
            <RSVPList rsvps={groupedRSVPs.attending} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="maybe" className="mt-6">
            <RSVPList rsvps={groupedRSVPs.maybe} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="not_attending" className="mt-6">
            <RSVPList rsvps={groupedRSVPs.not_attending} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="waitlisted" className="mt-6">
            <RSVPList rsvps={groupedRSVPs.waitlisted} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </RSVPErrorBoundary>
  );
}

// RSVP List Component
function RSVPList({ rsvps, isLoading }: { rsvps: any[]; isLoading: boolean }) {
  if (isLoading) {
    return <RSVPListSkeleton count={3} />;
  }

  if (rsvps.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No RSVPs found</h3>
          <p className="text-gray-500">You haven't RSVP'd to any sessions yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {rsvps.map((rsvp) => (
        <RSVPCard key={rsvp._id} rsvp={rsvp} />
      ))}
    </div>
  );
}

// Individual RSVP Card Component
function RSVPCard({ rsvp }: { rsvp: any }) {
  const getStatusColor = (status: RSVPStatus) => {
    switch (status) {
      case RSVPStatus.ATTENDING:
        return 'bg-green-100 text-green-800 border-green-200';
      case RSVPStatus.MAYBE:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case RSVPStatus.NOT_ATTENDING:
        return 'bg-red-100 text-red-800 border-red-200';
      case RSVPStatus.WAITLISTED:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: RSVPStatus) => {
    switch (status) {
      case RSVPStatus.ATTENDING:
        return 'Attending';
      case RSVPStatus.MAYBE:
        return 'Maybe';
      case RSVPStatus.NOT_ATTENDING:
        return 'Not Attending';
      case RSVPStatus.WAITLISTED:
        return 'Waitlisted';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Event ID: {rsvp.eventId}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{moment(rsvp.createdAt).format('MMM DD, YYYY')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{rsvp.guestCount} guest{rsvp.guestCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(rsvp.status)}>
            {getStatusText(rsvp.status)}
          </Badge>
        </div>

        {rsvp.dietaryRestrictions && (
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-700">Dietary Restrictions: </span>
            <span className="text-sm text-gray-600">{rsvp.dietaryRestrictions}</span>
          </div>
        )}

        {rsvp.specialRequests && (
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-700">Special Requests: </span>
            <span className="text-sm text-gray-600">{rsvp.specialRequests}</span>
          </div>
        )}

        {rsvp.waitlistPosition && (
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-700">Waitlist Position: </span>
            <span className="text-sm text-gray-600">#{rsvp.waitlistPosition}</span>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Calendar
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
