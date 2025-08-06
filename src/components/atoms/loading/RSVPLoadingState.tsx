"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RSVPLoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RSVPLoadingState({ 
  message = 'Loading...', 
  size = 'md',
  className = '' 
}: RSVPLoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      <span className={cn('text-gray-600', textSizeClasses[size])}>
        {message}
      </span>
    </div>
  );
}

// Skeleton loading for RSVP cards
export function RSVPCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Image skeleton */}
          <div className="w-full md:w-[228px] h-[157px] bg-gray-200 rounded-lg flex-shrink-0"></div>
          
          {/* Content skeleton */}
          <div className="flex-1 space-y-4">
            {/* Title */}
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            
            {/* Date and time */}
            <div className="flex gap-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            
            {/* Guide and partner info */}
            <div className="flex gap-14">
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            
            {/* Button */}
            <div className="flex justify-end">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading state for RSVP lists
export function RSVPListSkeleton({ count = 3, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <RSVPCardSkeleton key={index} />
      ))}
    </div>
  );
}
