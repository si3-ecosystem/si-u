import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/comment';

interface CommentAvatarProps {
  user?: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CommentAvatar({ user, size = 'md', className = '' }: CommentAvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  // Handle case where user is undefined
  if (!user) {
    return (
      <div className={`${sizeClasses[size]} ${className} rounded-full bg-gray-300 flex items-center justify-center`}>
        <span className="text-xs font-medium text-gray-600">?</span>
      </div>
    );
  }

  const getInitials = (user: User): string => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = (user: User): string => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Unknown User';
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage 
        src={user.avatar} 
        alt={getDisplayName(user)}
      />
      <AvatarFallback className="text-xs font-medium">
        {getInitials(user)}
      </AvatarFallback>
    </Avatar>
  );
}
