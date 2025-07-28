# SI3 Backend Commenting System

## Overview

The SI3 Backend now includes a comprehensive commenting system that integrates with Sanity CMS content. The system supports role-based permissions, threaded discussions, and real-time comment management.

## Features

- ✅ **Role-based Access Control**: Users can only comment on content relevant to their role
- ✅ **Sanity CMS Integration**: Uses Sanity document IDs to identify content
- ✅ **Threaded Comments**: Support for replies and nested discussions
- ✅ **Like/Dislike System**: Users can react to comments with likes and dislikes
- ✅ **Redis Caching**: High-performance caching for frequently accessed comments
- ✅ **Soft Deletion**: Comments are soft-deleted for data integrity
- ✅ **Rate Limiting**: Prevents spam with intelligent rate limiting
- ✅ **Real-time Analytics**: Comment statistics and user engagement metrics
- ✅ **Optimized Performance**: Efficient database queries with proper indexing

## Content Types & Permissions

| Content Type | Allowed Roles | Description |
|--------------|---------------|-------------|
| `guide_session` | Guide, Admin | Guide session content |
| `guide_ideas_lab` | Guide, Admin | Guide ideas lab posts |
| `scholar_session` | Scholar, Admin | Scholar session content |
| `scholar_ideas_lab` | Scholar, Admin | Scholar ideas lab posts |

## API Endpoints

### Authentication Required
All endpoints require authentication via JWT token (cookie or Authorization header).

### 1. Create Comment
```http
POST /api/comments
Content-Type: application/json

{
  "contentId": "sanity-document-id",
  "contentType": "guide_session",
  "content": "This is a great session!",
  "parentCommentId": "optional-parent-comment-id"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "comment": {
      "_id": "comment-id",
      "contentId": "sanity-document-id",
      "contentType": "guide_session",
      "content": "This is a great session!",
      "userId": "user-id",
      "user": {
        "email": "user@example.com",
        "roles": ["guide"]
      },
      "isReply": false,
      "replyCount": 0,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 2. Get Comments for Content
```http
GET /api/comments/content?contentId=sanity-doc-id&contentType=guide_session&page=1&limit=20&includeReplies=true
```

### 3. Get Threaded Comments (Optimized)
```http
GET /api/comments/content/threaded?contentId=sanity-doc-id&contentType=guide_session&page=1&limit=20
```

**Response includes nested replies:**
```json
{
  "status": "success",
  "results": 5,
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "totalComments": 5,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "data": {
    "comments": [
      {
        "_id": "comment-id",
        "content": "Great session!",
        "user": { "email": "user@example.com", "roles": ["guide"] },
        "replies": [
          {
            "_id": "reply-id",
            "content": "I agree!",
            "user": { "email": "other@example.com", "roles": ["guide"] }
          }
        ],
        "hasMoreReplies": false,
        "replyCount": 1
      }
    ]
  }
}
```

### 4. Get Comment Statistics
```http
GET /api/comments/content/stats?contentId=sanity-doc-id&contentType=guide_session
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "analytics": {
      "totalComments": 15,
      "totalReplies": 8,
      "totalTopLevel": 7,
      "uniqueUserCount": 5,
      "latestComment": "2024-01-01T12:00:00.000Z",
      "oldestComment": "2024-01-01T10:00:00.000Z"
    }
  }
}
```

### 5. Update Comment
```http
PUT /api/comments/:commentId
Content-Type: application/json

{
  "content": "Updated comment content"
}
```

### 6. Delete Comment
```http
DELETE /api/comments/:commentId
```

### 7. Get User's Comments
```http
GET /api/comments/my-comments?page=1&limit=20
```

### 8. Get Comment Replies
```http
GET /api/comments/:commentId/replies?page=1&limit=20
```

### 9. Add Reaction (Like/Dislike)
```http
POST /api/comments/:commentId/react
Content-Type: application/json

{
  "type": "like"  // or "dislike"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "comment": {
      "_id": "comment-id",
      "content": "Great session!",
      "likeCount": 5,
      "dislikeCount": 1,
      "reactions": [...]
    },
    "userReaction": "like"
  }
}
```

### 10. Remove Reaction
```http
DELETE /api/comments/:commentId/react
```

### 11. Get User's Reaction
```http
GET /api/comments/:commentId/my-reaction
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "userReaction": "like"  // or "dislike" or null
  }
}
```

### 12. Get Reaction Statistics
```http
GET /api/comments/:commentId/reactions
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "commentId": "comment-id",
    "likeCount": 15,
    "dislikeCount": 3,
    "totalReactions": 18,
    "breakdown": {
      "like": 15,
      "dislike": 3
    }
  }
}
```

## Frontend Implementation Guide

### API Client Service

Create a centralized API service for all comment operations:

```typescript
// services/commentService.ts
interface CommentData {
  contentId: string;
  contentType: 'guide_session' | 'guide_ideas_lab' | 'scholar_session' | 'scholar_ideas_lab';
  content: string;
  parentCommentId?: string;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  includeReplies?: boolean;
}

class CommentService {
  private baseUrl = '/api/comments';

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Create a new comment or reply
  async createComment(data: CommentData) {
    return this.request('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get comments for specific content
  async getCommentsByContent(
    contentId: string,
    contentType: string,
    params: PaginationParams = {}
  ) {
    const searchParams = new URLSearchParams({
      contentId,
      contentType,
      page: (params.page || 1).toString(),
      limit: (params.limit || 20).toString(),
      ...(params.includeReplies && { includeReplies: 'true' }),
    });

    return this.request(`/content?${searchParams}`);
  }

  // Get threaded comments (optimized for UI)
  async getThreadedComments(
    contentId: string,
    contentType: string,
    params: PaginationParams = {}
  ) {
    const searchParams = new URLSearchParams({
      contentId,
      contentType,
      page: (params.page || 1).toString(),
      limit: (params.limit || 20).toString(),
    });

    return this.request(`/content/threaded?${searchParams}`);
  }

  // Get single comment by ID
  async getComment(commentId: string) {
    return this.request(`/${commentId}`);
  }

  // Get replies for a comment
  async getCommentReplies(commentId: string, params: PaginationParams = {}) {
    const searchParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      limit: (params.limit || 20).toString(),
    });

    return this.request(`/${commentId}/replies?${searchParams}`);
  }

  // Get current user's comments
  async getMyComments(params: PaginationParams = {}) {
    const searchParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      limit: (params.limit || 20).toString(),
    });

    return this.request(`/my-comments?${searchParams}`);
  }

  // Update comment content
  async updateComment(commentId: string, content: string) {
    return this.request(`/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  // Delete comment (soft delete)
  async deleteComment(commentId: string) {
    return this.request(`/${commentId}`, {
      method: 'DELETE',
    });
  }

  // Add reaction to comment
  async addReaction(commentId: string, type: 'like' | 'dislike') {
    return this.request(`/${commentId}/react`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  // Remove reaction from comment
  async removeReaction(commentId: string) {
    return this.request(`/${commentId}/react`, {
      method: 'DELETE',
    });
  }

  // Get user's reaction to a comment
  async getUserReaction(commentId: string) {
    return this.request(`/${commentId}/my-reaction`);
  }

  // Get reaction statistics for a comment
  async getReactionStats(commentId: string) {
    return this.request(`/${commentId}/reactions`);
  }

  // Get comment statistics for content
  async getContentStats(contentId: string, contentType: string) {
    const searchParams = new URLSearchParams({
      contentId,
      contentType,
    });

    return this.request(`/content/stats?${searchParams}`);
  }
}

export const commentService = new CommentService();
```

### React Hooks for Comments

```typescript
// hooks/useComments.ts
import { useState, useEffect, useCallback } from 'react';
import { commentService } from '../services/commentService';

interface UseCommentsOptions {
  contentId: string;
  contentType: string;
  page?: number;
  limit?: number;
  autoRefresh?: boolean;
}

export const useComments = ({
  contentId,
  contentType,
  page = 1,
  limit = 20,
  autoRefresh = false,
}: UseCommentsOptions) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(null);

  const loadComments = useCallback(async () => {
    if (!contentId || !contentType) return;

    setLoading(true);
    setError(null);

    try {
      const response = await commentService.getThreadedComments(
        contentId,
        contentType,
        { page, limit }
      );

      setComments(response.data.comments);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [contentId, contentType, page, limit]);

  const createComment = useCallback(async (content: string, parentCommentId?: string) => {
    try {
      await commentService.createComment({
        contentId,
        contentType,
        content,
        parentCommentId,
      });

      // Reload comments after creation
      await loadComments();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create comment');
      return false;
    }
  }, [contentId, contentType, loadComments]);

  const updateComment = useCallback(async (commentId: string, content: string) => {
    try {
      await commentService.updateComment(commentId, content);
      await loadComments();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update comment');
      return false;
    }
  }, [loadComments]);

  const deleteComment = useCallback(async (commentId: string) => {
    try {
      await commentService.deleteComment(commentId);
      await loadComments();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
      return false;
    }
  }, [loadComments]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(loadComments, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh, loadComments]);

  return {
    comments,
    loading,
    error,
    pagination,
    loadComments,
    createComment,
    updateComment,
    deleteComment,
  };
};

// hooks/useCommentReactions.ts
export const useCommentReactions = (commentId: string) => {
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [reactionStats, setReactionStats] = useState({
    likeCount: 0,
    dislikeCount: 0,
    totalReactions: 0,
  });
  const [loading, setLoading] = useState(false);

  const loadUserReaction = useCallback(async () => {
    if (!commentId) return;

    try {
      const response = await commentService.getUserReaction(commentId);
      setUserReaction(response.data.userReaction);
    } catch (err) {
      console.error('Failed to load user reaction:', err);
    }
  }, [commentId]);

  const loadReactionStats = useCallback(async () => {
    if (!commentId) return;

    try {
      const response = await commentService.getReactionStats(commentId);
      setReactionStats(response.data);
    } catch (err) {
      console.error('Failed to load reaction stats:', err);
    }
  }, [commentId]);

  const toggleReaction = useCallback(async (type: 'like' | 'dislike') => {
    setLoading(true);

    try {
      if (userReaction === type) {
        // Remove reaction
        await commentService.removeReaction(commentId);
        setUserReaction(null);
      } else {
        // Add or change reaction
        await commentService.addReaction(commentId, type);
        setUserReaction(type);
      }

      // Reload stats
      await loadReactionStats();
    } catch (err) {
      console.error('Failed to toggle reaction:', err);
    } finally {
      setLoading(false);
    }
  }, [commentId, userReaction, loadReactionStats]);

  useEffect(() => {
    loadUserReaction();
    loadReactionStats();
  }, [loadUserReaction, loadReactionStats]);

  return {
    userReaction,
    reactionStats,
    loading,
    toggleReaction,
    loadUserReaction,
    loadReactionStats,
  };
};
```

## Error Handling

The API returns standardized error responses:

```json
{
  "status": "error",
  "error": {
    "message": "You do not have permission to comment on guide session content.",
    "statusCode": 403,
    "errorCode": "FORBIDDEN"
  }
}
```

Common error scenarios:
- **401 Unauthorized**: User not logged in
- **403 Forbidden**: User doesn't have permission for content type
- **404 Not Found**: Comment or content not found
- **429 Too Many Requests**: Rate limit exceeded (10 comments per 5 minutes)
- **400 Bad Request**: Invalid input data

## Rate Limiting

- **General users**: Maximum 10 comments per 5 minutes
- **Admin users**: No rate limiting
- Rate limiting is bypassed in development environment

## Database Schema

The comment system uses a single flexible model with the following key fields:

- `contentId`: Sanity document ID
- `contentType`: One of the supported content types
- `userId`: Reference to the user who created the comment
- `content`: The comment text (max 2000 characters)
- `parentCommentId`: For threaded replies
- `isReply`: Boolean flag for replies
- `replyCount`: Number of replies to this comment
- `reactions`: Array of user reactions (likes/dislikes)
- `likeCount`: Number of likes
- `dislikeCount`: Number of dislikes
- `isDeleted`: Soft deletion flag
- `isEdited`: Flag indicating if comment was edited

## Redis Caching Implementation

The system implements intelligent Redis caching to significantly improve performance:

### Cache Strategy
- **Read-through caching**: Check cache first, fallback to database
- **Write-through invalidation**: Clear related caches on updates
- **TTL-based expiration**: Different TTLs for different data types

### Cached Endpoints
- `GET /api/comments/content` - Comments by content (5 min TTL)
- `GET /api/comments/content/threaded` - Threaded comments (5 min TTL)
- `GET /api/comments/content/stats` - Comment statistics (10 min TTL)
- `GET /api/comments/my-comments` - User comments (5 min TTL)

### Cache Invalidation
Caches are automatically invalidated when:
- New comments are created
- Comments are updated or deleted
- Reactions are added or removed
- User performs any comment-related action

### Cache Keys Structure
```
comments:content:{contentId}:{contentType}:{page}:{limit}:{includeReplies}
comments:threaded:{contentId}:{contentType}:{page}:{limit}
comments:stats:{contentId}:{contentType}
comments:user:{userId}:{page}:{limit}
comment:single:{commentId}
```

## Like/Dislike System

### Features
- Users can like or dislike any comment they have access to
- One reaction per user per comment (can change from like to dislike)
- Real-time reaction counts
- Reaction statistics and analytics

### Usage Examples

```javascript
// Add a like
const addLike = async (commentId) => {
  const response = await fetch(`/api/comments/${commentId}/react`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ type: 'like' })
  });
  return response.json();
};

// Remove reaction
const removeReaction = async (commentId) => {
  const response = await fetch(`/api/comments/${commentId}/react`, {
    method: 'DELETE',
    credentials: 'include'
  });
  return response.json();
};

// Get reaction stats
const getReactionStats = async (commentId) => {
  const response = await fetch(`/api/comments/${commentId}/reactions`, {
    credentials: 'include'
  });
  return response.json();
};
```

## Performance Optimizations

1. **Indexing**: Optimized compound indexes for fast queries
2. **Pagination**: All endpoints support pagination
3. **Aggregation**: Efficient MongoDB aggregation pipelines
4. **Redis Caching**: Intelligent caching with automatic invalidation
5. **Rate Limiting**: Prevents spam and reduces server load
6. **Reaction Counting**: Automatic reaction count updates via middleware

### Complete React Components

```tsx
// components/CommentSection.tsx
import React, { useState } from 'react';
import { useComments } from '../hooks/useComments';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { CommentStats } from './CommentStats';

interface CommentSectionProps {
  contentId: string;
  contentType: 'guide_session' | 'guide_ideas_lab' | 'scholar_session' | 'scholar_ideas_lab';
  userRole: string;
  showStats?: boolean;
  autoRefresh?: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  contentId,
  contentType,
  userRole,
  showStats = true,
  autoRefresh = false,
}) => {
  const [page, setPage] = useState(1);
  const {
    comments,
    loading,
    error,
    pagination,
    createComment,
    updateComment,
    deleteComment,
  } = useComments({
    contentId,
    contentType,
    page,
    autoRefresh,
  });

  // Check if user can access this content type
  const canAccess = () => {
    const accessMap = {
      guide_session: ['guide', 'admin'],
      guide_ideas_lab: ['guide', 'admin'],
      scholar_session: ['scholar', 'admin'],
      scholar_ideas_lab: ['scholar', 'admin'],
    };
    return accessMap[contentType]?.includes(userRole);
  };

  const handleCreateComment = async (content: string) => {
    const success = await createComment(content);
    if (success) {
      // Reset to first page to see new comment
      setPage(1);
    }
    return success;
  };

  if (!canAccess()) {
    return (
      <div className="comment-section-unauthorized">
        <p>You don't have permission to view comments for this content.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comment-section-error">
        <p>Error loading comments: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="comment-section">
      {showStats && (
        <CommentStats contentId={contentId} contentType={contentType} />
      )}

      <CommentForm
        onSubmit={handleCreateComment}
        placeholder="Share your thoughts..."
        submitText="Post Comment"
      />

      {loading && comments.length === 0 ? (
        <div className="comment-loading">Loading comments...</div>
      ) : (
        <>
          <div className="comments-list">
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                onUpdate={updateComment}
                onDelete={deleteComment}
                onReply={createComment}
                currentUserId={userRole} // You might want to pass actual user ID
              />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="comment-pagination">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </button>

              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// components/CommentItem.tsx
import React, { useState } from 'react';
import { useCommentReactions } from '../hooks/useCommentReactions';
import { CommentForm } from './CommentForm';

interface CommentItemProps {
  comment: any;
  onUpdate: (commentId: string, content: string) => Promise<boolean>;
  onDelete: (commentId: string) => Promise<boolean>;
  onReply: (content: string, parentCommentId: string) => Promise<boolean>;
  currentUserId: string;
  depth?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onUpdate,
  onDelete,
  onReply,
  currentUserId,
  depth = 0,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const {
    userReaction,
    reactionStats,
    loading: reactionLoading,
    toggleReaction,
  } = useCommentReactions(comment._id);

  const isOwner = comment.userId === currentUserId;
  const canEdit = isOwner || currentUserId === 'admin';

  const handleEdit = async () => {
    if (editContent.trim() === comment.content) {
      setIsEditing(false);
      return;
    }

    const success = await onUpdate(comment._id, editContent.trim());
    if (success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await onDelete(comment._id);
    }
  };

  const handleReply = async (content: string) => {
    const success = await onReply(content, comment._id);
    if (success) {
      setIsReplying(false);
    }
    return success;
  };

  return (
    <div className={`comment-item depth-${Math.min(depth, 3)}`}>
      <div className="comment-header">
        <div className="comment-author">
          <span className="author-email">{comment.user?.email}</span>
          <span className="author-roles">
            {comment.user?.roles?.join(', ')}
          </span>
        </div>

        <div className="comment-meta">
          <time dateTime={comment.createdAt}>
            {new Date(comment.createdAt).toLocaleDateString()}
          </time>
          {comment.isEdited && <span className="edited-indicator">edited</span>}
        </div>
      </div>

      <div className="comment-content">
        {isEditing ? (
          <div className="comment-edit-form">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              maxLength={2000}
              rows={3}
            />
            <div className="edit-actions">
              <button onClick={handleEdit}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <p className={comment.isDeleted ? 'deleted-content' : ''}>
            {comment.content}
          </p>
        )}
      </div>

      <div className="comment-actions">
        <div className="reaction-buttons">
          <button
            onClick={() => toggleReaction('like')}
            disabled={reactionLoading}
            className={`reaction-btn like ${userReaction === 'like' ? 'active' : ''}`}
          >
            👍 {reactionStats.likeCount}
          </button>

          <button
            onClick={() => toggleReaction('dislike')}
            disabled={reactionLoading}
            className={`reaction-btn dislike ${userReaction === 'dislike' ? 'active' : ''}`}
          >
            👎 {reactionStats.dislikeCount}
          </button>
        </div>

        <div className="comment-controls">
          {!comment.isDeleted && (
            <button onClick={() => setIsReplying(!isReplying)}>
              Reply
            </button>
          )}

          {canEdit && !comment.isDeleted && (
            <>
              <button onClick={() => setIsEditing(!isEditing)}>
                Edit
              </button>
              <button onClick={handleDelete} className="delete-btn">
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {isReplying && (
        <div className="reply-form">
          <CommentForm
            onSubmit={handleReply}
            placeholder="Write a reply..."
            submitText="Post Reply"
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onReply={onReply}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// components/CommentForm.tsx
import React, { useState } from 'react';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<boolean>;
  placeholder?: string;
  submitText?: string;
  onCancel?: () => void;
  initialValue?: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  placeholder = "Add a comment...",
  submitText = "Post",
  onCancel,
  initialValue = "",
}) => {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const success = await onSubmit(content.trim());
      if (success) {
        setContent('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="form-group">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          maxLength={2000}
          rows={3}
          disabled={isSubmitting}
          className="comment-textarea"
        />

        <div className="character-count">
          {content.length}/2000
        </div>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <div className="form-actions">
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="submit-btn"
        >
          {isSubmitting ? 'Posting...' : submitText}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="cancel-btn"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

// components/CommentStats.tsx
import React, { useState, useEffect } from 'react';
import { commentService } from '../services/commentService';

interface CommentStatsProps {
  contentId: string;
  contentType: string;
}

export const CommentStats: React.FC<CommentStatsProps> = ({
  contentId,
  contentType,
}) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await commentService.getContentStats(contentId, contentType);
        setStats(response.data.analytics);
      } catch (error) {
        console.error('Failed to load comment stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [contentId, contentType]);

  if (loading) {
    return <div className="comment-stats loading">Loading stats...</div>;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="comment-stats">
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{stats.totalComments}</span>
          <span className="stat-label">Total Comments</span>
        </div>

        <div className="stat-item">
          <span className="stat-value">{stats.totalTopLevel}</span>
          <span className="stat-label">Discussions</span>
        </div>

        <div className="stat-item">
          <span className="stat-value">{stats.totalReplies}</span>
          <span className="stat-label">Replies</span>
        </div>

        <div className="stat-item">
          <span className="stat-value">{stats.uniqueUserCount}</span>
          <span className="stat-label">Participants</span>
        </div>
      </div>
    </div>
  );
};
```

### CSS Styling Guide

```css
/* Comment Section Styles */
.comment-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.comment-section-unauthorized,
.comment-section-error {
  text-align: center;
  padding: 40px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #6c757d;
}

/* Comment Stats */
.comment-stats {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #495057;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Comment Form */
.comment-form {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.comment-textarea {
  width: 100%;
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 12px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  min-height: 80px;
}

.comment-textarea:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.character-count {
  text-align: right;
  font-size: 12px;
  color: #6c757d;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.submit-btn {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #0056b3;
}

.submit-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.cancel-btn {
  background: transparent;
  color: #6c757d;
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
}

.form-error {
  color: #dc3545;
  font-size: 14px;
  margin-top: 8px;
}

/* Comment Items */
.comment-item {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.comment-item.depth-1 {
  margin-left: 20px;
  border-left: 3px solid #007bff;
}

.comment-item.depth-2 {
  margin-left: 40px;
  border-left: 3px solid #28a745;
}

.comment-item.depth-3 {
  margin-left: 60px;
  border-left: 3px solid #ffc107;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-email {
  font-weight: 500;
  color: #495057;
}

.author-roles {
  font-size: 12px;
  color: #6c757d;
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 12px;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6c757d;
}

.edited-indicator {
  font-style: italic;
}

.comment-content p {
  margin: 0;
  line-height: 1.6;
  color: #495057;
}

.deleted-content {
  color: #6c757d;
  font-style: italic;
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e9ecef;
}

.reaction-buttons {
  display: flex;
  gap: 8px;
}

.reaction-btn {
  background: transparent;
  border: 1px solid #ced4da;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.reaction-btn:hover {
  background: #f8f9fa;
}

.reaction-btn.active.like {
  background: #d4edda;
  border-color: #28a745;
  color: #155724;
}

.reaction-btn.active.dislike {
  background: #f8d7da;
  border-color: #dc3545;
  color: #721c24;
}

.comment-controls {
  display: flex;
  gap: 8px;
}

.comment-controls button {
  background: transparent;
  border: none;
  color: #6c757d;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.comment-controls button:hover {
  background: #f8f9fa;
  color: #495057;
}

.delete-btn:hover {
  color: #dc3545 !important;
}

/* Pagination */
.comment-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding: 16px;
}

.comment-pagination button {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

.comment-pagination button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

/* Loading States */
.comment-loading {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

/* Responsive Design */
@media (max-width: 768px) {
  .comment-section {
    padding: 16px;
  }

  .comment-item.depth-1,
  .comment-item.depth-2,
  .comment-item.depth-3 {
    margin-left: 16px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .comment-actions {
    flex-direction: column;
    gap: 12px;
  }
}
```

### Usage Examples

#### Basic Implementation

```tsx
// pages/ContentPage.tsx
import React from 'react';
import { CommentSection } from '../components/CommentSection';

interface ContentPageProps {
  contentId: string;
  contentType: 'guide_session' | 'guide_ideas_lab' | 'scholar_session' | 'scholar_ideas_lab';
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}

export const ContentPage: React.FC<ContentPageProps> = ({
  contentId,
  contentType,
  user,
}) => {
  const userRole = user.roles[0]; // Assuming primary role

  return (
    <div className="content-page">
      {/* Your content here */}
      <div className="content-body">
        {/* Content from Sanity CMS */}
      </div>

      {/* Comments Section */}
      <section className="comments-section">
        <h2>Discussion</h2>
        <CommentSection
          contentId={contentId}
          contentType={contentType}
          userRole={userRole}
          showStats={true}
          autoRefresh={true}
        />
      </section>
    </div>
  );
};
```

#### Advanced Implementation with Context

```tsx
// contexts/CommentContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface CommentContextType {
  refreshComments: () => void;
  isRefreshing: boolean;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const useCommentContext = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useCommentContext must be used within CommentProvider');
  }
  return context;
};

export const CommentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshComments = () => {
    setIsRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <CommentContext.Provider value={{ refreshComments, isRefreshing }}>
      {children}
    </CommentContext.Provider>
  );
};
```

#### Real-time Updates with WebSocket

```tsx
// hooks/useRealtimeComments.ts
import { useEffect } from 'react';
import { useComments } from './useComments';

export const useRealtimeComments = (contentId: string, contentType: string) => {
  const commentsHook = useComments({ contentId, contentType });

  useEffect(() => {
    // WebSocket connection for real-time updates
    const ws = new WebSocket(`ws://localhost:8080/comments/${contentId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'NEW_COMMENT':
        case 'UPDATE_COMMENT':
        case 'DELETE_COMMENT':
        case 'NEW_REACTION':
          commentsHook.loadComments();
          break;
      }
    };

    return () => {
      ws.close();
    };
  }, [contentId, commentsHook.loadComments]);

  return commentsHook;
};
```

### Best Practices

#### 1. Error Handling

```tsx
// utils/errorHandler.ts
export const handleCommentError = (error: any) => {
  if (error.status === 401) {
    // Redirect to login
    window.location.href = '/login';
  } else if (error.status === 403) {
    // Show permission error
    return 'You do not have permission to perform this action.';
  } else if (error.status === 429) {
    // Rate limit error
    return 'You are posting too frequently. Please wait a moment.';
  } else {
    // Generic error
    return 'Something went wrong. Please try again.';
  }
};
```

#### 2. Optimistic Updates

```tsx
// hooks/useOptimisticComments.ts
import { useState } from 'react';
import { useComments } from './useComments';

export const useOptimisticComments = (contentId: string, contentType: string) => {
  const [optimisticComments, setOptimisticComments] = useState([]);
  const commentsHook = useComments({ contentId, contentType });

  const createCommentOptimistic = async (content: string) => {
    // Add optimistic comment immediately
    const tempComment = {
      _id: `temp-${Date.now()}`,
      content,
      user: { email: 'You', roles: [] },
      createdAt: new Date().toISOString(),
      isOptimistic: true,
      likeCount: 0,
      dislikeCount: 0,
      reactions: [],
    };

    setOptimisticComments(prev => [tempComment, ...prev]);

    try {
      // Create actual comment
      const success = await commentsHook.createComment(content);

      if (success) {
        // Remove optimistic comment and reload
        setOptimisticComments(prev =>
          prev.filter(c => c._id !== tempComment._id)
        );
        await commentsHook.loadComments();
      }

      return success;
    } catch (error) {
      // Remove failed optimistic comment
      setOptimisticComments(prev =>
        prev.filter(c => c._id !== tempComment._id)
      );
      throw error;
    }
  };

  return {
    ...commentsHook,
    comments: [...optimisticComments, ...commentsHook.comments],
    createComment: createCommentOptimistic,
  };
};
```

#### 3. Performance Optimization

```tsx
// components/VirtualizedCommentList.tsx
import React from 'react';
import { FixedSizeList as List } from 'react-window';

interface VirtualizedCommentListProps {
  comments: any[];
  height: number;
  itemHeight: number;
}

export const VirtualizedCommentList: React.FC<VirtualizedCommentListProps> = ({
  comments,
  height,
  itemHeight,
}) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <CommentItem comment={comments[index]} />
    </div>
  );

  return (
    <List
      height={height}
      itemCount={comments.length}
      itemSize={itemHeight}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

#### 4. Accessibility

```tsx
// components/AccessibleCommentSection.tsx
import React from 'react';

export const AccessibleCommentSection: React.FC = () => {
  return (
    <section
      className="comment-section"
      role="region"
      aria-label="Comments and discussions"
    >
      <h2 id="comments-heading">Comments</h2>

      <div
        className="comments-list"
        role="feed"
        aria-labelledby="comments-heading"
        aria-live="polite"
      >
        {/* Comment items with proper ARIA labels */}
      </div>

      <form
        className="comment-form"
        aria-label="Add a new comment"
      >
        <label htmlFor="comment-input" className="sr-only">
          Comment content
        </label>
        <textarea
          id="comment-input"
          aria-describedby="comment-help"
          placeholder="Share your thoughts..."
        />
        <div id="comment-help" className="sr-only">
          Maximum 2000 characters. Use respectful language.
        </div>
      </form>
    </section>
  );
};
```

### Testing

#### Unit Tests

```tsx
// __tests__/CommentSection.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CommentSection } from '../components/CommentSection';
import { commentService } from '../services/commentService';

jest.mock('../services/commentService');

describe('CommentSection', () => {
  const mockProps = {
    contentId: 'test-content',
    contentType: 'guide_session' as const,
    userRole: 'guide',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders comment form and loads comments', async () => {
    const mockComments = [
      {
        _id: '1',
        content: 'Test comment',
        user: { email: 'test@example.com', roles: ['guide'] },
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    ];

    (commentService.getThreadedComments as jest.Mock).mockResolvedValue({
      data: { comments: mockComments },
      pagination: { page: 1, totalPages: 1 },
    });

    render(<CommentSection {...mockProps} />);

    expect(screen.getByPlaceholderText('Share your thoughts...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test comment')).toBeInTheDocument();
    });
  });

  it('creates a new comment', async () => {
    (commentService.createComment as jest.Mock).mockResolvedValue({});
    (commentService.getThreadedComments as jest.Mock).mockResolvedValue({
      data: { comments: [] },
      pagination: { page: 1, totalPages: 1 },
    });

    render(<CommentSection {...mockProps} />);

    const textarea = screen.getByPlaceholderText('Share your thoughts...');
    const submitButton = screen.getByText('Post Comment');

    fireEvent.change(textarea, { target: { value: 'New comment' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(commentService.createComment).toHaveBeenCalledWith({
        contentId: 'test-content',
        contentType: 'guide_session',
        content: 'New comment',
      });
    });
  });
});
```

### Integration Checklist

- [ ] **Authentication**: Ensure JWT tokens are properly handled
- [ ] **Authorization**: Implement role-based access control
- [ ] **Error Handling**: Handle all error scenarios gracefully
- [ ] **Loading States**: Show appropriate loading indicators
- [ ] **Optimistic Updates**: Implement for better UX
- [ ] **Real-time Updates**: Consider WebSocket integration
- [ ] **Accessibility**: Follow WCAG guidelines
- [ ] **Performance**: Implement virtualization for large lists
- [ ] **Testing**: Write comprehensive unit and integration tests
- [ ] **Responsive Design**: Ensure mobile compatibility
- [ ] **Rate Limiting**: Handle rate limit responses
- [ ] **Caching**: Implement client-side caching strategies

This comprehensive guide provides everything needed to implement a robust commenting system in your frontend application. The modular approach allows for easy customization and extension based on your specific requirements.
