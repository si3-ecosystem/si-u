/**
 * Token Cleanup Utility
 * 
 * Provides centralized token management and cleanup to ensure
 * consistent token handling across the application.
 */

export class TokenCleanup {
  // All possible token keys used throughout the app
  private static readonly TOKEN_KEYS = [
    'si3-jwt',
    'si3-token', 
    'token',
    'auth-token',
    'refresh-token',
    'session-token',
    'access-token',
    'user-token',
    'authentication',
    'authorization'
  ];

  // All possible storage keys that might contain user/auth data
  private static readonly STORAGE_KEYS = [
    'si3-jwt',
    'si3-token',
    'token',
    'user-preferences',
    'auth-state',
    'diversityTrackerChartShown',
    'user-data',
    'auth-token',
    'refresh-token',
    'session-data',
    'notification-settings',
    'theme-preference',
    'language-preference'
  ];

  /**
   * Clear all possible token keys from localStorage
   */
  static clearAllTokensFromLocalStorage(): void {
    if (typeof window === 'undefined') return;

    this.TOKEN_KEYS.forEach(key => {
      try {
        localStorage.removeItem(key);
        console.log(`[TokenCleanup] Removed localStorage key: ${key}`);
      } catch (error) {
        console.warn(`[TokenCleanup] Failed to remove localStorage key: ${key}`, error);
      }
    });
  }

  /**
   * Clear all auth-related data from localStorage
   */
  static clearAllAuthDataFromLocalStorage(): void {
    if (typeof window === 'undefined') return;

    this.STORAGE_KEYS.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`[TokenCleanup] Failed to remove localStorage key: ${key}`, error);
      }
    });

    console.log('[TokenCleanup] All auth-related localStorage data cleared');
  }

  /**
   * Clear all sessionStorage data
   */
  static clearAllSessionStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.clear();
      console.log('[TokenCleanup] All sessionStorage cleared');
    } catch (error) {
      console.error('[TokenCleanup] Failed to clear sessionStorage:', error);
    }
  }

  /**
   * Clear all possible auth cookies
   */
  static clearAllAuthCookies(): void {
    if (typeof window === 'undefined') return;

    const paths = ['/', '/login', '/home', '/admin', '/profile', '/settings'];
    const domains = [
      window.location.hostname,
      `.${window.location.hostname}`,
      'localhost',
      '.localhost'
    ];

    this.TOKEN_KEYS.forEach(cookieName => {
      // Clear with all path/domain combinations
      paths.forEach(path => {
        domains.forEach(domain => {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; SameSite=Lax;`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Lax;`;
        });
      });

      // Also clear with no path/domain specified
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax;`;
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax;`;
    });

    console.log('[TokenCleanup] All auth cookies cleared');
  }

  /**
   * Nuclear option: Clear everything
   */
  static clearEverything(): void {
    console.log('[TokenCleanup] Starting nuclear cleanup...');
    
    this.clearAllTokensFromLocalStorage();
    this.clearAllAuthDataFromLocalStorage();
    this.clearAllSessionStorage();
    this.clearAllAuthCookies();
    
    // Force clear entire localStorage as backup
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    } catch (error) {
      console.warn('[TokenCleanup] Failed to clear entire localStorage:', error);
    }

    console.log('[TokenCleanup] Nuclear cleanup completed');
  }

  /**
   * Get the primary token key used by the app
   */
  static getPrimaryTokenKey(): string {
    return 'si3-jwt';
  }

  /**
   * Check if any tokens exist in storage
   */
  static hasAnyTokens(): boolean {
    if (typeof window === 'undefined') return false;

    // Check localStorage
    for (const key of this.TOKEN_KEYS) {
      if (localStorage.getItem(key)) {
        return true;
      }
    }

    // Check cookies
    for (const key of this.TOKEN_KEYS) {
      if (document.cookie.includes(`${key}=`)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Log current storage state for debugging
   */
  static logCurrentState(): void {
    if (typeof window === 'undefined') return;

    console.log('[TokenCleanup] Current storage state:');
    
    // Log localStorage
    const localStorageItems: { [key: string]: string | null } = {};
    this.STORAGE_KEYS.forEach(key => {
      localStorageItems[key] = localStorage.getItem(key);
    });
    console.log('localStorage:', localStorageItems);

    // Log sessionStorage
    const sessionStorageItems: { [key: string]: string | null } = {};
    this.STORAGE_KEYS.forEach(key => {
      sessionStorageItems[key] = sessionStorage.getItem(key);
    });
    console.log('sessionStorage:', sessionStorageItems);

    // Log cookies
    const cookieItems: { [key: string]: boolean } = {};
    this.TOKEN_KEYS.forEach(key => {
      cookieItems[key] = document.cookie.includes(`${key}=`);
    });
    console.log('cookies:', cookieItems);
  }
}