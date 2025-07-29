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
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CommentAvatar } from '@/components/atoms/comment/CommentAvatar';
import { CommentTimestamp } from '@/components/atoms/comment/CommentTimestamp';
import { useOptimizedCommentReactions } from '@/hooks/useOptimizedCommentReactions';
import { Comment, ContentType } from '@/types/comment';
import { cn } from '@/lib/utils';
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
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  // Use optimized reactions hook
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

  // Permission checks
  const canReply = useMemo(() => {
    // Only allow replies to top-level comments (depth 0)
    return depth === 0 && !!onReply;
  }, [depth, onReply]);

  const canEdit = useMemo(() => comment.userId === currentUserId && !!onEdit, [comment.userId, currentUserId, onEdit]);
  const canDelete = useMemo(() => comment.userId === currentUserId && !!onDelete, [comment.userId, currentUserId, onDelete]);

  // Handle edit
  const handleEdit = async () => {
    if (!onEdit || !editContent.trim()) return;
    
    try {
      await onEdit(comment._id, editContent.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!onDelete) return;
    
    try {
      await onDelete(comment._id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  // Handle reply
  const handleReply = async (content: string) => {
    if (!onReply) return;
    
    try {
      await onReply(content, comment._id);
      setIsReplying(false);
      setShowReplies(true); // Auto-expand replies after adding one
    } catch (error) {
      console.error('Failed to reply to comment:', error);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  // Indentation based on depth
  const indentationClass = depth > 0 ? `ml-${Math.min(depth * 4, 16)}` : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative',
        indentationClass,
        isDeleting && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {/* Main comment */}
      <div className="flex gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <CommentAvatar user={comment.user} size="md" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm text-gray-900">
              {comment.user?.firstName && comment.user?.lastName
                ? `${comment.user.firstName} ${comment.user.lastName}`
                : comment.user?.email 
                  ? comment.user.email.split('@')[0]
                  : 'Anonymous User'
              }
            </span>
            
            {/* User role badge */}
            {comment.user?.roles && comment.user.roles.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {comment.user.roles[0]}
              </Badge>
            )}
            
            <CommentTimestamp
              createdAt={comment.createdAt}
              updatedAt={comment.updatedAt}
              isEdited={comment.isEdited}
            />

            {/* Actions dropdown - only show for comment author */}
            {(canEdit || canDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
                        onClick={() => setShowDeleteDialog(true)}
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

          {/* Content */}
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
              <p className="text-gray-700 whitespace-pre-wrap break-words">
                {comment.content}
              </p>
            </div>
          )}

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center gap-4 mt-3">
              {/* Like button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLike}
                disabled={isReacting || isUpdating || isDeleting}
                className={cn(
                  'h-8 px-2 text-xs transition-colors',
                  hasLiked && 'text-blue-600 bg-blue-50 hover:bg-blue-100',
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

              {/* Dislike button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDislike}
                disabled={isReacting || isUpdating || isDeleting}
                className={cn(
                  'h-8 px-2 text-xs transition-colors',
                  hasDisliked && 'text-red-600 bg-red-50 hover:bg-red-100',
                  (isReacting || isUpdating || isDeleting) && 'opacity-50 cursor-not-allowed'
                )}
              >
                <ThumbsDown className={cn('h-3 w-3 mr-1', hasDisliked && 'fill-current')} />
                {comment.dislikeCount > 0 && comment.dislikeCount}
              </Button>

              {/* Reply button - only show for top-level comments */}
              {canReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(!isReplying)}
                  disabled={isUpdating || isDeleting}
                  className={cn(
                    'h-8 px-2 text-xs transition-colors',
                    (isUpdating || isDeleting) && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              )}

              {/* Show replies toggle */}
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

          {/* Reply form */}
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

          {/* Replies */}
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

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
              className="bg-red-600 hover:bg-red-700"
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
      </AlertDialog>
    </motion.div>
  );
}
