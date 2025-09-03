"use client";

import React from 'react';
import { OptimizedCommentSection } from './OptimizedCommentSection';
import { ContentType, UserRole } from '@/types/comment';
import { usePathname } from 'next/navigation';
import { useUserRole } from '@/utils/auth/getUserRoleFromAuthV2';

interface IdeasLabCommentSectionProps {
  contentId: string;
  className?: string;
}

export function IdeasLabCommentSection({ 
  contentId, 
  className 
}: IdeasLabCommentSectionProps) {
  // Determine role via unified helper
  const userRole: UserRole = useUserRole();

  // Map content type based on route: guides or scholars or grow3dge
  const pathname = usePathname();
  const contentType: ContentType = pathname?.startsWith('/guides')
    ? 'guide_ideas_lab'
    : pathname?.startsWith('/scholars')
      ? 'scholar_ideas_lab'
      : 'grow3dge-idea-lab';

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
