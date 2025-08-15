/**
 * Utility functions to fix authentication issues
 */

import { UnifiedAuthService } from '@/services/authService';

export class AuthFix {
  /**
   * Clear all authentication data and redirect to login
   */
  static async clearAuthAndRedirect() {
    try {
      // Use UnifiedAuthService logout which handles all cleanup
      await UnifiedAuthService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Force redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }

  /**
   * Check if user has authentication issues and needs to re-login
   */
  static hasAuthIssues(): boolean {
    try {
      // Use UnifiedAuthService for consistent auth checking
      return !UnifiedAuthService.isAuthenticated();
    } catch (error) {
      console.error('Error checking auth issues:', error);
      return true;
    }
  }

  /**
   * Force refresh the page to reload auth state
   */
  static forceRefresh() {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  /**
   * Get current user data from auth state
   */
  static getCurrentUserFromToken() {
    try {
      // Use UnifiedAuthService to get current auth state
      const authState = UnifiedAuthService.getAuthState();
      return authState.user;
    } catch (error) {
      console.error('Error getting user from auth state:', error);
      return null;
    }
  }
}
