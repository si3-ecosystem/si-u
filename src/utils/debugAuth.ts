/**
 * Debug utilities for authentication issues
 */

export class AuthDebugger {
  /**
   * Log all cookies in the browser
   */
  static logAllCookies() {
    if (typeof window === 'undefined') return;
    
    console.log('[AuthDebugger] All cookies:', document.cookie);
    
    // Parse and display cookies in a readable format
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      if (name) {
        acc[name] = value || '';
      }
      return acc;
    }, {} as Record<string, string>);
    
    console.log('[AuthDebugger] Parsed cookies:', cookies);
    
    // Check specifically for auth-related cookies
    const authCookies = Object.keys(cookies).filter(name => 
      name.includes('jwt') || name.includes('auth') || name.includes('token')
    );
    
    console.log('[AuthDebugger] Auth-related cookies:', authCookies.map(name => ({
      name,
      value: cookies[name],
      length: cookies[name]?.length || 0
    })));
  }

  /**
   * Clear all auth-related cookies manually
   */
  static clearAllAuthCookies() {
    if (typeof window === 'undefined') return;
    
    console.log('[AuthDebugger] Clearing all auth cookies...');
    
    const cookiesToClear = ['si3-jwt', 'auth-token', 'token', 'jwt'];
    const paths = ['/', '/login', '/dashboard'];
    const domains = [window.location.hostname, `.${window.location.hostname}`, 'localhost'];
    
    cookiesToClear.forEach(cookieName => {
      paths.forEach(path => {
        domains.forEach(domain => {
          // Clear with domain
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; SameSite=Lax;`;
          // Clear without domain
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Lax;`;
        });
      });
      
      // Also clear with no path specified
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax;`;
    });
    
    console.log('[AuthDebugger] Auth cookies cleared');
    this.logAllCookies();
  }

  /**
   * Check if there's a redirect loop happening
   */
  static checkRedirectLoop() {
    if (typeof window === 'undefined') return false;
    
    const currentPath = window.location.pathname;
    const referrer = document.referrer;
    
    // Check if we're bouncing between login and dashboard
    const isRedirectLoop = (
      (currentPath === '/login' && referrer.includes('/dashboard')) ||
      (currentPath === '/dashboard' && referrer.includes('/login'))
    );
    
    if (isRedirectLoop) {
      console.error('[AuthDebugger] REDIRECT LOOP DETECTED!', {
        currentPath,
        referrer,
        timestamp: new Date().toISOString()
      });
      
      // Log current auth state
      this.logAllCookies();
      
      return true;
    }
    
    return false;
  }

  /**
   * Force redirect to login with clean state
   */
  static forceLoginRedirect() {
    if (typeof window === 'undefined') return;
    
    console.log('[AuthDebugger] Forcing clean login redirect...');
    
    // Clear all auth cookies
    this.clearAllAuthCookies();
    
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Add a flag to prevent immediate redirect back
    sessionStorage.setItem('force-login', 'true');
    
    // Force redirect
    window.location.replace('/login');
  }

  /**
   * Check if we're in a forced login state
   */
  static isForcedLogin(): boolean {
    if (typeof window === 'undefined') return false;
    
    return sessionStorage.getItem('force-login') === 'true';
  }

  /**
   * Clear forced login flag
   */
  static clearForcedLogin() {
    if (typeof window === 'undefined') return;
    
    sessionStorage.removeItem('force-login');
  }
}

// Global debug function for easy access in browser console
if (typeof window !== 'undefined') {
  (window as any).authDebug = AuthDebugger;
}
