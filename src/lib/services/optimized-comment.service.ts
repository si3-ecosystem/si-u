import { BaseService } from './base.service';
import {
  Comment,
  CreateCommentData,
  UpdateCommentData,
  ThreadedCommentQueryParams,
  ThreadedCommentsResponse,
  CommentStatsResponse,
  ContentType,
} from '@/types/comment';

/**
 * Optimized Comment Service for TanStack Query integration
 * Provides all comment operations with proper error handling and logging
 */
export class OptimizedCommentService extends BaseService {
  constructor() {
    super({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    });
  }

  // Query Keys Factory for consistent cache management
  static getQueryKeys() {
    return {
      all: ['comments'] as const,
      lists: () => [...OptimizedCommentService.getQueryKeys().all, 'list'] as const,
      list: (contentId: string, contentType: ContentType) => 
        [...OptimizedCommentService.getQueryKeys().lists(), contentId, contentType] as const,
      threaded: (contentId: string, contentType: ContentType, page: number = 1) =>
        [...OptimizedCommentService.getQueryKeys().list(contentId, contentType), 'threaded', page] as const,
      stats: (contentId: string, contentType: ContentType) =>
        [...OptimizedCommentService.getQueryKeys().list(contentId, contentType), 'stats'] as const,
      detail: (commentId: string) => 
        [...OptimizedCommentService.getQueryKeys().all, 'detail', commentId] as const,
      userReaction: (commentId: string) =>
        [...OptimizedCommentService.getQueryKeys().detail(commentId), 'reaction'] as const,
    };
  }

  /**
   * Get threaded comments with optimized caching
   */
  async getThreadedComments(params: ThreadedCommentQueryParams): Promise<ThreadedCommentsResponse> {
    const queryString = this.buildQueryString({
      contentId: params.contentId,
      contentType: params.contentType,
      page: params.page || 1,
      limit: params.limit || 20,
    });

    this.logRequest('GET', `/api/comments/content/threaded?${queryString}`);
    
    try {
      const response = await this.get<ThreadedCommentsResponse>(
        `/api/comments/content/threaded?${queryString}`
      );
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      this.logError('getThreadedComments', error);
      throw error;
    }
  }

  /**
   * Get comment statistics
   */
  async getCommentStats(contentId: string, contentType: ContentType): Promise<CommentStatsResponse> {
    const queryString = this.buildQueryString({ contentId, contentType });
    
    this.logRequest('GET', `/api/comments/content/stats?${queryString}`);
    
    try {
      const response = await this.get<CommentStatsResponse>(
        `/api/comments/content/stats?${queryString}`
      );
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      this.logError('getCommentStats', error);
      throw error;
    }
  }

  /**
   * Create a new comment with optimistic update support
   */
  async createComment(data: CreateCommentData): Promise<Comment> {
    this.logRequest('POST', '/api/comments', data);
    
    try {
      const response = await this.post<{ comment: Comment }>('/api/comments', data);
      if (!response.data?.comment) {
        throw new Error('No comment data received from server');
      }
      return response.data.comment;
    } catch (error) {
      this.logError('createComment', error);
      throw error;
    }
  }

  /**
   * Update an existing comment
   */
  async updateComment(commentId: string, data: UpdateCommentData): Promise<Comment> {
    this.logRequest('PUT', `/api/comments/${commentId}`, data);
    
    try {
      const response = await this.put<{ comment: Comment }>(`/api/comments/${commentId}`, data);
      if (!response.data?.comment) {
        throw new Error('No comment data received from server');
      }
      return response.data.comment;
    } catch (error) {
      this.logError('updateComment', error);
      throw error;
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(commentId: string): Promise<void> {
    this.logRequest('DELETE', `/api/comments/${commentId}`);
    
    try {
      await this.delete<void>(`/api/comments/${commentId}`);
    } catch (error) {
      this.logError('deleteComment', error);
      throw error;
    }
  }

  /**
   * Add reaction to comment with optimistic update support
   */
  async reactToComment(commentId: string, data: { type: 'like' | 'dislike' }): Promise<{
    comment: Comment;
    userReaction: string;
  }> {
    this.logRequest('POST', `/api/comments/${commentId}/react`, data);
    
    try {
      const response = await this.post<{ comment: Comment; userReaction: string }>(
        `/api/comments/${commentId}/react`,
        data
      );
      if (!response.data) {
        throw new Error('No response data received from server');
      }
      return response.data;
    } catch (error) {
      this.logError('reactToComment', error);
      throw error;
    }
  }

  /**
   * Remove reaction from comment
   */
  async removeReaction(commentId: string): Promise<Comment> {
    this.logRequest('DELETE', `/api/comments/${commentId}/react`);
    
    try {
      const response = await this.delete<{ comment: Comment }>(`/api/comments/${commentId}/react`);
      if (!response.data?.comment) {
        throw new Error('No comment data received from server');
      }
      return response.data.comment;
    } catch (error) {
      this.logError('removeReaction', error);
      throw error;
    }
  }

  /**
   * Get user's reaction to a specific comment
   */
  async getUserReaction(commentId: string): Promise<{ userReaction: string | null }> {
    this.logRequest('GET', `/api/comments/${commentId}/my-reaction`);
    
    try {
      const response = await this.get<{ userReaction: string | null }>(
        `/api/comments/${commentId}/my-reaction`
      );
      if (!response.data) {
        throw new Error('No response data received from server');
      }
      return response.data;
    } catch (error) {
      this.logError('getUserReaction', error);
      throw error;
    }
  }

  /**
   * Get single comment by ID
   */
  async getCommentById(commentId: string): Promise<Comment> {
    this.logRequest('GET', `/api/comments/${commentId}`);
    
    try {
      const response = await this.get<{ comment: Comment }>(`/api/comments/${commentId}`);
      if (!response.data?.comment) {
        throw new Error('No comment data received from server');
      }
      return response.data.comment;
    } catch (error) {
      this.logError('getCommentById', error);
      throw error;
    }
  }

  /**
   * Enhanced error logging
   */
  private logError(operation: string, error: any) {
    console.error(`[OptimizedCommentService] ${operation} failed:`, {
      error: error.message || error,
      timestamp: new Date().toISOString(),
    });
  }
}

// Export singleton instance
export const optimizedCommentService = new OptimizedCommentService();
