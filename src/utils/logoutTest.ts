/**
 * Logout Test Utility
 * 
 * This utility provides methods to test and verify the logout functionality
 * is working correctly and clearing all storage as expected.
 */

import { UnifiedAuthService } from '@/services/authService';
import { TokenCleanup } from './tokenCleanup';

export class LogoutTestUtility {
  /**
   * Simulate a user session with some data
   */
  static simulateUserSession(): void {
    if (typeof window === 'undefined') return;

    console.log('[LogoutTest] Simulating user session with test data...');
    
    // Simulate various auth tokens
    localStorage.setItem('si3-jwt', 'test-jwt-token');
    localStorage.setItem('token', 'test-fallback-token');
    localStorage.setItem('user-preferences', JSON.stringify({ theme: 'dark' }));
    localStorage.setItem('diversityTrackerChartShown', 'true');
    sessionStorage.setItem('session-data', 'test-session-data');
    
    // Simulate auth cookies
    document.cookie = 'si3-jwt=test-cookie-jwt; path=/';
    document.cookie = 'auth-token=test-auth-cookie; path=/';
    
    console.log('[LogoutTest] Test session data created');
  }

  /**
   * Check current storage state
   */
  static checkStorageState(): {
    localStorage: { [key: string]: string | null };
    sessionStorage: { [key: string]: string | null };
    cookies: string[];
  } {
    if (typeof window === 'undefined') {
      return { localStorage: {}, sessionStorage: {}, cookies: [] };
    }

    const testKeys = [
      'si3-jwt', 'token', 'user-preferences', 'diversityTrackerChartShown', 
      'session-data', 'auth-token', 'refresh-token'
    ];

    const result = {
      localStorage: {} as { [key: string]: string | null },
      sessionStorage: {} as { [key: string]: string | null },
      cookies: [] as string[]
    };

    // Check localStorage
    testKeys.forEach(key => {
      result.localStorage[key] = localStorage.getItem(key);
    });

    // Check sessionStorage  
    testKeys.forEach(key => {
      result.sessionStorage[key] = sessionStorage.getItem(key);
    });

    // Check cookies
    testKeys.forEach(key => {
      if (document.cookie.includes(`${key}=`)) {
        result.cookies.push(key);
      }
    });

    return result;
  }

  /**
   * Test logout functionality
   */
  static async testLogout(): Promise<{
    beforeLogout: ReturnType<typeof LogoutTestUtility.checkStorageState>;
    afterLogout: ReturnType<typeof LogoutTestUtility.checkStorageState>;
    success: boolean;
    issues: string[];
  }> {
    console.log('[LogoutTest] Starting logout functionality test...');
    
    // Create test session
    this.simulateUserSession();
    
    // Check state before logout
    const beforeLogout = this.checkStorageState();
    console.log('[LogoutTest] State before logout:', beforeLogout);
    
    // Perform logout (without redirect for testing)
    try {
      await UnifiedAuthService.logout({ redirect: false });
      console.log('[LogoutTest] Logout completed');
    } catch (error) {
      console.error('[LogoutTest] Logout failed:', error);
    }
    
    // Wait a moment for async cleanup to complete
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Check state after logout
    const afterLogout = this.checkStorageState();
    console.log('[LogoutTest] State after logout:', afterLogout);
    
    // Analyze results
    const issues: string[] = [];
    
    // Check if any localStorage items remain
    Object.entries(afterLogout.localStorage).forEach(([key, value]) => {
      if (value !== null) {
        issues.push(`localStorage item still exists: ${key} = ${value}`);
      }
    });
    
    // Check if any sessionStorage items remain
    Object.entries(afterLogout.sessionStorage).forEach(([key, value]) => {
      if (value !== null) {
        issues.push(`sessionStorage item still exists: ${key} = ${value}`);
      }
    });
    
    // Check if any cookies remain
    if (afterLogout.cookies.length > 0) {
      issues.push(`Cookies still exist: ${afterLogout.cookies.join(', ')}`);
    }
    
    const success = issues.length === 0;
    
    console.log('[LogoutTest] Test results:', {
      success,
      issues,
      beforeLogout,
      afterLogout
    });
    
    return {
      beforeLogout,
      afterLogout,
      success,
      issues
    };
  }

  /**
   * Test TokenCleanup utility
   */
  static testTokenCleanup(): {
    beforeCleanup: ReturnType<typeof LogoutTestUtility.checkStorageState>;
    afterCleanup: ReturnType<typeof LogoutTestUtility.checkStorageState>;
    success: boolean;
    issues: string[];
  } {
    console.log('[LogoutTest] Testing TokenCleanup utility...');
    
    // Create test session
    this.simulateUserSession();
    
    // Check state before cleanup
    const beforeCleanup = this.checkStorageState();
    console.log('[LogoutTest] State before TokenCleanup:', beforeCleanup);
    
    // Use TokenCleanup utility
    TokenCleanup.clearEverything();
    
    // Check state after cleanup
    const afterCleanup = this.checkStorageState();
    console.log('[LogoutTest] State after TokenCleanup:', afterCleanup);
    
    // Analyze results
    const issues: string[] = [];
    
    // Check if any items remain
    Object.entries(afterCleanup.localStorage).forEach(([key, value]) => {
      if (value !== null) {
        issues.push(`localStorage item still exists after TokenCleanup: ${key} = ${value}`);
      }
    });
    
    Object.entries(afterCleanup.sessionStorage).forEach(([key, value]) => {
      if (value !== null) {
        issues.push(`sessionStorage item still exists after TokenCleanup: ${key} = ${value}`);
      }
    });
    
    if (afterCleanup.cookies.length > 0) {
      issues.push(`Cookies still exist after TokenCleanup: ${afterCleanup.cookies.join(', ')}`);
    }
    
    const success = issues.length === 0;
    
    console.log('[LogoutTest] TokenCleanup test results:', {
      success,
      issues
    });
    
    return {
      beforeCleanup,
      afterCleanup,
      success,
      issues
    };
  }
}

// Make available globally for testing in browser console
if (typeof window !== 'undefined') {
  (window as any).logoutTest = LogoutTestUtility;
}