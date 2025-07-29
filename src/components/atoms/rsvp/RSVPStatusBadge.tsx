"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, X, HelpCircle, Users } from 'lucide-react';
import { RSVPStatus } from '@/types/rsvp';
import { cn } from '@/lib/utils';

interface RSVPStatusBadgeProps {
  status: RSVPStatus;
  count?: number;
  showIcon?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function RSVPStatusBadge({
  status,
  count,
  showIcon = true,
  size = 'md',
  className = '',
}: RSVPStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'attending':
        return {
          text: 'Attending',
          icon: Check,
          className: 'bg-green-100 text-green-800 border-green-200',
        };
      case 'not_attending':
        return {
          text: 'Not Attending',
          icon: X,
          className: 'bg-red-100 text-red-800 border-red-200',
        };
      case 'maybe':
        return {
          text: 'Maybe',
          icon: HelpCircle,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        };
      default:
        return {
          text: 'No Response',
          icon: Users,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1.5',
  };

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        sizeClasses[size],
        config.className,
        'font-medium border',
        className
      )}
    >
      {showIcon && Icon && (
        <Icon className={cn(iconSizeClasses[size], 'mr-1')} />
      )}
      {config.text}
      {count !== undefined && (
        <span className="ml-1 font-semibold">
          ({count})
        </span>
      )}
    </Badge>
  );
}
