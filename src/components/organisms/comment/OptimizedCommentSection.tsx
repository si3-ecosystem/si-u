"use client";

import React, { useState, useMemo } from "react";
const motion = {
  div: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
};
const AnimatePresence = ({ children }: any) => children;
import {
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  // Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CommentErrorBoundary } from "./CommentErrorBoundary";
import { useOptimizedComments } from "@/hooks/useOptimizedComments";
import { ContentType, UserRole } from "@/types/comment";
import { cn } from "@/lib/utils";
import { useCurrentUserV2 } from "@/hooks/auth/useCurrentUserV2";
import { OptimizedCommentForm } from "./OptimizedCommentForm";
import { OptimizedCommentItem } from "./OptimizedCommentItem";
import { useResponsive } from "@/hooks/useResponsive";

interface OptimizedCommentSectionProps {
  contentId: string;
  contentType: ContentType;
  userRole: UserRole;
  showStats?: boolean;
  maxDepth?: number;
  pageSize?: number;
  className?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function OptimizedCommentSection({
  contentId,
  contentType,
  userRole,
  showStats = true,
  maxDepth = 3,
  pageSize = 20,
  className = "",
  autoRefresh = false,
  refreshInterval = 30000,
}: OptimizedCommentSectionProps) {
  const { isSmallMobile } = useResponsive();

  const [isExpanded, setIsExpanded] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">(
    "newest"
  );

  const { user, isAuthenticated } = useCurrentUserV2();

  const currentUserId = user?._id || (user as any)?.id || "anonymous";

  const {
    comments,
    stats,
    pagination,
    isLoading,
    isLoadingStats,
    isFetching,
    error,
    createComment,
    updateComment,
    deleteComment,
    isCreating,
    isUpdating,
    isDeleting,
    refetch,
  } = useOptimizedComments({
    contentId,
    contentType,
    page: 1,
    limit: pageSize,
    enabled: true,
    staleTime: autoRefresh ? refreshInterval : 5 * 60 * 1000,
  });

  const canAccess = useMemo(() => {
    const accessMap = {
      guide_session: ["guide", "admin"],
      guide_ideas_lab: ["guide", "admin"],
      scholar_session: ["scholar", "admin"],
      scholar_ideas_lab: ["scholar", "admin"],
      "grow3dge-idea-lab": ["partner", "admin"],
    } as Record<ContentType, UserRole[]> & { [key: string]: UserRole[] };
    return accessMap[contentType]?.includes(userRole);
  }, [contentType, userRole]);

  const sortedComments = useMemo(() => {
    if (!comments.length) return [];

    const sorted = [...comments].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "popular":
          return b.likeCount - b.dislikeCount - (a.likeCount - a.dislikeCount);
        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return sorted;
  }, [comments, sortBy]);

  const handleCreateComment = async (content: string) => {
    try {
      await createComment({ content });
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const handleReply = async (content: string, parentCommentId: string) => {
    try {
      await createComment({ content, parentCommentId });
    } catch (error) {
      console.error("Failed to create reply:", error);
    }
  };

  const handleEdit = async (commentId: string, content: string) => {
    try {
      await updateComment(commentId, { content });
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  if (!canAccess) {
    return (
      <div
        className={cn(
          "bg-gray-50 border border-gray-200 rounded-lg p-6 text-center",
          className
        )}
      >
        <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">
          You don&apos;t have permission to view comments for this content.
        </p>
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load comments. Please try again.
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="ml-2"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <CommentErrorBoundary>
        <div className={cn("space-y-6", className)}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Comments
                {showStats && stats && (
                  <span className="flex items-center">
                    (
                    <div className="text-base ">
                      {stats.analytics.totalComments}
                    </div>
                    )
                  </span>
                )}
              </h3>
              {(isFetching || isLoadingStats) && (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>

            <div className="flex max-sm:justify-between items-center gap-2">
              {sortedComments.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as "newest" | "oldest" | "popular"
                      )
                    }
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-500 hover:text-gray-700 max-sm:hidden"
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
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={cn("space-y-6", isSmallMobile && "space-y-4")}
              >
                <div
                  className={cn(
                    "bg-white rounded-lg",
                  )}
                >
                  <OptimizedCommentForm
                    onSubmit={handleCreateComment}
                    placeholder="Share your thoughts about this content..."
                    isSubmitting={isCreating}
                    minHeight="min-h-[100px]"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      <span className="ml-2 text-gray-600">
                        Loading comments...
                      </span>
                    </div>
                  ) : sortedComments.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        No comments yet
                      </h4>
                      <p className="text-sm text-gray-400">
                        Be the first to share your thoughts!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6 divide-y divide-gray-200">
                      {sortedComments.map((comment) => (
                        <OptimizedCommentItem
                          key={comment._id}
                          comment={comment}
                          contentId={contentId}
                          contentType={contentType}
                          currentUserId={currentUserId}
                          depth={0}
                          maxDepth={maxDepth}
                          onReply={handleReply}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          isUpdating={isUpdating}
                          isDeleting={isDeleting}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {pagination && pagination.hasNextPage && (
                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={() => {}}
                      disabled={isFetching}
                    >
                      {isFetching ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading...
                        </>
                      ) : (
                        "Load More Comments"
                      )}
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CommentErrorBoundary>
    </>
  );
}
