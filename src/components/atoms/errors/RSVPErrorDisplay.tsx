"use client";

import React from 'react';
import { AlertTriangle, RefreshCw, X, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface RSVPErrorDisplayProps {
  error: string | Error;
  type?: 'error' | 'warning' | 'info';
  title?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  showDetails?: boolean;
}

export function RSVPErrorDisplay({
  error,
  type = 'error',
  title,
  onRetry,
  onDismiss,
  className = '',
  showDetails = false
}: RSVPErrorDisplayProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'warning':
        return 'default';
      case 'info':
        return 'default';
      default:
        return 'destructive';
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Information';
      default:
        return 'Error';
    }
  };

  return (
    <Alert variant={getVariant()} className={cn('relative', className)}>
      {getIcon()}
      <AlertTitle className="flex items-center justify-between">
        {title || getDefaultTitle()}
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-auto p-1 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <p>{errorMessage}</p>
        
        {showDetails && error instanceof Error && error.stack && (
          <details className="text-xs bg-gray-50 p-2 rounded">
            <summary className="cursor-pointer font-medium">Technical Details</summary>
            <pre className="mt-2 whitespace-pre-wrap text-gray-600">
              {error.stack}
            </pre>
          </details>
        )}
        
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-3 w-3" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

// Specific error components for common RSVP scenarios
export function RSVPNotEnabledError({ className = '' }: { className?: string }) {
  return (
    <RSVPErrorDisplay
      type="info"
      title="RSVP Not Available"
      error="RSVP is not enabled for this session."
      className={className}
    />
  );
}

export function RSVPDeadlinePassedError({ className = '' }: { className?: string }) {
  return (
    <RSVPErrorDisplay
      type="warning"
      title="RSVP Closed"
      error="The RSVP deadline for this session has passed."
      className={className}
    />
  );
}

export function RSVPCapacityFullError({ 
  waitlistEnabled = false, 
  onJoinWaitlist,
  className = '' 
}: { 
  waitlistEnabled?: boolean;
  onJoinWaitlist?: () => void;
  className?: string;
}) {
  return (
    <Alert className={cn('border-amber-200 bg-amber-50', className)}>
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">Session Full</AlertTitle>
      <AlertDescription className="space-y-3 text-amber-700">
        <p>This session has reached its maximum capacity.</p>
        {waitlistEnabled && (
          <>
            <p>You can join the waitlist to be notified if a spot becomes available.</p>
            {onJoinWaitlist && (
              <Button
                variant="outline"
                size="sm"
                onClick={onJoinWaitlist}
                className="border-amber-300 text-amber-800 hover:bg-amber-100"
              >
                Join Waitlist
              </Button>
            )}
          </>
        )}
      </AlertDescription>
    </Alert>
  );
}

export function RSVPNetworkError({ onRetry, className = '' }: { onRetry?: () => void; className?: string }) {
  return (
    <RSVPErrorDisplay
      type="error"
      title="Connection Error"
      error="Unable to connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
      className={className}
    />
  );
}
