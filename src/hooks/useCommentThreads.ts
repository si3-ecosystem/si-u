"use client";

import { useState, useCallback, useMemo } from 'react';
import { Comment } from '@/types/comment';

interface UseCommentThreadsOptions {
  comments: Comment[];
  maxDepth?: number;
  sortBy?: 'newest' | 'oldest' | 'popular';
}

interface UseCommentThreadsReturn {
  // Threaded data
  threadedComments: Comment[];
  flatComments: Comment[];
  
  // Thread management
  expandedThreads: Set<string>;
  toggleThread: (commentId: string) => void;
  expandAllThreads: () => void;
  collapseAllThreads: () => void;
  
  // Navigation
  findComment: (commentId: string) => Comment | null;
  getCommentPath: (commentId: string) => string[];
  getParentComment: (commentId: string) => Comment | null;
  getChildComments: (commentId: string) => Comment[];
  
  // Statistics
  threadStats: {
    totalThreads: number;
    maxDepth: number;
    averageDepth: number;
    totalReplies: number;
  };
  
  // Sorting
  sortBy: 'newest' | 'oldest' | 'popular';
  setSortBy: (sort: 'newest' | 'oldest' | 'popular') => void;
}

export function useCommentThreads({
  comments,
  maxDepth = 5,
  sortBy: initialSortBy = 'newest',
}: UseCommentThreadsOptions): UseCommentThreadsReturn {
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>(initialSortBy);

  // Create a map for quick comment lookup
  const commentMap = useMemo(() => {
    const map = new Map<string, Comment>();
    comments.forEach(comment => {
      map.set(comment._id, comment);
    });
    return map;
  }, [comments]);

  // Build threaded structure
  const threadedComments = useMemo(() => {
    // Separate top-level comments and replies
    const topLevel: Comment[] = [];
    const replies: Comment[] = [];

    comments.forEach(comment => {
      if (comment.parentCommentId) {
        replies.push(comment);
      } else {
        topLevel.push(comment);
      }
    });

    // Sort function
    const sortComments = (a: Comment, b: Comment) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          return (b.likeCount - b.dislikeCount) - (a.likeCount - a.dislikeCount);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    };

    // Build reply tree
    const buildReplies = (parentId: string, depth = 0): Comment[] => {
      if (depth >= maxDepth) return [];
      
      const childReplies = replies
        .filter(reply => reply.parentCommentId === parentId)
        .sort(sortComments)
        .map(reply => ({
          ...reply,
          replies: buildReplies(reply._id, depth + 1),
        }));

      return childReplies;
    };

    // Build complete threaded structure
    const threaded = topLevel
      .sort(sortComments)
      .map(comment => ({
        ...comment,
        replies: buildReplies(comment._id),
      }));

    return threaded;
  }, [comments, sortBy, maxDepth]);

  // Flatten comments for search/navigation
  const flatComments = useMemo(() => {
    const flatten = (comments: Comment[]): Comment[] => {
      const result: Comment[] = [];
      
      comments.forEach(comment => {
        result.push(comment);
        if (comment.replies) {
          result.push(...flatten(comment.replies));
        }
      });
      
      return result;
    };

    return flatten(threadedComments);
  }, [threadedComments]);

  // Thread management
  const toggleThread = useCallback((commentId: string) => {
    setExpandedThreads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  }, []);

  const expandAllThreads = useCallback(() => {
    const allCommentIds = new Set(flatComments.map(comment => comment._id));
    setExpandedThreads(allCommentIds);
  }, [flatComments]);

  const collapseAllThreads = useCallback(() => {
    setExpandedThreads(new Set());
  }, []);

  // Navigation helpers
  const findComment = useCallback((commentId: string): Comment | null => {
    return commentMap.get(commentId) || null;
  }, [commentMap]);

  const getCommentPath = useCallback((commentId: string): string[] => {
    const path: string[] = [];
    let currentComment = findComment(commentId);
    
    while (currentComment) {
      path.unshift(currentComment._id);
      if (currentComment.parentCommentId) {
        currentComment = findComment(currentComment.parentCommentId);
      } else {
        break;
      }
    }
    
    return path;
  }, [findComment]);

  const getParentComment = useCallback((commentId: string): Comment | null => {
    const comment = findComment(commentId);
    if (!comment?.parentCommentId) return null;
    return findComment(comment.parentCommentId);
  }, [findComment]);

  const getChildComments = useCallback((commentId: string): Comment[] => {
    return flatComments.filter(comment => comment.parentCommentId === commentId);
  }, [flatComments]);

  // Calculate thread statistics
  const threadStats = useMemo(() => {
    const calculateDepth = (comments: Comment[], currentDepth = 0): number => {
      let maxDepth = currentDepth;
      
      comments.forEach(comment => {
        if (comment.replies && comment.replies.length > 0) {
          const childDepth = calculateDepth(comment.replies, currentDepth + 1);
          maxDepth = Math.max(maxDepth, childDepth);
        }
      });
      
      return maxDepth;
    };

    const calculateAverageDepth = (comments: Comment[], depths: number[] = [], currentDepth = 0): number[] => {
      comments.forEach(comment => {
        depths.push(currentDepth);
        if (comment.replies && comment.replies.length > 0) {
          calculateAverageDepth(comment.replies, depths, currentDepth + 1);
        }
      });
      
      return depths;
    };

    const topLevelComments = threadedComments.filter(comment => !comment.parentCommentId);
    const allReplies = flatComments.filter(comment => comment.parentCommentId);
    const maxThreadDepth = calculateDepth(threadedComments);
    const depths = calculateAverageDepth(flatComments);
    const averageDepth = depths.length > 0 ? depths.reduce((a, b) => a + b, 0) / depths.length : 0;

    return {
      totalThreads: topLevelComments.length,
      maxDepth: maxThreadDepth,
      averageDepth: Math.round(averageDepth * 100) / 100,
      totalReplies: allReplies.length,
    };
  }, [threadedComments, flatComments]);

  return {
    // Threaded data
    threadedComments,
    flatComments,
    
    // Thread management
    expandedThreads,
    toggleThread,
    expandAllThreads,
    collapseAllThreads,
    
    // Navigation
    findComment,
    getCommentPath,
    getParentComment,
    getChildComments,
    
    // Statistics
    threadStats,
    
    // Sorting
    sortBy,
    setSortBy,
  };
}
