"use client";

import React from 'react';
import { OptimizedCommentSection } from './OptimizedCommentSection';
import { ContentType, UserRole } from '@/types/comment';
import { useUserRole } from '@/utils/auth/getUserRoleFromAuthV2';

interface ScholarSessionCommentSectionProps {
  contentId: string;
  className?: string;
}

export function ScholarSessionCommentSection({ 
  contentId, 
  className 
}: ScholarSessionCommentSectionProps) {
  const userRole: UserRole = useUserRole('scholar');
  const contentType: ContentType = 'scholar_session';

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
