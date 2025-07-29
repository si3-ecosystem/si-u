"use client";

import React from 'react';
import { OptimizedCommentSection } from './OptimizedCommentSection';
import { ContentType, UserRole } from '@/types/comment';
import { useAppSelector } from '@/redux/store';

interface GuideSessionCommentSectionProps {
  contentId: string;
  className?: string;
}

/**
 * Pre-configured comment section specifically for Guide Session pages
 * This component handles all the configuration and user context automatically
 */
export function GuideSessionCommentSection({ 
  contentId, 
  className 
}: GuideSessionCommentSectionProps) {
  // Get user role from Redux store
  const user = useAppSelector(state => state.user);
  const userRole: UserRole = user?.roles?.[0] || 'scholar';

  // Guide sessions use guide_session content type
  const contentType: ContentType = 'guide_session';

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
