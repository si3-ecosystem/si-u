"use client";

import React from 'react';
import { OptimizedCommentSection } from './OptimizedCommentSection';
import { ContentType, UserRole } from '@/types/comment';
import { useAppSelector } from '@/redux/store';

interface IdeasLabCommentSectionProps {
  contentId: string;
  className?: string;
}

export function IdeasLabCommentSection({ 
  contentId, 
  className 
}: IdeasLabCommentSectionProps) {
  const user = useAppSelector(state => state.user);

  const userRole: UserRole = user?.user?.roles.some((role:string)=> role === 'guide') ? 'guide' : 'scholar' ;

  const contentType: ContentType = userRole === 'guide' ? 'guide_ideas_lab' : 'scholar_ideas_lab';

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
