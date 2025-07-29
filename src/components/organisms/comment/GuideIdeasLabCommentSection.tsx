"use client";

import React from 'react';
import { OptimizedCommentSection } from './OptimizedCommentSection';
import { ContentType, UserRole } from '@/types/comment';
import { useAppSelector } from '@/redux/store';

interface GuideIdeasLabCommentSectionProps {
  contentId: string;
  className?: string;
}

/**
 * Pre-configured comment section specifically for Guide Ideas Lab pages
 * This component handles all the configuration and user context automatically
 */
export function GuideIdeasLabCommentSection({ 
  contentId, 
  className 
}: GuideIdeasLabCommentSectionProps) {
  // Get user role from Redux store
  const user = useAppSelector(state => state.user);
  const userRole: UserRole = user?.roles?.[0] || 'guide';

  // Guide ideas lab uses guide_ideas_lab content type
  const contentType: ContentType = 'guide_ideas_lab';

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
