"use client";

import React from 'react';
import { OptimizedCommentSection } from './OptimizedCommentSection';
import { ContentType, UserRole } from '@/types/comment';
import { useUserRole } from '@/utils/auth/getUserRoleFromAuthV2';

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
  // Get user role from AuthV2
  const userRole: UserRole = useUserRole('guide');
  const contentType: ContentType = 'guide_session';


  return (
    <OptimizedCommentSection
      contentId={contentId}
      contentType={contentType}
      userRole={userRole}
      showStats={true}
      maxDepth={2} 
      pageSize={20}
      autoRefresh={false}
      refreshInterval={30000}
      className={className}
    />
  );
}
