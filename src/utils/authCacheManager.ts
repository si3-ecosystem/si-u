/**
 * Authentication Cache Manager
 * Handles cache invalidation for user-specific data on auth state changes
 */

import { QueryClient } from '@tanstack/react-query';

export class AuthCacheManager {
  /**
   * User-specific query keys that should be cleared on logout
   */
  private static readonly USER_SPECIFIC_KEYS = [
    'user-rsvps',
    'profile',
    'notifications',
    'wallet',
    'user-settings',
    'user-preferences',
    'user-data',
    'auth',
    'me',
    'current-user',
    'user-profile',
    'user-wallet',
    'user-notifications',
    'user-sessions',
    'user-comments',
    'user-activities',
    'user-stats',
    'user-history',
    'admin', // Admin data is user-specific
  ];

  /**
   * Clear all user-specific cache data
   */
  static clearUserSpecificCache(queryClient: QueryClient): void {
    try {
      
      // Remove queries that start with user-specific keys
      this.USER_SPECIFIC_KEYS.forEach(key => {
        queryClient.removeQueries({ 
          queryKey: [key],
          exact: false // This will remove all queries that start with this key
        });
      });

      // Also remove any queries that contain user ID patterns
      this.clearUserIdBasedQueries(queryClient);
      
    } catch (error) {
      console.error('[AuthCacheManager] Error clearing user-specific cache:', error);
    }
  }

  /**
   * Clear queries that contain user IDs
   */
  private static clearUserIdBasedQueries(queryClient: QueryClient): void {
    try {
      const allQueries = queryClient.getQueryCache().getAll();
      
      allQueries.forEach(query => {
        const queryKey = query.queryKey;
        
        // Check if query key contains patterns that suggest user-specific data
        if (this.isUserSpecificQuery(queryKey)) {
          queryClient.removeQueries({ queryKey });
        }
      });
    } catch (error) {
      console.error('[AuthCacheManager] Error clearing user ID based queries:', error);
    }
  }

  /**
   * Check if a query key represents user-specific data
   */
  private static isUserSpecificQuery(queryKey: unknown[]): boolean {
    if (!Array.isArray(queryKey)) return false;
    
    const keyString = queryKey.join('-').toLowerCase();
    
    // Check for user-specific patterns
    const userPatterns = [
      'user-',
      'profile',
      'rsvp',
      'notification',
      'wallet',
      'setting',
      'preference',
      'auth',
      'me',
      'current',
      'admin',
      'dashboard-stats',
    ];

    return userPatterns.some(pattern => keyString.includes(pattern));
  }

  /**
   * Invalidate user-specific queries on login (refresh data for new user)
   */
  static invalidateUserSpecificCache(queryClient: QueryClient): void {
    try {
      
      this.USER_SPECIFIC_KEYS.forEach(key => {
        queryClient.invalidateQueries({ 
          queryKey: [key],
          exact: false
        });
      });
      
    } catch (error) {
      console.error('[AuthCacheManager] Error invalidating user-specific cache:', error);
    }
  }

  /**
   * Clear all cache data (nuclear option)
   */
  static clearAllCache(queryClient: QueryClient): void {
    try {
      queryClient.clear();
    } catch (error) {
      console.error('[AuthCacheManager] Error clearing all cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(queryClient: QueryClient): {
    totalQueries: number;
    userSpecificQueries: number;
    cacheSize: string;
  } {
    try {
      const allQueries = queryClient.getQueryCache().getAll();
      const userSpecificQueries = allQueries.filter(query => 
        this.isUserSpecificQuery(query.queryKey)
      );

      return {
        totalQueries: allQueries.length,
        userSpecificQueries: userSpecificQueries.length,
        cacheSize: `${allQueries.length} queries`,
      };
    } catch (error) {
      console.error('[AuthCacheManager] Error getting cache stats:', error);
      return {
        totalQueries: 0,
        userSpecificQueries: 0,
        cacheSize: 'Unknown',
      };
    }
  }

  /**
   * Clean up stale cache data (older than threshold)
   */
  static cleanupStaleCache(queryClient: QueryClient, maxAgeMs: number = 30 * 60 * 1000): void {
    try {
      
      const now = Date.now();
      const allQueries = queryClient.getQueryCache().getAll();
      
      allQueries.forEach(query => {
        if (
          query.state.dataUpdatedAt &&
          now - query.state.dataUpdatedAt > maxAgeMs
        ) {
          queryClient.removeQueries({ queryKey: query.queryKey });
        }
      });
      
    } catch (error) {
      console.error('[AuthCacheManager] Error cleaning up stale cache:', error);
    }
  }
}
