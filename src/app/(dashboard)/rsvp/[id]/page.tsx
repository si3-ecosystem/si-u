"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RSVPService } from '@/services/rsvpService';
import { RSVPErrorBoundary } from '@/components/molecules/errors/RSVPErrorBoundary';
import { RSVPLoadingState } from '@/components/atoms/loading/RSVPLoadingState';
import { RSVPErrorDisplay } from '@/components/atoms/errors/RSVPErrorDisplay';
import { CalendarIntegrationCard } from '@/components/molecules/calendar/CalendarIntegrationCard';
import { RSVPForm } from '@/components/molecules/forms/RSVPForm';
import { RSVPStatus, IRSVP } from '@/types/rsvp';
import { GuidesSession } from '@/types/siherguides/session';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Edit, 
  Trash2, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  User
} from 'lucide-react';
import moment from 'moment';

export default function RSVPDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const rsvpId = Array.isArray(id) ? id[0] : id;

  const { data: rsvp, isLoading, error, refetch } = useQuery({
    queryKey: ['rsvp', rsvpId],
    queryFn: () => RSVPService.getRSVPById(rsvpId),
    enabled: !!rsvpId,
  });

  const rsvpData = rsvp?.data;

  const getStatusIcon = (status: RSVPStatus) => {
    switch (status) {
      case RSVPStatus.ATTENDING:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case RSVPStatus.MAYBE:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case RSVPStatus.NOT_ATTENDING:
        return <XCircle className="w-5 h-5 text-red-600" />;
      case RSVPStatus.WAITLISTED:
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to cancel this RSVP?')) {
      try {
        await RSVPService.deleteRSVP(rsvpId);
        router.push('/rsvp/my-rsvps');
      } catch (error) {
        console.error('Failed to delete RSVP:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <RSVPLoadingState message="Loading RSVP details..." />
      </div>
    );
  }

  if (error || !rsvpData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <RSVPErrorDisplay
          error={error || 'RSVP not found'}
          onRetry={refetch}
          title="Failed to Load RSVP"
        />
      </div>
    );
  }

  return (
    <RSVPErrorBoundary>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">RSVP Details</h1>
              <p className="text-gray-600">Event ID: {rsvpData.eventId}</p>
            </div>
            <Badge className={getStatusColor(rsvpData.status)}>
              {getStatusIcon(rsvpData.status)}
              <span className="ml-2">{getStatusText(rsvpData.status)}</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* RSVP Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  RSVP Information
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Edit form would go here</p>
                    <p className="text-sm text-gray-400 mt-2">
                      This would integrate with the RSVPForm component
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusIcon(rsvpData.status)}
                          <span>{getStatusText(rsvpData.status)}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Guest Count</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{rsvpData.guestCount} guest{rsvpData.guestCount !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Created</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{moment(rsvpData.createdAt).format('MMM DD, YYYY h:mm A')}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Last Updated</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{moment(rsvpData.updatedAt).format('MMM DD, YYYY h:mm A')}</span>
                        </div>
                      </div>
                    </div>

                    {rsvpData.waitlistPosition && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Waitlist Position</label>
                        <div className="mt-1">
                          <Badge variant="outline" className="bg-blue-50">
                            #{rsvpData.waitlistPosition}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {rsvpData.dietaryRestrictions && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Dietary Restrictions</label>
                        <p className="mt-1 text-gray-600">{rsvpData.dietaryRestrictions}</p>
                      </div>
                    )}

                    {rsvpData.specialRequests && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Special Requests</label>
                        <p className="mt-1 text-gray-600">{rsvpData.specialRequests}</p>
                      </div>
                    )}

                    {rsvpData.contactInfo && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Contact Information</label>
                        <div className="mt-1 space-y-1">
                          {rsvpData.contactInfo.phone && (
                            <p className="text-gray-600">Phone: {rsvpData.contactInfo.phone}</p>
                          )}
                          {rsvpData.contactInfo.emergencyContact && (
                            <p className="text-gray-600">Emergency Contact: {rsvpData.contactInfo.emergencyContact}</p>
                          )}
                          {rsvpData.contactInfo.emergencyPhone && (
                            <p className="text-gray-600">Emergency Phone: {rsvpData.contactInfo.emergencyPhone}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Admin Information */}
            {(rsvpData.adminNotes || rsvpData.approvalStatus !== 'approved') && (
              <Card>
                <CardHeader>
                  <CardTitle>Admin Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Approval Status</label>
                      <div className="mt-1">
                        <Badge 
                          variant={rsvpData.approvalStatus === 'approved' ? 'default' : 'secondary'}
                          className={
                            rsvpData.approvalStatus === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : rsvpData.approvalStatus === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {rsvpData.approvalStatus.charAt(0).toUpperCase() + rsvpData.approvalStatus.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    {rsvpData.adminNotes && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Admin Notes</label>
                        <p className="mt-1 text-gray-600">{rsvpData.adminNotes}</p>
                      </div>
                    )}

                    {rsvpData.approvedBy && rsvpData.approvedAt && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Approved By</label>
                        <p className="mt-1 text-gray-600">
                          {rsvpData.approvedBy} on {moment(rsvpData.approvedAt).format('MMM DD, YYYY h:mm A')}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calendar Integration - Only show if attending */}
            {rsvpData.status === RSVPStatus.ATTENDING && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Calendar integration would go here</p>
                <p className="text-sm text-gray-400 mt-2">
                  This would use the CalendarIntegrationCard component
                </p>
              </div>
            )}

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit RSVP
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Cancel RSVP
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RSVPErrorBoundary>
  );
}
