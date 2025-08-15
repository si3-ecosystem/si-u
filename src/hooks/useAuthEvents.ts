/**
 * Hook for listening to authentication events
 * Provides a React-friendly way to listen to auth state changes
 */

import { useEffect, useCallback } from 'react';
import { UnifiedAuthService } from '@/services/authService';

export type AuthEventType = 'login' | 'logout' | 'refresh';

interface UseAuthEventsOptions {
  onLogin?: (userData: any) => void;
  onLogout?: () => void;
  onRefresh?: (userData: any) => void;
}

/**
 * Hook to listen to authentication events
 */
export function useAuthEvents(options: UseAuthEventsOptions = {}) {
  const { onLogin, onLogout, onRefresh } = options;

  useEffect(() => {
    const cleanupFunctions: (() => void)[] = [];

    // Set up login event listener
    if (onLogin) {
      const cleanup = UnifiedAuthService.onAuthEvent('login', onLogin);
      cleanupFunctions.push(cleanup);
    }

    // Set up logout event listener
    if (onLogout) {
      const cleanup = UnifiedAuthService.onAuthEvent('logout', onLogout);
      cleanupFunctions.push(cleanup);
    }

    // Set up refresh event listener
    if (onRefresh) {
      const cleanup = UnifiedAuthService.onAuthEvent('refresh', onRefresh);
      cleanupFunctions.push(cleanup);
    }

    // Cleanup all listeners on unmount
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [onLogin, onLogout, onRefresh]);

  // Return helper functions for manual event emission (for testing or special cases)
  const emitLogin = useCallback((userData: any) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:login', { detail: userData }));
    }
  }, []);

  const emitLogout = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  }, []);

  const emitRefresh = useCallback((userData: any) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:refresh', { detail: userData }));
    }
  }, []);

  return {
    emitLogin,
    emitLogout,
    emitRefresh,
  };
}

/**
 * Hook to listen to a specific auth event
 */
export function useAuthEvent(
  event: AuthEventType,
  handler: (data?: any) => void,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    const cleanup = UnifiedAuthService.onAuthEvent(event, handler);
    return cleanup;
  }, [event, handler, ...deps]);
}

/**
 * Hook to listen to login events specifically
 */
export function useAuthLogin(handler: (userData: any) => void, deps: React.DependencyList = []) {
  useAuthEvent('login', handler, deps);
}

/**
 * Hook to listen to logout events specifically
 */
export function useAuthLogout(handler: () => void, deps: React.DependencyList = []) {
  useAuthEvent('logout', handler, deps);
}

/**
 * Hook to listen to refresh events specifically
 */
export function useAuthRefresh(handler: (userData: any) => void, deps: React.DependencyList = []) {
  useAuthEvent('refresh', handler, deps);
}

/**
 * Hook that provides auth event utilities for components
 */
export function useAuthEventUtils() {
  const forceLogout = useCallback(async () => {
    try {
      await UnifiedAuthService.logout();
    } catch (error) {
      console.error('Error during forced logout:', error);
    }
  }, []);

  const forceRefresh = useCallback(async () => {
    try {
      await UnifiedAuthService.refreshUserData();
    } catch (error) {
      console.error('Error during forced refresh:', error);
    }
  }, []);

  const checkAuthStatus = useCallback(() => {
    return UnifiedAuthService.isAuthenticated();
  }, []);

  const getAuthState = useCallback(() => {
    return UnifiedAuthService.getAuthState();
  }, []);

  return {
    forceLogout,
    forceRefresh,
    checkAuthStatus,
    getAuthState,
  };
}
