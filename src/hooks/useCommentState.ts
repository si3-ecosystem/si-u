"use client";

import { useCallback, useReducer, useMemo } from 'react';
import { Comment } from '@/types/comment';

// Comment state management types
interface CommentState {
  comments: Record<string, Comment>;
  loading: Record<string, boolean>;
  errors: Record<string, string>;
  optimisticUpdates: Record<string, Partial<Comment>>;
  drafts: Record<string, string>;
  editingComments: Set<string>;
  replyingToComments: Set<string>;
}

type CommentAction =
  | { type: 'SET_COMMENTS'; payload: Comment[] }
  | { type: 'ADD_COMMENT'; payload: Comment }
  | { type: 'UPDATE_COMMENT'; payload: { id: string; updates: Partial<Comment> } }
  | { type: 'DELETE_COMMENT'; payload: string }
  | { type: 'SET_LOADING'; payload: { id: string; loading: boolean } }
  | { type: 'SET_ERROR'; payload: { id: string; error: string } }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'SET_OPTIMISTIC_UPDATE'; payload: { id: string; updates: Partial<Comment> } }
  | { type: 'CLEAR_OPTIMISTIC_UPDATE'; payload: string }
  | { type: 'SET_DRAFT'; payload: { id: string; content: string } }
  | { type: 'CLEAR_DRAFT'; payload: string }
  | { type: 'START_EDITING'; payload: string }
  | { type: 'STOP_EDITING'; payload: string }
  | { type: 'START_REPLYING'; payload: string }
  | { type: 'STOP_REPLYING'; payload: string };

const initialState: CommentState = {
  comments: {},
  loading: {},
  errors: {},
  optimisticUpdates: {},
  drafts: {},
  editingComments: new Set(),
  replyingToComments: new Set(),
};

function commentReducer(state: CommentState, action: CommentAction): CommentState {
  switch (action.type) {
    case 'SET_COMMENTS':
      return {
        ...state,
        comments: action.payload.reduce((acc, comment) => {
          acc[comment._id] = comment;
          return acc;
        }, {} as Record<string, Comment>),
      };

    case 'ADD_COMMENT':
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload._id]: action.payload,
        },
      };

    case 'UPDATE_COMMENT':
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.id]: {
            ...state.comments[action.payload.id],
            ...action.payload.updates,
          },
        },
      };

    case 'DELETE_COMMENT':
      const { [action.payload]: deleted, ...remainingComments } = state.comments;
      return {
        ...state,
        comments: remainingComments,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.id]: action.payload.loading,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.id]: action.payload.error,
        },
      };

    case 'CLEAR_ERROR':
      const { [action.payload]: clearedError, ...remainingErrors } = state.errors;
      return {
        ...state,
        errors: remainingErrors,
      };

    case 'SET_OPTIMISTIC_UPDATE':
      return {
        ...state,
        optimisticUpdates: {
          ...state.optimisticUpdates,
          [action.payload.id]: action.payload.updates,
        },
      };

    case 'CLEAR_OPTIMISTIC_UPDATE':
      const { [action.payload]: clearedUpdate, ...remainingUpdates } = state.optimisticUpdates;
      return {
        ...state,
        optimisticUpdates: remainingUpdates,
      };

    case 'SET_DRAFT':
      return {
        ...state,
        drafts: {
          ...state.drafts,
          [action.payload.id]: action.payload.content,
        },
      };

    case 'CLEAR_DRAFT':
      const { [action.payload]: clearedDraft, ...remainingDrafts } = state.drafts;
      return {
        ...state,
        drafts: remainingDrafts,
      };

    case 'START_EDITING':
      return {
        ...state,
        editingComments: new Set([...Array.from(state.editingComments), action.payload]),
      };

    case 'STOP_EDITING':
      const newEditingSet = new Set(state.editingComments);
      newEditingSet.delete(action.payload);
      return {
        ...state,
        editingComments: newEditingSet,
      };

    case 'START_REPLYING':
      return {
        ...state,
        replyingToComments: new Set([...Array.from(state.replyingToComments), action.payload]),
      };

    case 'STOP_REPLYING':
      const newReplyingSet = new Set(state.replyingToComments);
      newReplyingSet.delete(action.payload);
      return {
        ...state,
        replyingToComments: newReplyingSet,
      };

    default:
      return state;
  }
}

interface UseCommentStateOptions {
  initialComments?: Comment[];
}

interface UseCommentStateReturn {
  // State
  comments: Comment[];
  commentsById: Record<string, Comment>;
  loading: Record<string, boolean>;
  errors: Record<string, string>;
  drafts: Record<string, string>;
  editingComments: Set<string>;
  replyingToComments: Set<string>;

  // Actions
  setComments: (comments: Comment[]) => void;
  addComment: (comment: Comment) => void;
  updateComment: (id: string, updates: Partial<Comment>) => void;
  deleteComment: (id: string) => void;
  
  // Loading states
  setLoading: (id: string, loading: boolean) => void;
  isLoading: (id: string) => boolean;
  
  // Error handling
  setError: (id: string, error: string) => void;
  clearError: (id: string) => void;
  getError: (id: string) => string | null;
  
  // Optimistic updates
  setOptimisticUpdate: (id: string, updates: Partial<Comment>) => void;
  clearOptimisticUpdate: (id: string) => void;
  getOptimisticComment: (id: string) => Comment | null;
  
  // Draft management
  setDraft: (id: string, content: string) => void;
  clearDraft: (id: string) => void;
  getDraft: (id: string) => string;
  
  // UI state
  startEditing: (id: string) => void;
  stopEditing: (id: string) => void;
  isEditing: (id: string) => boolean;
  startReplying: (id: string) => void;
  stopReplying: (id: string) => void;
  isReplying: (id: string) => boolean;
  
  // Utilities
  getComment: (id: string) => Comment | null;
  hasChanges: (id: string) => boolean;
  resetState: () => void;
}

export function useCommentState({
  initialComments = [],
}: UseCommentStateOptions = {}): UseCommentStateReturn {
  const [state, dispatch] = useReducer(commentReducer, {
    ...initialState,
    comments: initialComments.reduce((acc, comment) => {
      acc[comment._id] = comment;
      return acc;
    }, {} as Record<string, Comment>),
  });

  // Convert comments object to array
  const comments = useMemo(() => Object.values(state.comments), [state.comments]);

  // Actions
  const setComments = useCallback((comments: Comment[]) => {
    dispatch({ type: 'SET_COMMENTS', payload: comments });
  }, []);

  const addComment = useCallback((comment: Comment) => {
    dispatch({ type: 'ADD_COMMENT', payload: comment });
  }, []);

  const updateComment = useCallback((id: string, updates: Partial<Comment>) => {
    dispatch({ type: 'UPDATE_COMMENT', payload: { id, updates } });
  }, []);

  const deleteComment = useCallback((id: string) => {
    dispatch({ type: 'DELETE_COMMENT', payload: id });
  }, []);

  // Loading states
  const setLoading = useCallback((id: string, loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: { id, loading } });
  }, []);

  const isLoading = useCallback((id: string) => {
    return state.loading[id] || false;
  }, [state.loading]);

  // Error handling
  const setError = useCallback((id: string, error: string) => {
    dispatch({ type: 'SET_ERROR', payload: { id, error } });
  }, []);

  const clearError = useCallback((id: string) => {
    dispatch({ type: 'CLEAR_ERROR', payload: id });
  }, []);

  const getError = useCallback((id: string) => {
    return state.errors[id] || null;
  }, [state.errors]);

  // Optimistic updates
  const setOptimisticUpdate = useCallback((id: string, updates: Partial<Comment>) => {
    dispatch({ type: 'SET_OPTIMISTIC_UPDATE', payload: { id, updates } });
  }, []);

  const clearOptimisticUpdate = useCallback((id: string) => {
    dispatch({ type: 'CLEAR_OPTIMISTIC_UPDATE', payload: id });
  }, []);

  const getOptimisticComment = useCallback((id: string): Comment | null => {
    const comment = state.comments[id];
    const optimisticUpdate = state.optimisticUpdates[id];
    
    if (!comment) return null;
    
    return optimisticUpdate ? { ...comment, ...optimisticUpdate } : comment;
  }, [state.comments, state.optimisticUpdates]);

  // Draft management
  const setDraft = useCallback((id: string, content: string) => {
    dispatch({ type: 'SET_DRAFT', payload: { id, content } });
  }, []);

  const clearDraft = useCallback((id: string) => {
    dispatch({ type: 'CLEAR_DRAFT', payload: id });
  }, []);

  const getDraft = useCallback((id: string) => {
    return state.drafts[id] || '';
  }, [state.drafts]);

  // UI state
  const startEditing = useCallback((id: string) => {
    dispatch({ type: 'START_EDITING', payload: id });
  }, []);

  const stopEditing = useCallback((id: string) => {
    dispatch({ type: 'STOP_EDITING', payload: id });
  }, []);

  const isEditing = useCallback((id: string) => {
    return state.editingComments.has(id);
  }, [state.editingComments]);

  const startReplying = useCallback((id: string) => {
    dispatch({ type: 'START_REPLYING', payload: id });
  }, []);

  const stopReplying = useCallback((id: string) => {
    dispatch({ type: 'STOP_REPLYING', payload: id });
  }, []);

  const isReplying = useCallback((id: string) => {
    return state.replyingToComments.has(id);
  }, [state.replyingToComments]);

  // Utilities
  const getComment = useCallback((id: string) => {
    return state.comments[id] || null;
  }, [state.comments]);

  const hasChanges = useCallback((id: string) => {
    const draft = state.drafts[id];
    const comment = state.comments[id];
    
    if (!draft || !comment) return false;
    
    return draft.trim() !== comment.content.trim();
  }, [state.drafts, state.comments]);

  const resetState = useCallback(() => {
    dispatch({ type: 'SET_COMMENTS', payload: [] });
  }, []);

  return {
    // State
    comments,
    commentsById: state.comments,
    loading: state.loading,
    errors: state.errors,
    drafts: state.drafts,
    editingComments: state.editingComments,
    replyingToComments: state.replyingToComments,

    // Actions
    setComments,
    addComment,
    updateComment,
    deleteComment,
    
    // Loading states
    setLoading,
    isLoading,
    
    // Error handling
    setError,
    clearError,
    getError,
    
    // Optimistic updates
    setOptimisticUpdate,
    clearOptimisticUpdate,
    getOptimisticComment,
    
    // Draft management
    setDraft,
    clearDraft,
    getDraft,
    
    // UI state
    startEditing,
    stopEditing,
    isEditing,
    startReplying,
    stopReplying,
    isReplying,
    
    // Utilities
    getComment,
    hasChanges,
    resetState,
  };
}
