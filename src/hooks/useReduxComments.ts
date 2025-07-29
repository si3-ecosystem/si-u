"use client";

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
  setComments,
  addComment,
  updateComment,
  deleteComment,
  setCommentCount,
  incrementCommentCount,
  decrementCommentCount,
  setCommentStats,
  toggleSection,
  setLoading,
  setError,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setDraft,
  clearDraft,
  startEditing,
  stopEditing,
  startReplying,
  stopReplying,
} from '@/redux/slice/commentSlice';
import {
  selectCommentsForContent,
  selectCommentCountForContent,
  selectCommentStatsForContent,
  selectIsContentSectionExpanded,
  selectIsLoading,
  selectError,
  selectDraft,
  selectIsEditing,
  selectIsReplying,
  selectNotifications,
  selectSortedThreadedCommentsForContent,
} from '@/redux/selectors/commentSelectors';
import { Comment, CommentStats } from '@/types/comment';

// Hook for managing comments for a specific content item
export function useReduxComments(contentId: string, sortBy: 'newest' | 'oldest' | 'popular' = 'newest') {
  const dispatch = useAppDispatch();

  const comments = useAppSelector(state => selectCommentsForContent(state, contentId));
  const threadedComments = useAppSelector(state => selectSortedThreadedCommentsForContent(state, contentId, sortBy));
  const commentCount = useAppSelector(state => selectCommentCountForContent(state, contentId));
  const commentStats = useAppSelector(state => selectCommentStatsForContent(state, contentId));
  const isExpanded = useAppSelector(state => selectIsContentSectionExpanded(state, contentId));
  const isLoading = useAppSelector(state => selectIsLoading(state, contentId));
  const error = useAppSelector(state => selectError(state, contentId));

  const actions = {
    setComments: useCallback((comments: Comment[]) => {
      dispatch(setComments({ contentId, comments }));
    }, [dispatch, contentId]),

    addComment: useCallback((comment: Comment) => {
      console.log('useReduxComments: Adding comment', {
        commentId: comment._id,
        isReply: comment.isReply,
        parentId: comment.parentCommentId,
        contentId: comment.contentId
      });

      dispatch(addComment({ contentId, comment }));
      dispatch(addNotification({
        type: 'success',
        title: 'Comment posted',
        message: comment.isReply ? 'Your reply has been posted successfully.' : 'Your comment has been posted successfully.',
        autoHide: true,
      }));
    }, [dispatch, contentId]),

    updateComment: useCallback((commentId: string, updates: Partial<Comment>) => {
      dispatch(updateComment({ contentId, commentId, updates }));
      dispatch(addNotification({
        type: 'success',
        title: 'Comment updated',
        message: 'Your comment has been updated successfully.',
        autoHide: true,
      }));
    }, [dispatch, contentId]),

    deleteComment: useCallback((commentId: string) => {
      dispatch(deleteComment({ contentId, commentId }));
      dispatch(addNotification({
        type: 'success',
        title: 'Comment deleted',
        message: 'The comment has been deleted successfully.',
        autoHide: true,
      }));
    }, [dispatch, contentId]),

    setCommentCount: useCallback((count: number) => {
      dispatch(setCommentCount({ contentId, count }));
    }, [dispatch, contentId]),

    incrementCount: useCallback(() => {
      dispatch(incrementCommentCount(contentId));
    }, [dispatch, contentId]),

    decrementCount: useCallback(() => {
      dispatch(decrementCommentCount(contentId));
    }, [dispatch, contentId]),

    setStats: useCallback((stats: CommentStats) => {
      dispatch(setCommentStats({ contentId, stats }));
    }, [dispatch, contentId]),

    toggleExpanded: useCallback(() => {
      dispatch(toggleSection(contentId));
    }, [dispatch, contentId]),

    setLoading: useCallback((loading: boolean) => {
      dispatch(setLoading({ id: contentId, loading }));
    }, [dispatch, contentId]),

    setError: useCallback((error: string) => {
      dispatch(setError({ id: contentId, error }));
    }, [dispatch, contentId]),

    clearError: useCallback(() => {
      dispatch(clearError(contentId));
    }, [dispatch, contentId]),
  };

  return {
    // Data
    comments,
    threadedComments,
    commentCount,
    commentStats,
    
    // UI State
    isExpanded,
    isLoading,
    error,
    
    // Actions
    ...actions,
  };
}

// Hook for managing individual comment state
export function useReduxCommentItem(contentId: string, commentId: string) {
  const dispatch = useAppDispatch();
  
  const draft = useAppSelector(state => selectDraft(state, commentId));
  const isEditing = useAppSelector(state => selectIsEditing(state, commentId));
  const isReplying = useAppSelector(state => selectIsReplying(state, commentId));
  const isLoading = useAppSelector(state => selectIsLoading(state, commentId));
  const error = useAppSelector(state => selectError(state, commentId));

  const actions = {
    setDraft: useCallback((content: string) => {
      dispatch(setDraft({ id: commentId, content }));
    }, [dispatch, commentId]),

    clearDraft: useCallback(() => {
      dispatch(clearDraft(commentId));
    }, [dispatch, commentId]),

    startEditing: useCallback(() => {
      dispatch(startEditing(commentId));
    }, [dispatch, commentId]),

    stopEditing: useCallback(() => {
      dispatch(stopEditing(commentId));
      dispatch(clearDraft(commentId));
    }, [dispatch, commentId]),

    startReplying: useCallback(() => {
      dispatch(startReplying(commentId));
    }, [dispatch, commentId]),

    stopReplying: useCallback(() => {
      dispatch(stopReplying(commentId));
    }, [dispatch, commentId]),

    setLoading: useCallback((loading: boolean) => {
      dispatch(setLoading({ id: commentId, loading }));
    }, [dispatch, commentId]),

    setError: useCallback((error: string) => {
      dispatch(setError({ id: commentId, error }));
    }, [dispatch, commentId]),

    clearError: useCallback(() => {
      dispatch(clearError(commentId));
    }, [dispatch, commentId]),
  };

  return {
    // State
    draft,
    isEditing,
    isReplying,
    isLoading,
    error,
    
    // Actions
    ...actions,
  };
}

// Hook for global comment notifications
export function useReduxCommentNotifications() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);

  const actions = {
    addNotification: useCallback((notification: {
      type: 'success' | 'error' | 'info' | 'warning';
      title: string;
      message: string;
      autoHide?: boolean;
    }) => {
      dispatch(addNotification(notification));
    }, [dispatch]),

    removeNotification: useCallback((id: string) => {
      dispatch(removeNotification(id));
    }, [dispatch]),

    clearNotifications: useCallback(() => {
      dispatch(clearNotifications());
    }, [dispatch]),
  };

  return {
    notifications,
    ...actions,
  };
}

// Hook for comment count only (lightweight)
export function useReduxCommentCount(contentId: string) {
  const dispatch = useAppDispatch();
  const count = useAppSelector(state => selectCommentCountForContent(state, contentId));

  const updateCount = useCallback((newCount: number) => {
    dispatch(setCommentCount({ contentId, count: newCount }));
  }, [dispatch, contentId]);

  return {
    count,
    updateCount,
  };
}
