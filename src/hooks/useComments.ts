"use client";

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '@/lib/services/comment.service';
import {
  Comment,
  CreateCommentData,
  UpdateCommentData,
  CommentQueryParams,
  ThreadedCommentQueryParams,
  CommentsResponse,
  ThreadedCommentsResponse,
  CommentStats,
  ContentType,
} from '@/types/comment';
import { ApiError } from '@/types/api';

interface UseCommentsOptions {
  contentId: string;
  contentType: ContentType;
  page?: number;
  limit?: number;
  includeReplies?: boolean;
  threaded?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseCommentsReturn {
  // Data
  comments: Comment[];
  stats: CommentStats | null;
  loading: boolean;
  error: string | null;
  pagination: any;
  
  // Actions
  createComment: (content: string, parentCommentId?: string) => Promise<Comment | null>;
  updateComment: (commentId: string, content: string) => Promise<Comment | null>;
  deleteComment: (commentId: string) => Promise<boolean>;
  reactToComment: (commentId: string, type: 'like' | 'dislike') => Promise<Comment | null>;
  loadMore: () => void;
  refresh: () => void;
  
  // State
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isReacting: boolean;
}

export function useComments(options: UseCommentsOptions): UseCommentsReturn {
  const {
    contentId,
    contentType,
    page = 1,
    limit = 20,
    includeReplies = false,
    threaded = false,
    autoRefresh = false,
    refreshInterval = 30000, // 30 seconds
  } = options;

  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(page);

  // Query keys
  const commentsQueryKey = ['comments', contentId, contentType, currentPage, limit, includeReplies, threaded];
  const statsQueryKey = ['comment-stats', contentId, contentType];

  // Fetch comments
  const {
    data: commentsData,
    isLoading: commentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useQuery({
    queryKey: commentsQueryKey,
    queryFn: async () => {
      if (threaded) {
        const params: ThreadedCommentQueryParams = {
          contentId,
          contentType,
          page: currentPage,
          limit,
        };
        const response = await commentService.getThreadedComments(params);
        return response.data as ThreadedCommentsResponse;
      } else {
        const params: CommentQueryParams = {
          contentId,
          contentType,
          page: currentPage,
          limit,
          includeReplies,
        };
        const response = await commentService.getComments(params);
        return response.data as CommentsResponse;
      }
    },
    refetchInterval: autoRefresh ? refreshInterval : false,
    refetchOnWindowFocus: false,
  });

  // Fetch stats
  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: statsQueryKey,
    queryFn: async () => {
      const response = await commentService.getCommentStats(contentId, contentType);
      return response.data?.analytics || null;
    },
    refetchInterval: autoRefresh ? refreshInterval : false,
    refetchOnWindowFocus: false,
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async (data: CreateCommentData) => {
      const response = await commentService.createComment(data);
      return response.data?.comment;
    },
    onSuccess: () => {
      // Invalidate and refetch comments and stats
      queryClient.invalidateQueries({ queryKey: ['comments', contentId, contentType] });
      queryClient.invalidateQueries({ queryKey: ['comment-stats', contentId, contentType] });
      
      // Reset to first page to see new comment
      setCurrentPage(1);
    },
  });

  // Update comment mutation
  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, data }: { commentId: string; data: UpdateCommentData }) => {
      const response = await commentService.updateComment(commentId, data);
      return response.data?.comment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', contentId, contentType] });
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await commentService.deleteComment(commentId);
      return commentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', contentId, contentType] });
      queryClient.invalidateQueries({ queryKey: ['comment-stats', contentId, contentType] });
    },
  });

  // React to comment mutation
  const reactMutation = useMutation({
    mutationFn: async ({ commentId, type }: { commentId: string; type: 'like' | 'dislike' }) => {
      const response = await commentService.reactToComment(commentId, { type });
      return response.data?.comment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', contentId, contentType] });
    },
  });

  // Action handlers
  const createComment = useCallback(async (content: string, parentCommentId?: string): Promise<Comment | null> => {
    try {
      const data: CreateCommentData = {
        contentId,
        contentType,
        content,
        parentCommentId,
      };
      
      const comment = await createCommentMutation.mutateAsync(data);
      return comment || null;
    } catch (error) {
      console.error('Failed to create comment:', error);
      return null;
    }
  }, [contentId, contentType, createCommentMutation]);

  const updateComment = useCallback(async (commentId: string, content: string): Promise<Comment | null> => {
    try {
      const comment = await updateCommentMutation.mutateAsync({
        commentId,
        data: { content },
      });
      return comment || null;
    } catch (error) {
      console.error('Failed to update comment:', error);
      return null;
    }
  }, [updateCommentMutation]);

  const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
    try {
      await deleteCommentMutation.mutateAsync(commentId);
      return true;
    } catch (error) {
      console.error('Failed to delete comment:', error);
      return false;
    }
  }, [deleteCommentMutation]);

  const reactToComment = useCallback(async (commentId: string, type: 'like' | 'dislike'): Promise<Comment | null> => {
    try {
      const comment = await reactMutation.mutateAsync({ commentId, type });
      return comment || null;
    } catch (error) {
      console.error('Failed to react to comment:', error);
      return null;
    }
  }, [reactMutation]);

  const loadMore = useCallback(() => {
    if (commentsData?.pagination?.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [commentsData?.pagination?.hasNextPage]);

  const refresh = useCallback(() => {
    refetchComments();
    refetchStats();
  }, [refetchComments, refetchStats]);

  // Extract error message
  const getErrorMessage = (error: any): string | null => {
    if (!error) return null;
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'An unexpected error occurred';
  };

  return {
    // Data
    comments: commentsData?.comments || [],
    stats: statsData || null,
    loading: commentsLoading || statsLoading,
    error: getErrorMessage(commentsError),
    pagination: commentsData?.pagination || null,
    
    // Actions
    createComment,
    updateComment,
    deleteComment,
    reactToComment,
    loadMore,
    refresh,
    
    // State
    isCreating: createCommentMutation.isPending,
    isUpdating: updateCommentMutation.isPending,
    isDeleting: deleteCommentMutation.isPending,
    isReacting: reactMutation.isPending,
  };
}
