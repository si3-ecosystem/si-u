"use client";

import { useEffect } from 'react';
import { useAppSelector } from '@/redux/store';
import { UnifiedAuthService } from '@/services/authService';

/**
 * Hook to initialize authentication state from stored JWT token
 * This should be called once at the app level to restore user session
 */
export function useAuthInitializer() {
  const currentUser = useAppSelector(state => state.user);

  useEffect(() => {
    // Only initialize if user is not already initialized
    if (currentUser.isInitialized) {
      console.log('[useAuthInitializer] Already initialized, skipping');
      return;
    }

    // Use the unified auth service to initialize (it handles race conditions internally)
    const initializeAuth = async () => {
      try {
        console.log('[useAuthInitializer] Attempting to initialize authentication');
        await UnifiedAuthService.initialize();
      } catch (error) {
        console.error('[useAuthInitializer] Failed to initialize auth:', error);
      }
    };

    initializeAuth();
  }, [currentUser.isInitialized]);

  return {
    isInitialized: currentUser.isInitialized
  };
}
