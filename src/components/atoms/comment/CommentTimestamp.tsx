import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface CommentTimestampProps {
  createdAt: string;
  updatedAt?: string;
  isEdited?: boolean;
  className?: string;
  showEdited?: boolean;
}

export function CommentTimestamp({ 
  createdAt, 
  updatedAt, 
  isEdited = false, 
  className = '',
  showEdited = true 
}: CommentTimestampProps) {
  const formatTimestamp = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const displayDate = isEdited && updatedAt ? updatedAt : createdAt;
  const formattedTime = formatTimestamp(displayDate);

  return (
    <span className={cn('text-xs text-gray-500', className)}>
      {formattedTime}
      {isEdited && showEdited && (
        <span className="ml-1 text-gray-400">(edited)</span>
      )}
    </span>
  );
}
