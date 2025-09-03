"use client";

import React from 'react';
import { OptimizedCommentSection } from './OptimizedCommentSection';
import { ContentType, UserRole } from '@/types/comment';
import { useUserRole } from '@/utils/auth/getUserRoleFromAuthV2';

interface Grow3dgeSessionCommentSectionProps {
  contentId: string;
  className?: string;
}

export function Grow3dgeSessionCommentSection({ contentId, className }: Grow3dgeSessionCommentSectionProps) {
  const userRole: UserRole = useUserRole('partner');
  const contentType: ContentType = 'grow3dge-session';

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

