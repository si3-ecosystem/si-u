"use client";

import React, { useState, useRef, useEffect } from 'react';
// Simple fallback for framer-motion
const motion = {
  div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
  form: ({ children, className, ...props }: any) => <form className={className} {...props}>{children}</form>,
};
import { Send, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface OptimizedCommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
  initialValue?: string;
  isSubmitting?: boolean;
  showCancel?: boolean;
  submitText?: string;
  minHeight?: string;
  maxLength?: number;
  className?: string;
}

export function OptimizedCommentForm({
  onSubmit,
  onCancel,
  placeholder = "Write a comment...",
  initialValue = "",
  isSubmitting = false,
  showCancel = false,
  submitText = "Post Comment",
  minHeight = "min-h-[120px]",
  maxLength = 2000,
  className = "",
}: OptimizedCommentFormProps) {
  const [content, setContent] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [content]);

  // Focus textarea when editing
  useEffect(() => {
    if (initialValue && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(initialValue.length, initialValue.length);
    }
  }, [initialValue]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent || isSubmitting) return;

    try {
      await onSubmit(trimmedContent);
      if (!initialValue) {
        setContent('');
        setIsFocused(false);
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  const handleCancel = () => {
    setContent(initialValue);
    setIsFocused(false);
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
    
    if (e.key === 'Escape' && showCancel) {
      e.preventDefault();
      handleCancel();
    }
  };

  const isContentValid = content.trim().length > 0 && content.length <= maxLength;
  const characterCount = content.length;
  const isNearLimit = characterCount > maxLength * 0.8;

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={cn('space-y-3', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isSubmitting}
          maxLength={maxLength}
          className={cn(
            minHeight,
            'resize-none transition-all duration-200',
            isFocused && !isSubmitting && 'ring-2 ring-blue-500 border-blue-500',
            isSubmitting && 'opacity-50 cursor-not-allowed bg-gray-50'
          )}
          style={{ minHeight: '80px' }}
        />
        
        {(isFocused || isNearLimit) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              'absolute bottom-2 right-2 text-xs px-2 py-1 rounded bg-white/80 backdrop-blur-sm',
              isNearLimit ? 'text-orange-600' : 'text-gray-500',
              characterCount > maxLength && 'text-red-600 font-medium'
            )}
          >
            {characterCount}/{maxLength}
          </motion.div>
        )}
      </div>

      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 w-full justify-end">
          {showCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          )}
          
          <Button
            type="submit"
            size="sm"
            disabled={!isContentValid || isSubmitting}
            className={cn(
              'h-8 transition-all duration-200 text-white',
              isContentValid && !isSubmitting && 'bg-brand hover:bg-brand/90',
              isSubmitting && 'cursor-not-allowed bg-gray-400' ,
              !isContentValid && 'bg-gray-400'
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                {initialValue ? 'Saving...' : 'Posting...'}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-1" />
                {submitText}
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Validation message */}
      {content.length > maxLength && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2"
        >
          Comment is too long. Please reduce it by {content.length - maxLength} characters.
        </motion.div>
      )}
    </motion.form>
  );
}
