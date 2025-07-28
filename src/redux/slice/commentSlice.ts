import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Comment, CommentStats } from '@/types/comment';

interface CommentNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: number;
  autoHide?: boolean;
}

interface CommentState {
  // Comment data by content ID
  commentsByContent: Record<string, Comment[]>;
  
  // Comment counts by content ID
  commentCounts: Record<string, number>;
  
  // Comment statistics by content ID
  commentStats: Record<string, CommentStats>;
  
  // UI state
  expandedSections: string[];
  loadingStates: Record<string, boolean>;
  errors: Record<string, string>;
  
  // Notifications
  notifications: CommentNotification[];
  
  // Draft management
  drafts: Record<string, string>;
  editingComments: string[];
  replyingToComments: string[];
}

const initialState: CommentState = {
  commentsByContent: {},
  commentCounts: {},
  commentStats: {},
  expandedSections: [],
  loadingStates: {},
  errors: {},
  notifications: [],
  drafts: {},
  editingComments: [],
  replyingToComments: [],
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // Comment data management
    setComments: (state, action: PayloadAction<{ contentId: string; comments: Comment[] }>) => {
      const { contentId, comments } = action.payload;

      console.log('Redux setComments:', {
        contentId,
        newCommentsCount: comments.length,
        existingCommentsCount: state.commentsByContent[contentId]?.length || 0
      });

      // Use comments as-is from API (they already have correct structure and counts)
      state.commentsByContent[contentId] = comments;

      // Calculate total count from top-level comments only (since API provides nested structure)
      const topLevelCount = comments.filter(comment => !comment.isReply && !comment.parentCommentId).length;
      state.commentCounts[contentId] = topLevelCount;

      console.log('Redux setComments: Set comments with top-level count:', topLevelCount);
    },

    addComment: (state, action: PayloadAction<{ contentId: string; comment: Comment }>) => {
      const { contentId, comment } = action.payload;

      console.log('Redux addComment: Adding comment (deprecated - use setComments with refresh instead):', {
        commentId: comment._id,
        contentId,
        isReply: comment.isReply,
      });

      if (!state.commentsByContent[contentId]) {
        state.commentsByContent[contentId] = [];
      }

      // Add comment as-is (API provides correct structure)
      state.commentsByContent[contentId].push(comment);

      // Don't manually calculate counts - let setComments handle this with fresh API data
    },

    updateComment: (state, action: PayloadAction<{ contentId: string; commentId: string; updates: Partial<Comment> }>) => {
      const { contentId, commentId, updates } = action.payload;
      const comments = state.commentsByContent[contentId];
      
      if (comments) {
        const commentIndex = comments.findIndex(c => c._id === commentId);
        if (commentIndex !== -1) {
          state.commentsByContent[contentId][commentIndex] = {
            ...comments[commentIndex],
            ...updates,
          };
        }
      }
    },

    deleteComment: (state, action: PayloadAction<{ contentId: string; commentId: string }>) => {
      const { contentId, commentId } = action.payload;
      const comments = state.commentsByContent[contentId];
      
      if (comments) {
        state.commentsByContent[contentId] = comments.filter(c => c._id !== commentId);
        state.commentCounts[contentId] = Math.max((state.commentCounts[contentId] || 0) - 1, 0);
      }
    },

    // Comment counts
    setCommentCount: (state, action: PayloadAction<{ contentId: string; count: number }>) => {
      const { contentId, count } = action.payload;
      state.commentCounts[contentId] = count;
    },

    incrementCommentCount: (state, action: PayloadAction<string>) => {
      const contentId = action.payload;
      state.commentCounts[contentId] = (state.commentCounts[contentId] || 0) + 1;
    },

    decrementCommentCount: (state, action: PayloadAction<string>) => {
      const contentId = action.payload;
      state.commentCounts[contentId] = Math.max((state.commentCounts[contentId] || 0) - 1, 0);
    },

    // Comment statistics
    setCommentStats: (state, action: PayloadAction<{ contentId: string; stats: CommentStats }>) => {
      const { contentId, stats } = action.payload;
      console.log('Redux setCommentStats: Setting stats from API:', { contentId, stats });
      state.commentStats[contentId] = stats;

      // Also update comment count from stats if available
      if (stats.totalComments !== undefined) {
        state.commentCounts[contentId] = stats.totalComments;
      }
    },

    // UI state management
    toggleSection: (state, action: PayloadAction<string>) => {
      const contentId = action.payload;
      const index = state.expandedSections.indexOf(contentId);
      
      if (index > -1) {
        state.expandedSections.splice(index, 1);
      } else {
        state.expandedSections.push(contentId);
      }
    },

    setLoading: (state, action: PayloadAction<{ id: string; loading: boolean }>) => {
      const { id, loading } = action.payload;
      if (loading) {
        state.loadingStates[id] = true;
      } else {
        delete state.loadingStates[id];
      }
    },

    setError: (state, action: PayloadAction<{ id: string; error: string }>) => {
      const { id, error } = action.payload;
      state.errors[id] = error;
    },

    clearError: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.errors[id];
    },

    // Notifications
    addNotification: (state, action: PayloadAction<Omit<CommentNotification, 'id' | 'timestamp'>>) => {
      const notification: CommentNotification = {
        ...action.payload,
        id: Math.random().toString(36).substring(2, 11),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.notifications = state.notifications.filter(n => n.id !== id);
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Draft management
    setDraft: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const { id, content } = action.payload;
      state.drafts[id] = content;
    },

    clearDraft: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.drafts[id];
    },

    // Editing state
    startEditing: (state, action: PayloadAction<string>) => {
      const commentId = action.payload;
      if (!state.editingComments.includes(commentId)) {
        state.editingComments.push(commentId);
      }
    },

    stopEditing: (state, action: PayloadAction<string>) => {
      const commentId = action.payload;
      state.editingComments = state.editingComments.filter(id => id !== commentId);
    },

    // Replying state
    startReplying: (state, action: PayloadAction<string>) => {
      const commentId = action.payload;
      if (!state.replyingToComments.includes(commentId)) {
        state.replyingToComments.push(commentId);
      }
    },

    stopReplying: (state, action: PayloadAction<string>) => {
      const commentId = action.payload;
      state.replyingToComments = state.replyingToComments.filter(id => id !== commentId);
    },

    // Reset state
    resetCommentState: () => initialState,
  },
});

export const {
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
  resetCommentState,
} = commentSlice.actions;

export default commentSlice.reducer;
