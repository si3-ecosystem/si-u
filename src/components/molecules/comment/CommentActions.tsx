"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Reply, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Flag,
  Copy,
  Share
} from 'lucide-react';
import { CommentReactionButton } from '@/components/atoms/comment/CommentReactionButton';
import { Comment } from '@/types/comment';
import { cn } from '@/lib/utils';

interface CommentActionsProps {
  comment: Comment;
  currentUserId: string;
  userReaction: 'like' | 'dislike' | null;
  isReacting: boolean;
  canReply?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  onReply?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onReport?: () => void;
  onShare?: () => void;
  className?: string;
}

export function CommentActions({
  comment,
  currentUserId,
  userReaction,
  isReacting,
  canReply = true,
  canEdit = true,
  canDelete = true,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onDislike,
  onReport,
  onShare,
  className = '',
}: CommentActionsProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const isOwner = comment.userId === currentUserId;
  const canEditComment = canEdit && isOwner;
  const canDeleteComment = canDelete && isOwner;

  const handleDelete = () => {
    if (showConfirmDelete) {
      onDelete?.();
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowConfirmDelete(false), 3000);
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}${window.location.pathname}#comment-${comment._id}`;
      await navigator.clipboard.writeText(url);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {/* Reaction buttons */}
      <div className="flex items-center gap-1">
        <CommentReactionButton
          type="like"
          count={comment.likeCount}
          isActive={userReaction === 'like'}
          isLoading={isReacting}
          onClick={onLike || (() => {})}
          disabled={!onLike}
        />
        
        <CommentReactionButton
          type="dislike"
          count={comment.dislikeCount}
          isActive={userReaction === 'dislike'}
          isLoading={isReacting}
          onClick={onDislike || (() => {})}
          disabled={!onDislike}
        />
      </div>

      {/* Reply button */}
      {canReply && onReply && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReply}
          className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700"
        >
          <Reply className="h-3 w-3 mr-1" />
          Reply
        </Button>
      )}

      {/* More actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-48">
          {/* Owner actions */}
          {canEditComment && (
            <DropdownMenuItem onClick={onEdit} className="text-sm">
              <Edit className="h-3 w-3 mr-2" />
              Edit comment
            </DropdownMenuItem>
          )}
          
          {canDeleteComment && (
            <DropdownMenuItem 
              onClick={handleDelete}
              className={cn(
                'text-sm',
                showConfirmDelete ? 'text-red-600 bg-red-50' : ''
              )}
            >
              <Trash2 className="h-3 w-3 mr-2" />
              {showConfirmDelete ? 'Confirm delete' : 'Delete comment'}
            </DropdownMenuItem>
          )}

          {/* General actions */}
          <DropdownMenuItem onClick={handleCopyLink} className="text-sm">
            <Copy className="h-3 w-3 mr-2" />
            Copy link
          </DropdownMenuItem>

          {onShare && (
            <DropdownMenuItem onClick={onShare} className="text-sm">
              <Share className="h-3 w-3 mr-2" />
              Share comment
            </DropdownMenuItem>
          )}

          {/* Report action (for non-owners) */}
          {!isOwner && onReport && (
            <DropdownMenuItem onClick={onReport} className="text-sm text-red-600">
              <Flag className="h-3 w-3 mr-2" />
              Report comment
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
