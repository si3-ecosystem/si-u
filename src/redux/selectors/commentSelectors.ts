import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Comment, CommentStats } from '@/types/comment';

// Base selectors
export const selectCommentState = (state: RootState) => state.comments;

export const selectCommentsByContent = (state: RootState) => state.comments.commentsByContent;
export const selectCommentCounts = (state: RootState) => state.comments.commentCounts;
export const selectCommentStats = (state: RootState) => state.comments.commentStats;
export const selectExpandedSections = (state: RootState) => state.comments.expandedSections;
export const selectLoadingStates = (state: RootState) => state.comments.loadingStates;
export const selectErrors = (state: RootState) => state.comments.errors;
export const selectNotifications = (state: RootState) => state.comments.notifications;
export const selectDrafts = (state: RootState) => state.comments.drafts;
export const selectEditingComments = (state: RootState) => state.comments.editingComments;
export const selectReplyingToComments = (state: RootState) => state.comments.replyingToComments;

// Parameterized selectors
export const selectCommentsForContent = createSelector(
  [selectCommentsByContent, (_state: RootState, contentId: string) => contentId],
  (commentsByContent, contentId) => commentsByContent[contentId] || []
);

export const selectCommentCountForContent = createSelector(
  [selectCommentCounts, (_state: RootState, contentId: string) => contentId],
  (commentCounts, contentId) => commentCounts[contentId] || 0
);

export const selectCommentStatsForContent = createSelector(
  [selectCommentStats, (_state: RootState, contentId: string) => contentId],
  (commentStats, contentId): CommentStats | null => commentStats[contentId] || null
);

export const selectIsContentSectionExpanded = createSelector(
  [selectExpandedSections, (_state: RootState, contentId: string) => contentId],
  (expandedSections, contentId) => expandedSections.includes(contentId)
);

export const selectIsLoading = createSelector(
  [selectLoadingStates, (_state: RootState, id: string) => id],
  (loadingStates, id) => loadingStates[id] || false
);

export const selectError = createSelector(
  [selectErrors, (_state: RootState, id: string) => id],
  (errors, id) => errors[id] || null
);

export const selectDraft = createSelector(
  [selectDrafts, (_state: RootState, id: string) => id],
  (drafts, id) => drafts[id] || ''
);

export const selectIsEditing = createSelector(
  [selectEditingComments, (_state: RootState, commentId: string) => commentId],
  (editingComments, commentId) => editingComments.includes(commentId)
);

export const selectIsReplying = createSelector(
  [selectReplyingToComments, (_state: RootState, commentId: string) => commentId],
  (replyingToComments, commentId) => replyingToComments.includes(commentId)
);

// Complex selectors
// Sorting function
const sortComments = (comments: Comment[], sortBy: 'newest' | 'oldest' | 'popular' = 'newest'): Comment[] => {
  return [...comments].sort((a: Comment, b: Comment) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'popular':
        return (b.likeCount - b.dislikeCount) - (a.likeCount - a.dislikeCount);
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
};

export const selectThreadedCommentsForContent = createSelector(
  [selectCommentsForContent],
  (comments) => {
    console.log('selectThreadedCommentsForContent: Input comments:', comments.length);

    // Check if comments already have replies populated (from API)
    const hasPreThreadedReplies = comments.some((comment: Comment) =>
      comment.replies && comment.replies.length > 0
    );

    if (hasPreThreadedReplies) {
      console.log('selectThreadedCommentsForContent: Using pre-threaded API data');
      // Filter to only top-level comments since replies are already nested
      const topLevelComments = comments.filter((comment: Comment) => !comment.isReply && !comment.parentCommentId);
      console.log('selectThreadedCommentsForContent: Found', topLevelComments.length, 'top-level comments with pre-threaded replies');

      // Sort top-level comments (default: newest first)
      const sortedComments = sortComments(topLevelComments, 'newest');

      return sortedComments;
    }

    // Build threaded structure from flat comments
    console.log('selectThreadedCommentsForContent: Building threaded structure from flat comments');
    const topLevel: Comment[] = [];
    const replies: Comment[] = [];

    comments.forEach((comment: Comment) => {
      // More robust check for replies
      const isReply = comment.isReply === true || (comment.parentCommentId && comment.parentCommentId.trim() !== '');

      if (isReply) {
        replies.push(comment);
        console.log(`Found reply: ${comment._id} -> parent: ${comment.parentCommentId}`);
      } else {
        topLevel.push(comment);
        console.log(`Found top-level: ${comment._id}`);
      }
    });

    console.log('selectThreadedCommentsForContent: Split into', {
      topLevel: topLevel.length,
      replies: replies.length,
      repliesDetails: replies.map(r => ({ id: r._id, parentId: r.parentCommentId }))
    });

    // Build reply tree
    const buildReplies = (parentId: string, depth = 0): Comment[] => {
      if (depth >= 5) return []; // Max depth

      console.log(`buildReplies: Looking for replies to ${parentId}, available replies:`,
        replies.map(r => ({ id: r._id, parentId: r.parentCommentId }))
      );

      const childReplies = replies
        .filter(reply => {
          const matches = reply.parentCommentId === parentId;
          if (matches) {
            console.log(`buildReplies: Found match - ${reply._id} is child of ${parentId}`);
          }
          return matches;
        })
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map(reply => ({
          ...reply,
          replies: buildReplies(reply._id, depth + 1),
        }));

      if (childReplies.length > 0) {
        console.log(`buildReplies: Built ${childReplies.length} replies for parent ${parentId}`);
      } else {
        console.log(`buildReplies: No replies found for parent ${parentId}`);
      }

      return childReplies;
    };

    // Build complete threaded structure
    const threaded = topLevel
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(comment => {
        const commentReplies = buildReplies(comment._id);
        console.log(`Comment ${comment._id} has ${commentReplies.length} replies`);
        return {
          ...comment,
          replies: commentReplies,
        };
      });

    console.log('selectThreadedCommentsForContent: Final threaded structure:',
      threaded.map(c => ({ id: c._id, repliesCount: c.replies?.length || 0 }))
    );

    return threaded;
  }
);

// Parameterized selector for sorted threaded comments
export const selectSortedThreadedCommentsForContent = createSelector(
  [
    selectCommentsForContent,
    (_state: RootState, _contentId: string, sortBy: 'newest' | 'oldest' | 'popular' = 'newest') => sortBy
  ],
  (comments, sortBy) => {
    console.log('selectSortedThreadedCommentsForContent: Sorting by', sortBy);

    // Check if comments already have replies populated (from API)
    const hasPreThreadedReplies = comments.some((comment: Comment) =>
      comment.replies && comment.replies.length > 0
    );

    if (hasPreThreadedReplies) {
      console.log('selectSortedThreadedCommentsForContent: Using pre-threaded API data');
      // Filter to only top-level comments since replies are already nested
      const topLevelComments = comments.filter((comment: Comment) => !comment.isReply && !comment.parentCommentId);

      // Sort top-level comments
      const sortedComments = sortComments(topLevelComments, sortBy);

      return sortedComments;
    }

    // Build threaded structure from flat comments and sort
    const topLevel: Comment[] = [];
    const replies: Comment[] = [];

    comments.forEach((comment: Comment) => {
      const isReply = comment.isReply === true || (comment.parentCommentId && comment.parentCommentId.trim() !== '');

      if (isReply) {
        replies.push(comment);
      } else {
        topLevel.push(comment);
      }
    });

    // Build reply tree (same as before)
    const buildReplies = (parentId: string, depth = 0): Comment[] => {
      if (depth >= 5) return [];

      const childReplies = replies
        .filter(reply => reply.parentCommentId === parentId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map(reply => ({
          ...reply,
          replies: buildReplies(reply._id, depth + 1),
        }));

      return childReplies;
    };

    // Build complete threaded structure with sorting
    const threaded = sortComments(topLevel, sortBy).map(comment => ({
      ...comment,
      replies: buildReplies(comment._id),
    }));

    return threaded;
  }
);

export const selectCommentById = createSelector(
  [
    selectCommentsByContent,
    (_state: RootState, contentId: string, commentId: string) => ({ contentId, commentId })
  ],
  (commentsByContent, { contentId, commentId }) => {
    const comments = commentsByContent[contentId] || [];
    return comments.find((comment: Comment) => comment._id === commentId) || null;
  }
);

export const selectTotalCommentsAcrossContent = createSelector(
  [selectCommentCounts],
  (commentCounts): number => {
    const counts = Object.values(commentCounts) as number[];
    return counts.reduce((total: number, count: number) => total + count, 0);
  }
);

export const selectActiveNotifications = createSelector(
  [selectNotifications],
  (notifications) => {
    const now = Date.now();
    return notifications.filter((notification: any) => {
      // Auto-hide notifications after 5 seconds
      if (notification.autoHide !== false) {
        return now - notification.timestamp < 5000;
      }
      return true;
    });
  }
);

export const selectHasDraftChanges = createSelector(
  [
    selectDrafts,
    selectCommentsByContent,
    (_state: RootState, contentId: string, commentId: string) => ({ contentId, commentId })
  ],
  (drafts, commentsByContent, { contentId, commentId }) => {
    const draft = drafts[commentId];
    const comments = commentsByContent[contentId] || [];
    const comment = comments.find((c: Comment) => c._id === commentId);

    if (!draft || !comment) return false;

    return draft.trim() !== comment.content.trim();
  }
);

// Aggregate selectors for dashboard/analytics
export const selectCommentAnalytics = createSelector(
  [selectCommentCounts, selectCommentStats],
  (commentCounts, commentStats) => {
    const totalContent = Object.keys(commentCounts).length;
    const counts = Object.values(commentCounts) as number[];
    const totalComments = counts.reduce((sum: number, count: number) => sum + count, 0);
    const averageCommentsPerContent = totalContent > 0 ? totalComments / totalContent : 0;

    const allStats = Object.values(commentStats) as CommentStats[];
    const totalUniqueUsers = allStats.reduce((sum: number, stats: CommentStats) => sum + stats.uniqueUserCount, 0);

    return {
      totalContent,
      totalComments,
      averageCommentsPerContent: Math.round(averageCommentsPerContent * 100) / 100,
      totalUniqueUsers,
      contentWithComments: counts.filter((count: number) => count > 0).length,
    };
  }
);
