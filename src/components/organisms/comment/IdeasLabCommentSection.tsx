"use client";

import React from 'react';
import { OptimizedCommentSection } from './OptimizedCommentSection';
import { ContentType, UserRole } from '@/types/comment';
import { useAppSelector } from '@/redux/store';

interface IdeasLabCommentSectionProps {
  contentId: string;
  className?: string;
}

/**
 * Pre-configured comment section specifically for Ideas Lab pages
 * This component handles all the configuration and user context automatically
 */
export function IdeasLabCommentSection({ 
  contentId, 
  className 
}: IdeasLabCommentSectionProps) {
  // Get user role from Redux store (you may need to adjust this based on your auth implementation)
  const user = useAppSelector(state => state.user);
  const userRole: UserRole = user?.roles?.[0] || 'scholar';

  // Determine content type based on the current path or user role
  const contentType: ContentType = userRole === 'guide' ? 'guide_ideas_lab' : 'scholar_ideas_lab';

  return (
    <OptimizedCommentSection
      contentId={contentId}
      contentType={contentType}
      userRole={userRole}
      showStats={true}
      maxDepth={2} // Only allow one level of replies
      pageSize={20}
      autoRefresh={false}
      refreshInterval={30000}
      className={className}
    />
  );
}
