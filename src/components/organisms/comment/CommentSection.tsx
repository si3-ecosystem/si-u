"use client";

import React, { useState } from 'react';
import { CommentItem } from './CommentItem';
import { CommentForm } from '@/components/molecules/comment/CommentForm';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useComments } from '@/hooks/useComments';
import { useReduxComments } from '@/hooks/useReduxComments';
import { CommentSectionProps } from '@/types/comment';
import { useAppSelector } from '@/redux/store';
import { CommentDebugger } from './CommentDebugger';

export function CommentSection({
  contentId,
  contentType,
  userRole,
  showStats = true,
  autoRefresh = false,
  maxDepth = 3,
  pageSize = 20,
}: CommentSectionProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use both hooks - React Query for API operations and Redux for state management
  const {
    comments: apiComments,
    stats: apiStats,
    loading,
    error,
    pagination,
    createComment: apiCreateComment,
    updateComment: apiUpdateComment,
    deleteComment: apiDeleteComment,
    loadMore,
    refresh,
    isCreating,
  } = useComments({
    contentId,
    contentType,
    page: 1,
    limit: pageSize,
    threaded: true,
    autoRefresh,
  });

  // Redux state management
  const {
    comments: reduxComments,
    threadedComments,
    commentCount,
    commentStats,
    isExpanded: isReduxExpanded,
    setComments,
    addComment: reduxAddComment,
    updateComment: reduxUpdateComment,
    deleteComment: reduxDeleteComment,
    setStats,
    toggleExpanded,
  } = useReduxComments(contentId, sortBy);

  // Sync API data with Redux - always use fresh API data as source of truth
  React.useEffect(() => {
    if (apiComments.length > 0) {
      console.log('CommentSection: Syncing API comments to Redux');
      setComments(apiComments);

      // Update stats if available
      if (apiStats) {
        setStats(apiStats);
      }
    }
  }, [apiComments, apiStats, setComments, setStats]);

  React.useEffect(() => {
    if (apiStats) {
      setStats(apiStats);
    }
  }, [apiStats, setStats]);

  // Use Redux data for rendering, API hooks for operations
  // Always prefer threaded comments when available, fall back to flat comments
  const comments = threadedComments.length > 0 ? threadedComments :
                   reduxComments.length > 0 ? reduxComments :
                   apiComments;
  const stats = commentStats || apiStats;

  // Debug logging (can be removed in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('CommentSection Debug:', {
      reduxCommentsCount: reduxComments.length,
      threadedCommentsCount: threadedComments.length,
      apiCommentsCount: apiComments.length,
      finalCommentsCount: comments.length,
      sortBy,
      threadedComments: threadedComments.map(c => ({
        id: c._id,
        content: c.content.substring(0, 30),
        repliesCount: c.replies?.length || 0,
        isReply: c.isReply,
        parentId: c.parentCommentId
      }))
    });
  }

  // Use Redux expanded state, default to true if not set
  const isExpanded = isReduxExpanded !== undefined ? isReduxExpanded : true;

  // Get current user ID from Redux auth state
  const currentUser = useAppSelector(state => state.user);
  const currentUserId = currentUser?._id || currentUser?.id || '';

  // Check if user can access this content type
  const canAccess = () => {
    const accessMap = {
      guide_session: ['guide', 'admin'],
      guide_ideas_lab: ['guide', 'admin'],
      scholar_session: ['scholar', 'admin'],
      scholar_ideas_lab: ['scholar', 'admin'],
    };
    return accessMap[contentType]?.includes(userRole);
  };

  const handleCreateComment = async (content: string) => {
    const newComment = await apiCreateComment(content);
    if (newComment) {
      console.log('handleCreateComment: Comment created successfully, refreshing comments');
      // Force refresh to get updated data with proper counts from backend
      refresh();
    }
  };

  const handleReply = async (content: string, parentCommentId: string) => {
    if (isSubmitting) {
      console.log('handleReply: Already submitting, ignoring duplicate call');
      return;
    }

    console.log('handleReply: Creating reply', { content, parentCommentId });
    setIsSubmitting(true);

    try {
      const newComment = await apiCreateComment(content, parentCommentId);
      if (newComment) {
        console.log('handleReply: Reply created successfully, refreshing comments');
        // Force immediate refresh to get updated data with proper counts from backend
        await refresh();
        console.log('handleReply: Comments refreshed, reply should now be visible');
      }
    } catch (error) {
      console.error('handleReply: Failed to create reply', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (commentId: string, content: string) => {
    const updatedComment = await apiUpdateComment(commentId, content);
    if (updatedComment) {
      reduxUpdateComment(commentId, updatedComment);
    }
  };

  const handleDelete = async (commentId: string) => {
    const success = await apiDeleteComment(commentId);
    if (success) {
      reduxDeleteComment(commentId);
    }
  };

  if (!canAccess()) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">
          You don't have permission to view comments for this content.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">Error loading comments: {error}</p>
        <Button onClick={refresh} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  const totalComments = stats?.totalComments || commentCount || 0;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Discussion
            </h3>

            {showStats && stats && (
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {totalComments} {totalComments === 1 ? 'comment' : 'comments'}
                </span>

                {stats.uniqueUserCount > 0 && (
                  <span>
                    {stats.uniqueUserCount} {stats.uniqueUserCount === 1 ? 'participant' : 'participants'}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Sort controls */}
          {comments.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular')}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          )}
        </div>

        {/* Collapse/Expand button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleExpanded}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Collapse
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Expand
            </>
          )}
        </Button>
      </div>

      {isExpanded && (
        <>
          {/* Debug info */}
          <CommentDebugger contentId={contentId} />

          {/* Comment form */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <CommentForm
              onSubmit={handleCreateComment}
              placeholder="Share your thoughts about this content..."
              isSubmitting={isCreating}
              minHeight="min-h-[100px]"
            />
          </div>

          {/* Sort options */}
          {comments.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <div className="flex gap-1">
                {(['newest', 'oldest', 'popular'] as const).map((option) => (
                  <Button
                    key={option}
                    variant={sortBy === option ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSortBy(option)}
                    className="h-7 px-3 text-xs"
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Comments list */}
          {loading && comments.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-500">Loading comments...</span>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No comments yet</p>
              <p className="text-sm text-gray-400">
                Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  currentUserId={currentUserId}
                  maxDepth={maxDepth}
                  onReply={handleReply}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}

              {/* Load more button */}
              {pagination?.hasNextPage && (
                <div className="text-center pt-4">
                  <Button
                    onClick={loadMore}
                    variant="outline"
                    disabled={loading}
                    className="min-w-[120px]"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      'Load More Comments'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
