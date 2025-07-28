import { BaseService } from './base.service';
import {
  Comment,
  CreateCommentData,
  UpdateCommentData,
  CommentReactionData,
  CommentQueryParams,
  ThreadedCommentQueryParams,
  UserCommentsQueryParams,
  CommentRepliesQueryParams,
  CommentsResponse,
  ThreadedCommentsResponse,
  CommentStatsResponse,
} from '@/types/comment';
import { ApiResponse } from '@/types/api';

/**
 * Comment service for managing all comment-related API operations
 * Implements the backend API documented in COMMENTING_SYSTEM_GUIDE.md
 */
export class CommentService extends BaseService {
  constructor() {
    super({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    });
  }

  /**
   * Create a new comment
   */
  async createComment(data: CreateCommentData): Promise<ApiResponse<{ comment: Comment }>> {
    this.logRequest('POST', '/api/comments', data);
    return this.post<{ comment: Comment }>('/api/comments', data);
  }

  /**
   * Get comments for specific content
   */
  async getComments(params: CommentQueryParams): Promise<ApiResponse<CommentsResponse>> {
    const queryString = this.buildQueryString({
      contentId: params.contentId,
      contentType: params.contentType,
      page: params.page || 1,
      limit: params.limit || 20,
      includeReplies: params.includeReplies || false,
    });

    this.logRequest('GET', `/api/comments/content?${queryString}`);
    return this.get<CommentsResponse>(`/api/comments/content?${queryString}`);
  }

  /**
   * Get threaded comments (optimized for nested display)
   */
  async getThreadedComments(params: ThreadedCommentQueryParams): Promise<ApiResponse<ThreadedCommentsResponse>> {
    const queryString = this.buildQueryString({
      contentId: params.contentId,
      contentType: params.contentType,
      page: params.page || 1,
      limit: params.limit || 20,
    });

    this.logRequest('GET', `/api/comments/content/threaded?${queryString}`);
    return this.get<ThreadedCommentsResponse>(`/api/comments/content/threaded?${queryString}`);
  }

  /**
   * Get comment statistics for content
   */
  async getCommentStats(contentId: string, contentType: string): Promise<ApiResponse<CommentStatsResponse>> {
    const queryString = this.buildQueryString({ contentId, contentType });
    
    this.logRequest('GET', `/api/comments/content/stats?${queryString}`);
    return this.get<CommentStatsResponse>(`/api/comments/content/stats?${queryString}`);
  }

  /**
   * Update a comment
   */
  async updateComment(commentId: string, data: UpdateCommentData): Promise<ApiResponse<{ comment: Comment }>> {
    this.logRequest('PUT', `/api/comments/${commentId}`, data);
    return this.put<{ comment: Comment }>(`/api/comments/${commentId}`, data);
  }

  /**
   * Delete a comment
   */
  async deleteComment(commentId: string): Promise<ApiResponse<void>> {
    this.logRequest('DELETE', `/api/comments/${commentId}`);
    return this.delete<void>(`/api/comments/${commentId}`);
  }

  /**
   * Get user's comments
   */
  async getUserComments(params: UserCommentsQueryParams = {}): Promise<ApiResponse<CommentsResponse>> {
    const queryString = this.buildQueryString({
      page: params.page || 1,
      limit: params.limit || 20,
    });

    this.logRequest('GET', `/api/comments/my-comments?${queryString}`);
    return this.get<CommentsResponse>(`/api/comments/my-comments?${queryString}`);
  }

  /**
   * Get replies for a specific comment
   */
  async getCommentReplies(params: CommentRepliesQueryParams): Promise<ApiResponse<CommentsResponse>> {
    const queryString = this.buildQueryString({
      page: params.page || 1,
      limit: params.limit || 20,
    });

    this.logRequest('GET', `/api/comments/${params.commentId}/replies?${queryString}`);
    return this.get<CommentsResponse>(`/api/comments/${params.commentId}/replies?${queryString}`);
  }

  /**
   * Add reaction (like/dislike) to a comment
   */
  async reactToComment(
    commentId: string, 
    data: CommentReactionData
  ): Promise<ApiResponse<{ comment: Comment; userReaction: string }>> {
    this.logRequest('POST', `/api/comments/${commentId}/react`, data);
    return this.post<{ comment: Comment; userReaction: string }>(`/api/comments/${commentId}/react`, data);
  }

  /**
   * Remove reaction from a comment
   */
  async removeReaction(commentId: string): Promise<ApiResponse<{ comment: Comment }>> {
    this.logRequest('DELETE', `/api/comments/${commentId}/react`);
    return this.delete<{ comment: Comment }>(`/api/comments/${commentId}/react`);
  }

  /**
   * Get single comment by ID
   */
  async getCommentById(commentId: string): Promise<ApiResponse<{ comment: Comment }>> {
    this.logRequest('GET', `/api/comments/${commentId}`);
    return this.get<{ comment: Comment }>(`/api/comments/${commentId}`);
  }

  /**
   * Batch operations for multiple comments
   */
  async batchDeleteComments(commentIds: string[]): Promise<ApiResponse<{ deletedCount: number }>> {
    this.logRequest('POST', '/api/comments/batch/delete', { commentIds });
    return this.post<{ deletedCount: number }>('/api/comments/batch/delete', { commentIds });
  }

  /**
   * Report a comment for moderation
   */
  async reportComment(commentId: string, reason: string): Promise<ApiResponse<void>> {
    this.logRequest('POST', `/api/comments/${commentId}/report`, { reason });
    return this.post<void>(`/api/comments/${commentId}/report`, { reason });
  }

  /**
   * Get comment analytics for admin users
   */
  async getCommentAnalytics(
    contentId?: string, 
    contentType?: string, 
    dateRange?: { start: string; end: string }
  ): Promise<ApiResponse<any>> {
    const params: any = {};
    if (contentId) params.contentId = contentId;
    if (contentType) params.contentType = contentType;
    if (dateRange) {
      params.startDate = dateRange.start;
      params.endDate = dateRange.end;
    }

    const queryString = this.buildQueryString(params);
    this.logRequest('GET', `/api/comments/analytics?${queryString}`);
    return this.get<any>(`/api/comments/analytics?${queryString}`);
  }
}

// Export singleton instance
export const commentService = new CommentService();
