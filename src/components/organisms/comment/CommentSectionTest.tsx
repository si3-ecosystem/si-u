"use client";

import React, { useEffect } from 'react';
import { CommentSection } from './CommentSection';
import { useReduxComments } from '@/hooks/useReduxComments';
import { generateMockComments, generateMockCommentStats, generateCommentWithMissingUser } from '@/lib/mock/commentData';

interface CommentSectionTestProps {
  contentId: string;
  contentType: 'scholar_session' | 'scholar_ideas_lab' | 'guide_session' | 'guide_ideas_lab';
  userRole: 'scholar' | 'guide' | 'admin';
}

export function CommentSectionTest({ 
  contentId, 
  contentType, 
  userRole 
}: CommentSectionTestProps) {
  const { setComments, setStats } = useReduxComments(contentId);

  useEffect(() => {
    const mockComments = [
      ...generateMockComments(contentId, 3),
      generateCommentWithMissingUser(contentId),
    ];
    
    const mockStats = generateMockCommentStats(contentId);
    
    // Simulate API delay
    setTimeout(() => {
      setComments(mockComments);
      setStats(mockStats);
    }, 500);
  }, [contentId, setComments, setStats]);

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">
          🧪 Comment System Test Mode
        </h3>
        <p className="text-xs text-yellow-700">
          This is using mock data to test the comment system. 
          One comment intentionally has missing user data to test error handling.
        </p>
      </div>
      
      <CommentSection
        contentId={contentId}
        contentType={contentType}
        userRole={userRole}
        showStats={true}
        autoRefresh={false}
        maxDepth={3}
        pageSize={20}
      />
    </div>
  );
}
