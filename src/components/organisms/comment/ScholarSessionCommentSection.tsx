"use client";

import React from 'react';
import { OptimizedCommentSection } from './OptimizedCommentSection';
import { ContentType, UserRole } from '@/types/comment';
import { useAppSelector } from '@/redux/store';

interface ScholarSessionCommentSectionProps {
  contentId: string;
  className?: string;
}

/**
 * Pre-configured comment section specifically for Scholar Session pages
 * This component handles all the configuration and user context automatically
 */
export function ScholarSessionCommentSection({ 
  contentId, 
  className 
}: ScholarSessionCommentSectionProps) {
  // Get user role from Redux store
  const user = useAppSelector(state => state.user);
  const userRole: UserRole = user?.roles?.[0] || 'scholar';

  // Scholar sessions use scholar_session content type
  const contentType: ContentType = 'scholar_session';

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
