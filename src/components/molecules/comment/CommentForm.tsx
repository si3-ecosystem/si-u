"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
  initialValue?: string;
  isSubmitting?: boolean;
  isReply?: boolean;
  autoFocus?: boolean;
  minHeight?: string;
  maxLength?: number;
  className?: string;
}

export function CommentForm({
  onSubmit,
  onCancel,
  placeholder = 'Write a comment...',
  initialValue = '',
  isSubmitting = false,
  isReply = false,
  autoFocus = false,
  minHeight = 'min-h-[80px]',
  maxLength = 1000,
  className = '',
}: CommentFormProps) {
  const [content, setContent] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(autoFocus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedContent = content.trim();
    if (!trimmedContent || isSubmitting) return;

    try {
      await onSubmit(trimmedContent);
      setContent('');
      setIsFocused(false);
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  const handleCancel = () => {
    setContent(initialValue);
    setIsFocused(false);
    onCancel?.();
  };

  const isValid = content.trim().length > 0;
  const remainingChars = maxLength - content.length;

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-3', className)}>
      <div className="relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          disabled={isSubmitting}
          autoFocus={autoFocus}
          maxLength={maxLength}
          className={cn(
            minHeight,
            'resize-none transition-all duration-200',
            isFocused && 'ring-2 ring-blue-500 border-blue-500',
            isReply && 'text-sm'
          )}
        />
        
        {/* Character count */}
        {isFocused && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {remainingChars < 50 && (
              <span className={remainingChars < 0 ? 'text-red-500' : 'text-orange-500'}>
                {remainingChars}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action buttons - only show when focused or has content */}
      {(isFocused || content.trim()) && (
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {isReply ? 'Replying to comment' : 'Share your thoughts'}
          </div>
          
          <div className="flex items-center gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="h-8 px-3"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            )}
            
            <Button
              type="submit"
              size="sm"
              disabled={!isValid || isSubmitting || remainingChars < 0}
              className="h-8 px-3"
            >
              {isSubmitting ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent mr-1" />
              ) : (
                <Send className="h-3 w-3 mr-1" />
              )}
              {isReply ? 'Reply' : 'Comment'}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
