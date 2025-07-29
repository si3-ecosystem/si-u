"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Check, X, HelpCircle } from 'lucide-react';
import { RSVPStatus } from '@/types/rsvp';
import { cn } from '@/lib/utils';

interface RSVPButtonProps {
  status: RSVPStatus;
  onStatusChange: (status: RSVPStatus) => void;
  isLoading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RSVPButton({
  status,
  onStatusChange,
  isLoading = false,
  disabled = false,
  size = 'md',
  className = '',
}: RSVPButtonProps) {
  const getButtonConfig = () => {
    switch (status) {
      case 'attending':
        return {
          text: 'Attending',
          icon: Check,
          variant: 'default' as const,
          className: 'bg-green-600 hover:bg-green-700 text-white',
        };
      case 'not_attending':
        return {
          text: 'Not Attending',
          icon: X,
          variant: 'destructive' as const,
          className: 'bg-red-600 hover:bg-red-700 text-white',
        };
      case 'maybe':
        return {
          text: 'Maybe',
          icon: HelpCircle,
          variant: 'secondary' as const,
          className: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        };
      default:
        return {
          text: 'RSVP',
          icon: null,
          variant: 'outline' as const,
          className: 'border-gray-300 hover:bg-gray-50',
        };
    }
  };

  const config = getButtonConfig();
  const Icon = config.icon;

  const handleClick = () => {
    if (disabled || isLoading) return;
    
    // Cycle through RSVP statuses
    switch (status) {
      case null:
        onStatusChange('attending');
        break;
      case 'attending':
        onStatusChange('maybe');
        break;
      case 'maybe':
        onStatusChange('not_attending');
        break;
      case 'not_attending':
        onStatusChange(null);
        break;
    }
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 text-sm',
    lg: 'h-10 px-6 text-base',
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isLoading}
      variant={config.variant}
      className={cn(
        sizeClasses[size],
        config.className,
        'transition-all duration-200 min-w-[100px]',
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-label={`RSVP status: ${status || 'not set'}. Click to change.`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Updating...
        </>
      ) : (
        <>
          {Icon && <Icon className="h-4 w-4 mr-2" />}
          {config.text}
        </>
      )}
    </Button>
  );
}
