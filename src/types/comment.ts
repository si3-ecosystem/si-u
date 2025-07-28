import { ContentType, UserRole, PaginationResponse } from './api';

// Re-export types for convenience
export type { ContentType, UserRole } from './api';

// Comment interfaces based on the backend API documentation
export interface User {
  _id: string;
  email: string;
  roles: UserRole[];
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface CommentReaction {
  _id: string;
  userId: string;
  type: 'like' | 'dislike';
  createdAt: string;
}

export interface Comment {
  _id: string;
  contentId: string;
  contentType: ContentType;
  content: string;
  userId: string;
  user?: User; // Optional since API might not always populate user data
  parentCommentId?: string;
  isReply: boolean;
  replyCount: number;
  reactions: CommentReaction[];
  likeCount: number;
  dislikeCount: number;
  isDeleted: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

export interface CreateCommentData {
  contentId: string;
  contentType: ContentType;
  content: string;
  parentCommentId?: string;
}

export interface UpdateCommentData {
  content: string;
}

export interface CommentReactionData {
  type: 'like' | 'dislike';
}

export interface CommentStats {
  totalComments: number;
  totalReplies: number;
  totalTopLevel: number;
  uniqueUserCount: number;
  latestComment: string;
  oldestComment: string;
}

export interface CommentsResponse {
  comments: Comment[];
  pagination: PaginationResponse;
}

export interface ThreadedCommentsResponse {
  comments: Comment[];
  pagination: PaginationResponse;
}

export interface CommentStatsResponse {
  analytics: CommentStats;
}

// Comment query parameters
export interface CommentQueryParams {
  contentId: string;
  contentType: ContentType;
  page?: number;
  limit?: number;
  includeReplies?: boolean;
}

export interface ThreadedCommentQueryParams {
  contentId: string;
  contentType: ContentType;
  page?: number;
  limit?: number;
}

export interface UserCommentsQueryParams {
  page?: number;
  limit?: number;
}

export interface CommentRepliesQueryParams {
  commentId: string;
  page?: number;
  limit?: number;
}

// UI-specific types
export interface CommentFormData {
  content: string;
}

export interface CommentItemProps {
  comment: Comment;
  currentUserId: string;
  depth?: number;
  maxDepth?: number;
  onReply?: (content: string, parentId: string) => Promise<void>;
  onEdit?: (commentId: string, content: string) => Promise<void>;
  onDelete?: (commentId: string) => Promise<void>;
  onReact?: (commentId: string, type: 'like' | 'dislike') => Promise<void>;
}

export interface CommentSectionProps {
  contentId: string;
  contentType: ContentType;
  userRole: UserRole;
  showStats?: boolean;
  autoRefresh?: boolean;
  maxDepth?: number;
  pageSize?: number;
}

// Comment context types
export interface CommentContextValue {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  stats: CommentStats | null;
  pagination: PaginationResponse | null;
  createComment: (data: CreateCommentData) => Promise<Comment>;
  updateComment: (id: string, data: UpdateCommentData) => Promise<Comment>;
  deleteComment: (id: string) => Promise<void>;
  reactToComment: (id: string, type: 'like' | 'dislike') => Promise<Comment>;
  loadComments: (params?: CommentQueryParams) => Promise<void>;
  loadReplies: (commentId: string, params?: CommentRepliesQueryParams) => Promise<Comment[]>;
  refreshStats: () => Promise<void>;
}
