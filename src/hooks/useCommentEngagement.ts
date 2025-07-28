"use client";

import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '@/lib/services/comment.service';
import { Comment } from '@/types/comment';

interface UseCommentEngagementOptions {
  contentId: string;
  contentType: string;
  currentUserId: string;
}

interface UseCommentEngagementReturn {
  // Actions
  toggleLike: (commentId: string) => Promise<Comment | null>;
  toggleDislike: (commentId: string) => Promise<Comment | null>;
  removeReaction: (commentId: string) => Promise<Comment | null>;
  
  // State
  isReacting: boolean;
  reactingCommentId: string | null;
  
  // Helpers
  getUserReaction: (comment: Comment) => 'like' | 'dislike' | null;
  hasUserLiked: (comment: Comment) => boolean;
  hasUserDisliked: (comment: Comment) => boolean;
}

export function useCommentEngagement(options: UseCommentEngagementOptions): UseCommentEngagementReturn {
  const { contentId, contentType, currentUserId } = options;
  const queryClient = useQueryClient();
  const [reactingCommentId, setReactingCommentId] = useState<string | null>(null);

  // React to comment mutation
  const reactMutation = useMutation({
    mutationFn: async ({ commentId, type }: { commentId: string; type: 'like' | 'dislike' }) => {
      setReactingCommentId(commentId);
      const response = await commentService.reactToComment(commentId, { type });
      return response.data?.comment;
    },
    onSuccess: () => {
      // Invalidate comments to refresh reaction counts
      queryClient.invalidateQueries({ queryKey: ['comments', contentId, contentType] });
    },
    onSettled: () => {
      setReactingCommentId(null);
    },
  });

  // Remove reaction mutation
  const removeReactionMutation = useMutation({
    mutationFn: async (commentId: string) => {
      setReactingCommentId(commentId);
      const response = await commentService.removeReaction(commentId);
      return response.data?.comment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', contentId, contentType] });
    },
    onSettled: () => {
      setReactingCommentId(null);
    },
  });

  // Get user's reaction for a comment
  const getUserReaction = useCallback((comment: Comment): 'like' | 'dislike' | null => {
    if (!currentUserId || !comment.reactions) return null;
    
    const userReaction = comment.reactions.find(reaction => reaction.userId === currentUserId);
    return userReaction ? userReaction.type : null;
  }, [currentUserId]);

  // Check if user has liked a comment
  const hasUserLiked = useCallback((comment: Comment): boolean => {
    return getUserReaction(comment) === 'like';
  }, [getUserReaction]);

  // Check if user has disliked a comment
  const hasUserDisliked = useCallback((comment: Comment): boolean => {
    return getUserReaction(comment) === 'dislike';
  }, [getUserReaction]);

  // Toggle like reaction
  const toggleLike = useCallback(async (commentId: string): Promise<Comment | null> => {
    try {
      // Always try to add like - the API will handle toggle logic
      const comment = await reactMutation.mutateAsync({ commentId, type: 'like' });
      return comment || null;
    } catch (error) {
      console.error('Failed to toggle like:', error);
      return null;
    }
  }, [reactMutation]);

  // Toggle dislike reaction
  const toggleDislike = useCallback(async (commentId: string): Promise<Comment | null> => {
    try {
      // Always try to add dislike - the API will handle toggle logic
      const comment = await reactMutation.mutateAsync({ commentId, type: 'dislike' });
      return comment || null;
    } catch (error) {
      console.error('Failed to toggle dislike:', error);
      return null;
    }
  }, [reactMutation]);

  // Remove any reaction
  const removeReaction = useCallback(async (commentId: string): Promise<Comment | null> => {
    try {
      const comment = await removeReactionMutation.mutateAsync(commentId);
      return comment || null;
    } catch (error) {
      console.error('Failed to remove reaction:', error);
      return null;
    }
  }, [removeReactionMutation]);

  return {
    // Actions
    toggleLike,
    toggleDislike,
    removeReaction,
    
    // State
    isReacting: reactMutation.isPending || removeReactionMutation.isPending,
    reactingCommentId,
    
    // Helpers
    getUserReaction,
    hasUserLiked,
    hasUserDisliked,
  };
}

// Additional hook for optimistic updates
export function useOptimisticCommentEngagement(options: UseCommentEngagementOptions) {
  const baseHook = useCommentEngagement(options);
  const [optimisticReactions, setOptimisticReactions] = useState<Record<string, 'like' | 'dislike' | null>>({});

  const toggleLikeOptimistic = useCallback(async (commentId: string, currentComment: Comment) => {
    const currentReaction = baseHook.getUserReaction(currentComment);
    const newReaction = currentReaction === 'like' ? null : 'like';
    
    // Optimistic update
    setOptimisticReactions(prev => ({ ...prev, [commentId]: newReaction }));
    
    try {
      await baseHook.toggleLike(commentId);
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticReactions(prev => ({ ...prev, [commentId]: currentReaction }));
      throw error;
    } finally {
      // Clear optimistic state
      setOptimisticReactions(prev => {
        const { [commentId]: _removed, ...rest } = prev;
        return rest;
      });
    }
  }, [baseHook]);

  const toggleDislikeOptimistic = useCallback(async (commentId: string, currentComment: Comment) => {
    const currentReaction = baseHook.getUserReaction(currentComment);
    const newReaction = currentReaction === 'dislike' ? null : 'dislike';
    
    // Optimistic update
    setOptimisticReactions(prev => ({ ...prev, [commentId]: newReaction }));
    
    try {
      await baseHook.toggleDislike(commentId);
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticReactions(prev => ({ ...prev, [commentId]: currentReaction }));
      throw error;
    } finally {
      // Clear optimistic state
      setOptimisticReactions(prev => {
        const { [commentId]: _, ...rest } = prev;
        return rest;
      });
    }
  }, [baseHook]);

  const getOptimisticReaction = useCallback((comment: Comment): 'like' | 'dislike' | null => {
    const optimistic = optimisticReactions[comment._id];
    return optimistic !== undefined ? optimistic : baseHook.getUserReaction(comment);
  }, [optimisticReactions, baseHook]);

  return {
    ...baseHook,
    toggleLike: toggleLikeOptimistic,
    toggleDislike: toggleDislikeOptimistic,
    getUserReaction: getOptimisticReaction,
    hasOptimisticUpdate: (commentId: string) => commentId in optimisticReactions,
  };
}
