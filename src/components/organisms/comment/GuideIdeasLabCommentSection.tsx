"use client";

import React from 'react';
import { OptimizedCommentSection } from './OptimizedCommentSection';
import { ContentType, UserRole } from '@/types/comment';
import { useUserRole } from '@/utils/auth/getUserRoleFromAuthV2';

interface GuideIdeasLabCommentSectionProps {
  contentId: string;
  className?: string;
}


export function GuideIdeasLabCommentSection({ 
  contentId, 
  className 
}: GuideIdeasLabCommentSectionProps) {
  const userRole: UserRole = useUserRole('guide');
  const contentType: ContentType = 'guide_ideas_lab';

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
