"use client";

import { useState } from 'react';
import { CommentAvatar } from '@/components/atoms/comment/CommentAvatar';
import { CommentTimestamp } from '@/components/atoms/comment/CommentTimestamp';
import { CommentActions } from '@/components/molecules/comment/CommentActions';
import { CommentForm } from '@/components/molecules/comment/CommentForm';
import { CommentItemProps } from '@/types/comment';
import { useCommentEngagement } from '@/hooks/useCommentEngagement';
import { cn } from '@/lib/utils';

export function CommentItem({
  comment,
  currentUserId,
  depth = 0,
  maxDepth = 3,
  onReply,
  onEdit,
  onDelete,
  onReact,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(false); 

  const {
    toggleLike,
    toggleDislike,
    getUserReaction,
    isReacting,
    reactingCommentId,
  } = useCommentEngagement({
    contentId: comment.contentId,
    contentType: comment.contentType,
    currentUserId,
  });

  const userReaction = getUserReaction(comment);
  const isCurrentlyReacting = isReacting && reactingCommentId === comment._id;

  const handleReply = async (content: string) => {
    if (onReply) {
      await onReply(content, comment._id);
      setIsReplying(false);
      setShowReplies(true);
    }
  };

  const handleEdit = async (content: string) => {
    if (onEdit) {
      await onEdit(comment._id, content);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(comment._id);
    }
  };

  const handleLike = async () => {
    await toggleLike(comment._id);
  };

  const handleDislike = async () => {
    await toggleDislike(comment._id);
  };

  const canReply = depth < maxDepth && !!onReply;
  const canEdit = comment.userId === currentUserId && !!onEdit;
  const canDelete = comment.userId === currentUserId && !!onDelete;

  const getIndentClass = (depth: number) => {
    if (depth === 0) return '';
    if (depth === 1) return 'ml-4';
    if (depth === 2) return 'ml-8';
    return 'ml-12';
  };

  const indentClass = getIndentClass(depth);

  return (
    <article 
      id={`comment-${comment._id}`}
      className={cn(
        'group relative',
        indentClass,
        depth > 0 && 'border-l border-gray-200 pl-4'
      )}
    >
      <div className="flex gap-3">
        <CommentAvatar user={comment.user} size="md" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-gray-900">
              {comment.user?.firstName && comment.user?.lastName
                ? `${comment.user.firstName} ${comment.user.lastName}`
                : comment.user?.email
                  ? comment.user.email.split('@')[0]
                  : 'Anonymous User'
              }
            </span>

            {comment.user?.roles && comment.user.roles.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {comment.user.roles[0]}
              </span>
            )}

            <CommentTimestamp
              createdAt={comment.createdAt}
              updatedAt={comment.updatedAt}
              isEdited={comment.isEdited}
            />
          </div>

          {isEditing ? (
            <div className="mb-3">
              <CommentForm
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
                initialValue={comment.content}
                placeholder="Edit your comment..."
                autoFocus
                minHeight="min-h-[60px]"
              />
            </div>
          ) : (
            <div className="mb-3">
              <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                {comment.content}
              </p>
            </div>
          )}

          {!isEditing && (
            <CommentActions
              comment={comment}
              currentUserId={currentUserId}
              userReaction={userReaction}
              isReacting={isCurrentlyReacting}
              canReply={canReply}
              canEdit={canEdit}
              canDelete={canDelete}
              onReply={() => setIsReplying(true)}
              onEdit={() => setIsEditing(true)}
              onDelete={handleDelete}
              onLike={handleLike}
              onDislike={handleDislike}
              className="mb-3"
            />
          )}

          {isReplying && (
            <div className="mb-4">
              <CommentForm
                onSubmit={handleReply}
                onCancel={() => setIsReplying(false)}
                placeholder="Write a reply..."
                isReply
                autoFocus
                minHeight="min-h-[60px]"
              />
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium mb-2 flex items-center gap-1"
          >
            {showReplies ? '▼' : '▶'}
            {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
          </button>

          {showReplies && (
            <div className="space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  currentUserId={currentUserId}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReact={onReact}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
