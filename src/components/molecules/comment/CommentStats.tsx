"use client";

import { useQuery } from '@tanstack/react-query';
import { commentService } from '@/lib/services/comment.service';
import { MessageCircle, Users, Clock, TrendingUp } from 'lucide-react';
import { ContentType } from '@/types/comment';
import { cn } from '@/lib/utils';

interface CommentStatsProps {
  contentId: string;
  contentType: ContentType;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export function CommentStats({
  contentId,
  contentType,
  variant = 'default',
  className = '',
}: CommentStatsProps) {
  const { data: statsData, isLoading, error } = useQuery({
    queryKey: ['comment-stats', contentId, contentType],
    queryFn: async () => {
      const response = await commentService.getCommentStats(contentId, contentType);
      return response.data?.analytics;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  if (error || !statsData) {
    return null;
  }

  const stats = statsData;

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-1 text-sm text-gray-500', className)}>
        <MessageCircle className="h-3 w-3" />
        <span>{stats.totalComments}</span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Comments</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalComments}</div>
          <div className="text-xs text-gray-500">
            {stats.totalTopLevel} top-level, {stats.totalReplies} replies
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Participants</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.uniqueUserCount}</div>
          <div className="text-xs text-gray-500">Unique contributors</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Latest</span>
          </div>
          <div className="text-sm font-bold text-gray-900">
            {stats.latestComment 
              ? new Date(stats.latestComment).toLocaleDateString()
              : 'No comments'
            }
          </div>
          <div className="text-xs text-gray-500">Most recent activity</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Activity</span>
          </div>
          <div className="text-sm font-bold text-gray-900">
            {stats.totalComments > 0 ? 'Active' : 'Quiet'}
          </div>
          <div className="text-xs text-gray-500">Discussion level</div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('flex items-center gap-4 text-sm text-gray-600', className)}>
      <div className="flex items-center gap-1">
        <MessageCircle className="h-4 w-4" />
        <span>{stats.totalComments} {stats.totalComments === 1 ? 'comment' : 'comments'}</span>
      </div>
      
      {stats.uniqueUserCount > 0 && (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>{stats.uniqueUserCount} {stats.uniqueUserCount === 1 ? 'participant' : 'participants'}</span>
        </div>
      )}
    </div>
  );
}
