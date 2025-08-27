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
   * Only detect actual loops, not legitimate redirects after successful auth
   */
  static checkRedirectLoop() {
    if (typeof window === 'undefined') return false;

    const currentPath = window.location.pathname;
    const referrer = document.referrer;

    // Track redirect history to detect actual loops
    const redirectHistory = sessionStorage.getItem('redirect-history');
    const history = redirectHistory ? JSON.parse(redirectHistory) : [];

    // Add current navigation to history
    const currentNavigation = {
      path: currentPath,
      referrer,
      timestamp: Date.now()
    };

    history.push(currentNavigation);

    // Keep only last 5 navigations and remove old ones (older than 30 seconds)
    const recentHistory = history
      .filter((nav: any) => Date.now() - nav.timestamp < 30000)
      .slice(-5);

    sessionStorage.setItem('redirect-history', JSON.stringify(recentHistory));

    // Check for actual redirect loop: same path visited 3+ times in 30 seconds
    const pathCounts = recentHistory.reduce((counts: any, nav: any) => {
      counts[nav.path] = (counts[nav.path] || 0) + 1;
      return counts;
    }, {});

    const isActualLoop = Object.values(pathCounts).some((count: any) => count >= 3);

    if (isActualLoop) {
      console.error('[AuthDebugger] ACTUAL REDIRECT LOOP DETECTED!', {
        currentPath,
        referrer,
        pathCounts,
        recentHistory,
        timestamp: new Date().toISOString()
      });

      // Log current auth state
      this.logAllCookies();

      return true;
    }

    // Log legitimate navigation for debugging
    console.log('[AuthDebugger] Navigation tracked:', {
      currentPath,
      referrer,
      pathCounts,
      isLegitimate: true
    });

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
