"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RSVPStatus, CreateRSVPRequest } from '@/types/rsvp';
import { GuidesSession } from '@/types/siherguides/session';
import { useRSVP } from '@/hooks/useRSVP';
import { ErrorHandler } from '@/utils/errorHandler';
import { Check, Clock, UserMinus, Users } from 'lucide-react';

// Validation schema
const createRSVPSchema = z.object({
  status: z.nativeEnum(RSVPStatus),
  guestCount: z.number().min(1, 'At least 1 guest required').max(20, 'Maximum 20 guests allowed'),
  dietaryRestrictions: z.string().max(500, 'Maximum 500 characters').optional(),
  specialRequests: z.string().max(500, 'Maximum 500 characters').optional(),
  contactInfo: z.object({
    phone: z.string().optional(),
    emergencyContact: z.string().optional(),
    emergencyPhone: z.string().optional(),
  }).optional(),
});

type RSVPFormData = z.infer<typeof createRSVPSchema>;

interface RSVPFormProps {
  session: GuidesSession;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function RSVPForm({
  session,
  onSuccess,
  onCancel,
  className = ''
}: RSVPFormProps) {
  const { createRSVP, isCreating, config } = useRSVP(session._id, session);
  const [selectedStatus, setSelectedStatus] = useState<RSVPStatus>(RSVPStatus.ATTENDING);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RSVPFormData>({
    resolver: zodResolver(createRSVPSchema),
    defaultValues: {
      status: RSVPStatus.ATTENDING,
      guestCount: 1,
    }
  });

  const watchedStatus = watch('status');
  const watchedGuestCount = watch('guestCount');

  const onSubmit = async (data: RSVPFormData) => {
    if (!config.isRSVPEnabled) {
      ErrorHandler.showWarning('RSVP is not enabled for this session');
      return;
    }

    if (config.isDeadlinePassed) {
      ErrorHandler.showWarning('RSVP deadline has passed');
      return;
    }

    const rsvpData: CreateRSVPRequest = {
      eventId: session._id,
      status: data.status,
      guestCount: data.guestCount,
      specialRequests: data.specialRequests,
      contactInfo: config.collectsContactInfo ? data.contactInfo : undefined,
    };

    createRSVP(rsvpData);
    onSuccess?.();
  };

  const getStatusIcon = (status: RSVPStatus) => {
    switch (status) {
      case RSVPStatus.ATTENDING:
        return <Check className="w-5 h-5" />;
      case RSVPStatus.MAYBE:
        return <Clock className="w-5 h-5" />;
      case RSVPStatus.NOT_ATTENDING:
        return <UserMinus className="w-5 h-5" />;
      default:
        return <Check className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: RSVPStatus) => {
    switch (status) {
      case RSVPStatus.ATTENDING:
        return "I'll attend";
      case RSVPStatus.MAYBE:
        return "Maybe";
      case RSVPStatus.NOT_ATTENDING:
        return "Can't attend";
      default:
        return "I'll attend";
    }
  };

  if (!config.isRSVPEnabled) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">RSVP is not enabled for this session.</p>
        </CardContent>
      </Card>
    );
  }

  if (config.isDeadlinePassed) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">RSVP deadline has passed.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>RSVP for {session.title}</CardTitle>
        {config.requiresApproval && (
          <p className="text-sm text-amber-600">
            Note: Your RSVP will require admin approval before confirmation.
          </p>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* RSVP Status */}
          <div>
            <Label className="text-base font-medium">Will you attend this session?</Label>
            <RadioGroup
              value={watchedStatus}
              onValueChange={(value) => {
                setValue('status', value as RSVPStatus);
                setSelectedStatus(value as RSVPStatus);
              }}
              className="mt-3"
            >
              {[RSVPStatus.ATTENDING, RSVPStatus.MAYBE, RSVPStatus.NOT_ATTENDING].map((status) => (
                <div key={status} className="flex items-center space-x-3">
                  <RadioGroupItem value={status} id={status} />
                  <Label htmlFor={status} className="flex items-center gap-2 cursor-pointer">
                    {getStatusIcon(status)}
                    {getStatusText(status)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>

          {/* Guest Count - Only show if attending and guests are allowed */}
          {watchedStatus === RSVPStatus.ATTENDING && config.allowsGuests && (
            <div>
              <Label htmlFor="guestCount" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Number of Guests (including yourself)
              </Label>
              <Input
                id="guestCount"
                type="number"
                min="1"
                max={config.maxGuests}
                {...register('guestCount', { valueAsNumber: true })}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum {config.maxGuests} guests allowed
              </p>
              {errors.guestCount && (
                <p className="text-red-500 text-sm mt-1">{errors.guestCount.message}</p>
              )}
            </div>
          )}

          {/* Dietary Restrictions - Only show if attending */}
          {watchedStatus === RSVPStatus.ATTENDING && (
            <div>
              <Label htmlFor="dietaryRestrictions">
                Dietary Restrictions (Optional)
              </Label>
              <Textarea
                id="dietaryRestrictions"
                {...register('dietaryRestrictions')}
                rows={3}
                className="mt-1"
                placeholder="Please specify any dietary restrictions..."
              />
              {errors.dietaryRestrictions && (
                <p className="text-red-500 text-sm mt-1">{errors.dietaryRestrictions.message}</p>
              )}
            </div>
          )}

          {/* Special Requests - Only show if attending */}
          {watchedStatus === RSVPStatus.ATTENDING && (
            <div>
              <Label htmlFor="specialRequests">
                Special Requests (Optional)
              </Label>
              <Textarea
                id="specialRequests"
                {...register('specialRequests')}
                rows={3}
                className="mt-1"
                placeholder="Any special accommodations needed..."
              />
              {errors.specialRequests && (
                <p className="text-red-500 text-sm mt-1">{errors.specialRequests.message}</p>
              )}
            </div>
          )}

          {/* Contact Information - Only show if attending and contact info is collected */}
          {watchedStatus === RSVPStatus.ATTENDING && config.collectsContactInfo && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>

              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('contactInfo.phone')}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="emergencyContact">Emergency Contact (Optional)</Label>
                <Input
                  id="emergencyContact"
                  {...register('contactInfo.emergencyContact')}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="emergencyPhone">Emergency Phone (Optional)</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  {...register('contactInfo.emergencyPhone')}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isCreating}
              className="flex-1"
            >
              {isCreating ? 'Submitting...' : 'Submit RSVP'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isCreating}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
