/**
 * Utility functions to fix authentication issues
 */

export class AuthFix {
  /**
   * Clear all authentication data and redirect to login
   */
  static clearAuthAndRedirect() {
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem('si3-jwt');
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear cookies by setting them to expire
      document.cookie = 'si3-jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Redirect to login
      window.location.href = '/login';
    }
  }

  /**
   * Check if user has authentication issues and needs to re-login
   */
  static hasAuthIssues(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const token = localStorage.getItem('si3-jwt');
      if (!token) return false;
      
      // Basic JWT structure check
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      
      // Try to decode payload
      const payload = JSON.parse(atob(parts[1]));
      
      // Check if token is expired
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return true;
      }
      
      return false;
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
   * Get current user data from JWT token
   */
  static getCurrentUserFromToken() {
    if (typeof window === 'undefined') return null;
    
    try {
      const token = localStorage.getItem('si3-jwt');
      if (!token) return null;
      
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (error) {
      console.error('Error getting user from token:', error);
      return null;
    }
  }
}
