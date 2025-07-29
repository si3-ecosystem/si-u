"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { optimizedCommentService, OptimizedCommentService } from '@/lib/services/optimized-comment.service';
import {
  Comment,
  ThreadedCommentsResponse,
  ContentType,
} from '@/types/comment';
import { toast } from 'sonner';

interface UseOptimizedCommentReactionsOptions {
  commentId: string;
  contentId: string;
  contentType: ContentType;
  enabled?: boolean;
}

interface UseOptimizedCommentReactionsReturn {
  // Data
  userReaction: string | null;
  
  // Loading states
  isLoading: boolean;
  isReacting: boolean;
  
  // Error state
  error: Error | null;
  
  // Actions
  toggleLike: () => Promise<void>;
  toggleDislike: () => Promise<void>;
  removeReaction: () => Promise<void>;
  
  // Utilities
  hasLiked: boolean;
  hasDisliked: boolean;
  refetch: () => Promise<any>;
}

export function useOptimizedCommentReactions(
  options: UseOptimizedCommentReactionsOptions
): UseOptimizedCommentReactionsReturn {
  const {
    commentId,
    contentId,
    contentType,
    enabled = true,
  } = options;

  const queryClient = useQueryClient();

  // Query keys
  const userReactionQueryKey = OptimizedCommentService.getQueryKeys().userReaction(commentId);
  const commentsQueryKey = OptimizedCommentService.getQueryKeys().threaded(contentId, contentType);

  // Fetch user's reaction to this comment
  const {
    data: reactionData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: userReactionQueryKey,
    queryFn: () => optimizedCommentService.getUserReaction(commentId),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // React to comment mutation with optimistic updates
  const reactMutation = useMutation({
    mutationFn: ({ type }: { type: 'like' | 'dislike' }) =>
      optimizedCommentService.reactToComment(commentId, { type }),
    onMutate: async ({ type }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userReactionQueryKey });
      await queryClient.cancelQueries({ queryKey: commentsQueryKey });

      // Snapshot previous values
      const previousReaction = queryClient.getQueryData<{ userReaction: string | null }>(userReactionQueryKey);
      const previousComments = queryClient.getQueryData<ThreadedCommentsResponse>(commentsQueryKey);

      // Optimistically update user reaction
      queryClient.setQueryData(userReactionQueryKey, { userReaction: type });

      // Optimistically update comment counts in the comments list
      if (previousComments) {
        const updateCommentReaction = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment._id === commentId) {
              const currentReaction = previousReaction?.userReaction;
              let newLikeCount = comment.likeCount;
              let newDislikeCount = comment.dislikeCount;

              // Remove previous reaction count
              if (currentReaction === 'like') {
                newLikeCount = Math.max(0, newLikeCount - 1);
              } else if (currentReaction === 'dislike') {
                newDislikeCount = Math.max(0, newDislikeCount - 1);
              }

              // Add new reaction count
              if (type === 'like') {
                newLikeCount += 1;
              } else if (type === 'dislike') {
                newDislikeCount += 1;
              }

              return {
                ...comment,
                likeCount: newLikeCount,
                dislikeCount: newDislikeCount,
              };
            }
            
            // Check replies recursively
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateCommentReaction(comment.replies),
              };
            }
            
            return comment;
          });
        };

        queryClient.setQueryData(commentsQueryKey, {
          ...previousComments,
          comments: updateCommentReaction(previousComments.comments),
        });
      }

      return { previousReaction, previousComments };
    },
    onError: (error, variables, context) => {
      // Rollback optimistic updates
      if (context?.previousReaction) {
        queryClient.setQueryData(userReactionQueryKey, context.previousReaction);
      }
      if (context?.previousComments) {
        queryClient.setQueryData(commentsQueryKey, context.previousComments);
      }
      
      toast.error('Failed to update reaction. Please try again.');
      console.error('React to comment error:', error);
    },
    onSuccess: (data) => {
      // Update with real data from server
      queryClient.setQueryData(userReactionQueryKey, { userReaction: data.userReaction });
      
      // Update the comment in the comments list with real data
      const commentsData = queryClient.getQueryData<ThreadedCommentsResponse>(commentsQueryKey);
      if (commentsData) {
        const updateCommentWithRealData = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment._id === commentId) {
              return data.comment;
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateCommentWithRealData(comment.replies),
              };
            }
            return comment;
          });
        };

        queryClient.setQueryData(commentsQueryKey, {
          ...commentsData,
          comments: updateCommentWithRealData(commentsData.comments),
        });
      }
    },
  });

  // Remove reaction mutation
  const removeReactionMutation = useMutation({
    mutationFn: () => optimizedCommentService.removeReaction(commentId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: userReactionQueryKey });
      await queryClient.cancelQueries({ queryKey: commentsQueryKey });

      const previousReaction = queryClient.getQueryData<{ userReaction: string | null }>(userReactionQueryKey);
      const previousComments = queryClient.getQueryData<ThreadedCommentsResponse>(commentsQueryKey);

      // Optimistically remove reaction
      queryClient.setQueryData(userReactionQueryKey, { userReaction: null });

      // Optimistically update comment counts
      if (previousComments && previousReaction?.userReaction) {
        const updateCommentReaction = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment._id === commentId) {
              const currentReaction = previousReaction.userReaction;
              let newLikeCount = comment.likeCount;
              let newDislikeCount = comment.dislikeCount;

              if (currentReaction === 'like') {
                newLikeCount = Math.max(0, newLikeCount - 1);
              } else if (currentReaction === 'dislike') {
                newDislikeCount = Math.max(0, newDislikeCount - 1);
              }

              return {
                ...comment,
                likeCount: newLikeCount,
                dislikeCount: newDislikeCount,
              };
            }
            
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateCommentReaction(comment.replies),
              };
            }
            
            return comment;
          });
        };

        queryClient.setQueryData(commentsQueryKey, {
          ...previousComments,
          comments: updateCommentReaction(previousComments.comments),
        });
      }

      return { previousReaction, previousComments };
    },
    onError: (error, variables, context) => {
      if (context?.previousReaction) {
        queryClient.setQueryData(userReactionQueryKey, context.previousReaction);
      }
      if (context?.previousComments) {
        queryClient.setQueryData(commentsQueryKey, context.previousComments);
      }
      
      toast.error('Failed to remove reaction. Please try again.');
    },
    onSuccess: (updatedComment) => {
      queryClient.setQueryData(userReactionQueryKey, { userReaction: null });
      
      // Update comment with real data
      const commentsData = queryClient.getQueryData<ThreadedCommentsResponse>(commentsQueryKey);
      if (commentsData) {
        const updateCommentWithRealData = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment._id === commentId) {
              return updatedComment;
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateCommentWithRealData(comment.replies),
              };
            }
            return comment;
          });
        };

        queryClient.setQueryData(commentsQueryKey, {
          ...commentsData,
          comments: updateCommentWithRealData(commentsData.comments),
        });
      }
    },
  });

  // Action callbacks
  const toggleLike = useCallback(async () => {
    const currentReaction = reactionData?.userReaction;
    
    if (currentReaction === 'like') {
      await removeReactionMutation.mutateAsync();
    } else {
      await reactMutation.mutateAsync({ type: 'like' });
    }
  }, [reactionData?.userReaction, reactMutation, removeReactionMutation]);

  const toggleDislike = useCallback(async () => {
    const currentReaction = reactionData?.userReaction;
    
    if (currentReaction === 'dislike') {
      await removeReactionMutation.mutateAsync();
    } else {
      await reactMutation.mutateAsync({ type: 'dislike' });
    }
  }, [reactionData?.userReaction, reactMutation, removeReactionMutation]);

  const removeReactionCallback = useCallback(async () => {
    await removeReactionMutation.mutateAsync();
  }, [removeReactionMutation]);

  return {
    // Data
    userReaction: reactionData?.userReaction || null,
    
    // Loading states
    isLoading,
    isReacting: reactMutation.isPending || removeReactionMutation.isPending,
    
    // Error state
    error,
    
    // Actions
    toggleLike,
    toggleDislike,
    removeReaction: removeReactionCallback,
    
    // Utilities
    hasLiked: reactionData?.userReaction === 'like',
    hasDisliked: reactionData?.userReaction === 'dislike',
    refetch,
  };
}
