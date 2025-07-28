import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommentReactionButtonProps {
  type: 'like' | 'dislike';
  count: number;
  isActive: boolean;
  isLoading?: boolean;
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function CommentReactionButton({
  type,
  count,
  isActive,
  isLoading = false,
  onClick,
  disabled = false,
  size = 'sm',
}: CommentReactionButtonProps) {
  const Icon = type === 'like' ? ThumbsUp : ThumbsDown;
  
  const sizeClasses = {
    sm: 'h-7 px-2 text-xs',
    md: 'h-8 px-3 text-sm',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        sizeClasses[size],
        'gap-1 transition-colors',
        isActive && type === 'like' && 'text-blue-600 bg-blue-50 hover:bg-blue-100',
        isActive && type === 'dislike' && 'text-red-600 bg-red-50 hover:bg-red-100',
        !isActive && 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      )}
    >
      <Icon 
        className={cn(
          iconSizes[size],
          isActive && 'fill-current',
          isLoading && 'animate-pulse'
        )} 
      />
      <span className="font-medium">{count}</span>
    </Button>
  );
}
