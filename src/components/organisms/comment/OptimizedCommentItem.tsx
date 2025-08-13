"use client";

import React, { useState, useMemo } from 'react';
// Simple fallback for framer-motion
const motion = {
  div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
};
const AnimatePresence = ({ children }: any) => children;
import { 
  ThumbsUp, 
  ThumbsDown, 
  Reply, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { CommentAvatar } from '@/components/atoms/comment/CommentAvatar';
import { CommentTimestamp } from '@/components/atoms/comment/CommentTimestamp';
import { useOptimizedCommentReactions } from '@/hooks/useOptimizedCommentReactions';
import { Comment, ContentType } from '@/types/comment';
import { cn } from '@/lib/utils';
import { getResponsiveDisplayName } from '@/lib/utils/username';
import { useResponsive } from '@/hooks/useResponsive';
import { OptimizedCommentForm } from './OptimizedCommentForm';

interface OptimizedCommentItemProps {
  comment: Comment;
  contentId: string;
  contentType: ContentType;
  currentUserId: string;
  depth?: number;
  maxDepth?: number;
  onReply?: (content: string, parentCommentId: string) => Promise<void>;
  onEdit?: (commentId: string, content: string) => Promise<void>;
  onDelete?: (commentId: string) => Promise<void>;
  isUpdating?: boolean;
  isDeleting?: boolean;
  className?: string;
}

export function OptimizedCommentItem({
  comment,
  contentId,
  contentType,
  currentUserId,
  depth = 0,
  maxDepth = 3,
  onReply,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
  className = '',
}: OptimizedCommentItemProps) {
  const {  isSmallMobile } = useResponsive();

  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const {
    isReacting,
    toggleLike,
    toggleDislike,
    hasLiked,
    hasDisliked,
  } = useOptimizedCommentReactions({
    commentId: comment._id,
    contentId,
    contentType,
  });

  const canReply = useMemo(() => {
    return depth === 0 && !!onReply;
  }, [depth, onReply]);

  const canEdit = useMemo(() => comment.userId === currentUserId && !!onEdit, [comment.userId, currentUserId, onEdit]);
  const canDelete = useMemo(() => comment.userId === currentUserId && !!onDelete, [comment.userId, currentUserId, onDelete]);

  const handleEdit = async (newContent: string) => {
    if (!onEdit || !newContent.trim()) return;

    try {
      await onEdit(comment._id, newContent.trim());
      setEditContent(newContent.trim()); 
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    try {
      await onDelete(comment._id);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleReply = async (content: string) => {
    if (!onReply) return;
    
    try {
      await onReply(content, comment._id);
      setIsReplying(false);
      setShowReplies(true); 
    } catch (error) {
      console.error('Failed to reply to comment:', error);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const indentationClass = depth > 0 ? `ml-${Math.min(depth * 4, 16)}` : '';



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative first-of-type:pt-0 pt-4',
        indentationClass,
        isDeleting && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <div className={cn(
        "flex gap-3 bg-white  rounded-lg hover:shadow-sm transition-shadow",
        isSmallMobile ? "p-2" : "p-4"
      )}>
        <div className="flex-shrink-0">
          <CommentAvatar user={comment.user} size="md" />
        </div>

        <div className="flex-1 min-w-0">
          <div className={cn(
            "flex items-center justify-between mb-2",
            isSmallMobile ? "flex-col items-start gap-1" : "gap-2 flex-wrap"
          )}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn(
                "font-medium text-gray-900 truncate",
                isSmallMobile ? "text-xs" : "text-sm"
              )}>
                {getResponsiveDisplayName(comment.user, true)}
              </span>
{/* 
              {comment.user?.roles && comment.user.roles.length > 0 && (
                <Badge variant="secondary" className={cn(
                  isSmallMobile ? "text-xs px-1 py-0" : "text-xs"
                )}>
                  {comment.user.roles[0]}
                </Badge>
              )} */}
            </div>

            <div className="flex items-center  gap-2">
              <CommentTimestamp
                createdAt={comment.createdAt}
                updatedAt={comment.updatedAt}
                isEdited={comment.isEdited}
              />

              {(canEdit || canDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-60 hover:opacity-100 transition-opacity"
                      disabled={isUpdating || isDeleting}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canEdit && (
                    <DropdownMenuItem
                      onClick={() => setIsEditing(true)}
                      disabled={isUpdating || isDeleting}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <>
                      {canEdit && <DropdownMenuSeparator />}
                      <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-red-600 focus:text-red-600"
                        disabled={isUpdating || isDeleting}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <OptimizedCommentForm
                initialValue={editContent}
                onSubmit={handleEdit}
                onCancel={cancelEdit}
                placeholder="Edit your comment..."
                isSubmitting={isUpdating}
                showCancel
                submitText="Save Changes"
                minHeight="min-h-[80px]"
              />
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <p className={cn(
                "text-gray-700 whitespace-pre-wrap break-words",
                isSmallMobile ? "text-sm" : "text-base"
              )}>
                {comment.content}
              </p>
            </div>
          )}

          {!isEditing && (
            <div className={cn(
              "flex items-center mt-3",
              isSmallMobile ? "gap-2 flex-wrap" : "gap-4"
            )}>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLike}
                disabled={isReacting || isUpdating || isDeleting}
                className={cn(
                  'transition-colors',
                  isSmallMobile ? 'h-7 px-1.5 text-xs' : 'h-8 px-2 text-xs',
                  hasLiked && 'text-blue-600 ',
                  (isReacting || isUpdating || isDeleting) && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isReacting ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <ThumbsUp className={cn('h-3 w-3 mr-1', hasLiked && 'fill-current')} />
                )}
                {comment.likeCount > 0 && comment.likeCount}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDislike}
                disabled={isReacting || isUpdating || isDeleting}
                className={cn(
                  'transition-colors',
                  isSmallMobile ? 'h-7 px-1.5 text-xs' : 'h-8 px-2 text-xs',
                  hasDisliked && 'text-red-600 ',
                  (isReacting || isUpdating || isDeleting) && 'opacity-50 cursor-not-allowed'
                )}
              >
                <ThumbsDown className={cn('h-3 w-3 mr-1', hasDisliked && 'fill-current')} />
                {comment.dislikeCount > 0 && comment.dislikeCount}
              </Button>

              {canReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(!isReplying)}
                  disabled={isUpdating || isDeleting}
                  className={cn(
                    'transition-colors',
                    isSmallMobile ? 'h-7 px-1.5 text-xs' : 'h-8 px-2 text-xs',
                    (isUpdating || isDeleting) && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              )}

              {comment.replies && comment.replies.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplies(!showReplies)}
                  className="h-8 px-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  {showReplies ? (
                    <ChevronDown className="h-3 w-3 mr-1" />
                  ) : (
                    <ChevronRight className="h-3 w-3 mr-1" />
                  )}
                  {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </Button>
              )}
            </div>
          )}

          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 pl-4 border-l-2 border-gray-200"
              >
                <OptimizedCommentForm
                  onSubmit={handleReply}
                  onCancel={() => setIsReplying(false)}
                  placeholder="Write a reply..."
                  isSubmitting={false}
                  showCancel
                  submitText="Post Reply"
                  minHeight="min-h-[80px]"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showReplies && comment.replies && comment.replies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 space-y-4"
              >
                {comment.replies.map((reply) => (
                  <OptimizedCommentItem
                    key={reply._id}
                    comment={reply}
                    contentId={contentId}
                    contentType={contentType}
                    currentUserId={currentUserId}
                    depth={depth + 1}
                    maxDepth={maxDepth}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isUpdating={isUpdating}
                    isDeleting={isDeleting}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Delete Comment
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </motion.div>
  );
}
