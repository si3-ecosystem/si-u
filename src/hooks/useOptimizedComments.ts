"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { optimizedCommentService, OptimizedCommentService } from '@/lib/services/optimized-comment.service';
import { useAppSelector } from '@/redux/store';
import {
  Comment,
  CreateCommentData,
  UpdateCommentData,
  ThreadedCommentsResponse,
  CommentStatsResponse,
  ContentType,
} from '@/types/comment';
import { toast } from 'sonner';

interface UseOptimizedCommentsOptions {
  contentId: string;
  contentType: ContentType;
  page?: number;
  limit?: number;
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

interface UseOptimizedCommentsReturn {
  // Data
  comments: Comment[];
  stats: CommentStatsResponse | undefined;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalComments: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | undefined;

  // Loading states
  isLoading: boolean;
  isLoadingStats: boolean;
  isFetching: boolean;
  isRefetching: boolean;

  // Error states
  error: Error | null;
  statsError: Error | null;

  // Mutations
  createComment: (data: Omit<CreateCommentData, 'contentId' | 'contentType'>) => Promise<Comment>;
  updateComment: (commentId: string, data: UpdateCommentData) => Promise<Comment>;
  deleteComment: (commentId: string) => Promise<void>;
  reactToComment: (commentId: string, type: 'like' | 'dislike') => Promise<void>;
  removeReaction: (commentId: string) => Promise<void>;

  // Mutation states
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isReacting: boolean;

  // Actions
  refetch: () => Promise<any>;
  refetchStats: () => Promise<any>;
  invalidateComments: () => void;
}

export function useOptimizedComments(options: UseOptimizedCommentsOptions): UseOptimizedCommentsReturn {
  const {
    contentId,
    contentType,
    page = 1,
    limit = 20,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
  } = options;

  const queryClient = useQueryClient();

  // Get current user from Redux store
  const currentUser = useAppSelector(state => state.user);

  // Handle different user data structures
  const getCurrentUserId = () => {
    // Check if user data is nested under 'user' property
    if (currentUser?.user) {
      return currentUser.user._id || currentUser.user.id;
    }
    // Check if user data is directly on the currentUser object
    if (currentUser?._id || currentUser?.id) {
      return currentUser._id || currentUser.id;
    }
    // Fallback to anonymous
    return 'anonymous';
  };

  const currentUserId = getCurrentUserId();

  // Query keys
  const commentsQueryKey = OptimizedCommentService.getQueryKeys().threaded(contentId, contentType, page);
  const statsQueryKey = OptimizedCommentService.getQueryKeys().stats(contentId, contentType);

  // Fetch threaded comments
  const {
    data: commentsData,
    isLoading,
    isFetching,
    isRefetching,
    error,
    refetch,
  } = useQuery({
    queryKey: commentsQueryKey,
    queryFn: () => optimizedCommentService.getThreadedComments({
      contentId,
      contentType,
      page,
      limit,
    }),
    enabled,
    staleTime,
    gcTime: cacheTime,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Fetch comment statistics
  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: statsQueryKey,
    queryFn: () => optimizedCommentService.getCommentStats(contentId, contentType),
    enabled,
    staleTime,
    gcTime: cacheTime,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Create comment mutation with optimistic updates
  const createCommentMutation = useMutation({
    mutationFn: async (data: Omit<CreateCommentData, 'contentId' | 'contentType'>) => {
      return optimizedCommentService.createComment({
        ...data,
        contentId,
        contentType,
      });
    },
    onMutate: async (newCommentData) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: commentsQueryKey });
      await queryClient.cancelQueries({ queryKey: statsQueryKey });

      // Snapshot previous values
      const previousComments = queryClient.getQueryData<ThreadedCommentsResponse>(commentsQueryKey);
      const previousStats = queryClient.getQueryData<CommentStatsResponse>(statsQueryKey);

      // Optimistically update comments
      if (previousComments) {
        const optimisticComment: Comment = {
          _id: `temp-${Date.now()}`,
          contentId,
          contentType,
          content: newCommentData.content,
          userId: currentUserId,
          user: {
            _id: currentUserId,
            email: currentUser?.user?.email || 'unknown@user.com',
            roles: currentUser?.user?.roles || ['scholar'],
          },
          parentCommentId: newCommentData.parentCommentId,
          isReply: !!newCommentData.parentCommentId,
          replyCount: 0,
          reactions: [],
          likeCount: 0,
          dislikeCount: 0,
          isDeleted: false,
          isEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          replies: [],
        };

        const updatedComments = newCommentData.parentCommentId
          ? previousComments.comments // For replies, we'll handle this in the backend response
          : [optimisticComment, ...previousComments.comments];

        queryClient.setQueryData(commentsQueryKey, {
          ...previousComments,
          comments: updatedComments,
        });
      }

      // Optimistically update stats
      if (previousStats) {
        queryClient.setQueryData(statsQueryKey, {
          ...previousStats,
          analytics: {
            ...previousStats.analytics,
            totalComments: previousStats.analytics.totalComments + 1,
            totalTopLevel: newCommentData.parentCommentId 
              ? previousStats.analytics.totalTopLevel
              : previousStats.analytics.totalTopLevel + 1,
            totalReplies: newCommentData.parentCommentId
              ? previousStats.analytics.totalReplies + 1
              : previousStats.analytics.totalReplies,
          },
        });
      }

      return { previousComments, previousStats };
    },
    onError: (error, _variables, context) => {
      // Rollback optimistic updates
      if (context?.previousComments) {
        queryClient.setQueryData(commentsQueryKey, context.previousComments);
      }
      if (context?.previousStats) {
        queryClient.setQueryData(statsQueryKey, context.previousStats);
      }
      
      toast.error('Failed to post comment. Please try again.');
      console.error('Create comment error:', error);
    },
    onSuccess: (newComment) => {
      // Invalidate and refetch to get the real data
      queryClient.invalidateQueries({ queryKey: commentsQueryKey });
      queryClient.invalidateQueries({ queryKey: statsQueryKey });
      
      toast.success(newComment.isReply ? 'Reply posted successfully!' : 'Comment posted successfully!');
    },
  });

  // Update comment mutation
  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: UpdateCommentData }) =>
      optimizedCommentService.updateComment(commentId, data),
    onMutate: async ({ commentId, data }) => {
      await queryClient.cancelQueries({ queryKey: commentsQueryKey });
      
      const previousComments = queryClient.getQueryData<ThreadedCommentsResponse>(commentsQueryKey);
      
      if (previousComments) {
        const updateCommentInList = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment._id === commentId) {
              return { ...comment, content: data.content, isEdited: true };
            }
            if (comment.replies) {
              return { ...comment, replies: updateCommentInList(comment.replies) };
            }
            return comment;
          });
        };

        queryClient.setQueryData(commentsQueryKey, {
          ...previousComments,
          comments: updateCommentInList(previousComments.comments),
        });
      }

      return { previousComments };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(commentsQueryKey, context.previousComments);
      }
      toast.error('Failed to update comment. Please try again.');
    },
    onSuccess: () => {
      toast.success('Comment updated successfully!');
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => optimizedCommentService.deleteComment(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: commentsQueryKey });
      await queryClient.cancelQueries({ queryKey: statsQueryKey });
      
      const previousComments = queryClient.getQueryData<ThreadedCommentsResponse>(commentsQueryKey);
      const previousStats = queryClient.getQueryData<CommentStatsResponse>(statsQueryKey);
      
      // Optimistically remove comment (immutable update)
      if (previousComments) {
        const removeCommentFromList = (comments: Comment[]): Comment[] => {
          return comments
            .filter(comment => comment._id !== commentId)
            .map(comment => ({
              ...comment,
              replies: comment.replies ? removeCommentFromList(comment.replies) : undefined,
            }));
        };

        queryClient.setQueryData(commentsQueryKey, {
          ...previousComments,
          comments: removeCommentFromList(previousComments.comments),
        });
      }

      return { previousComments, previousStats };
    },
    onError: (error, _variables, context) => {
      console.error('Delete comment error:', error);

      // Restore previous state immutably
      if (context?.previousComments) {
        queryClient.setQueryData(commentsQueryKey, context.previousComments);
      }
      if (context?.previousStats) {
        queryClient.setQueryData(statsQueryKey, context.previousStats);
      }

      toast.error('Failed to delete comment. Please try again.');
    },
    onSuccess: () => {
      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: commentsQueryKey });
      queryClient.invalidateQueries({ queryKey: statsQueryKey });
      toast.success('Comment deleted successfully!');
    },
    onSettled: () => {
      // Ensure loading states are reset and queries are fresh
      queryClient.invalidateQueries({ queryKey: commentsQueryKey });
    },
  });

  // Memoized return values
  const comments = useMemo(() => commentsData?.comments || [], [commentsData?.comments]);
  const stats = useMemo(() => statsData, [statsData]);
  const pagination = useMemo(() => commentsData?.pagination, [commentsData?.pagination]);

  // Action callbacks
  const invalidateComments = useCallback(() => {
    queryClient.invalidateQueries({ 
      queryKey: OptimizedCommentService.getQueryKeys().list(contentId, contentType) 
    });
  }, [queryClient, contentId, contentType]);

  return {
    // Data
    comments,
    stats,
    pagination,

    // Loading states
    isLoading,
    isLoadingStats,
    isFetching,
    isRefetching,

    // Error states
    error,
    statsError,

    // Mutations
    createComment: createCommentMutation.mutateAsync,
    updateComment: (commentId: string, data: UpdateCommentData) => 
      updateCommentMutation.mutateAsync({ commentId, data }),
    deleteComment: deleteCommentMutation.mutateAsync,
    reactToComment: async () => {
      // This will be implemented in the reaction hook
      throw new Error('Use useOptimizedCommentReactions for reactions');
    },
    removeReaction: async () => {
      // This will be implemented in the reaction hook
      throw new Error('Use useOptimizedCommentReactions for reactions');
    },

    // Mutation states
    isCreating: createCommentMutation.isPending,
    isUpdating: updateCommentMutation.isPending,
    isDeleting: deleteCommentMutation.isPending,
    isReacting: false, // Will be handled by reaction hook

    // Actions
    refetch,
    refetchStats,
    invalidateComments,
  };
}
