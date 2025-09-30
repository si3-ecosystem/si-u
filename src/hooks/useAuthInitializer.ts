"use client";

import { useEffect } from 'react';
import { useAppSelector, store } from '@/redux/store';
import { apiClient } from '@/services/api';
import { initializeUser } from '@/redux/slice/userSlice';
import { setAllContent, clearContent } from '@/redux/slice/contentSlice';

/**
 * Simplified hook to initialize authentication state from server
 * Relies on server-side authentication via cookies
 */
export function useAuthInitializer() {
  const currentUser = useAppSelector(state => state.user);

  useEffect(() => {
    console.log('[useAuthInitializer] Effect triggered:', {
      isInitialized: currentUser.isInitialized,
      hasUser: !!currentUser.user,
      userId: currentUser.user?._id,
      userEmail: currentUser.user?.email
    });

    // Always fetch fresh data from server to ensure we have the latest user information
    // This solves refresh issues and ensures data is always up-to-date
    console.log('[useAuthInitializer] Fetching fresh user data from server...');

    // Simple server-side auth check
    const initializeAuth = async () => {
      try {
        console.log('[useAuthInitializer] Fetching user data from server...');

        // Try to get user data from server using cookies
        const response = await apiClient.get<{ status: string; data: { user: any } }>('/auth/me');

        console.log('[useAuthInitializer] Full response object:', response);
        console.log('[useAuthInitializer] Response.data:', response.data);
        console.log('[useAuthInitializer] Response keys:', Object.keys(response));
        console.log('[useAuthInitializer] Response.data keys:', response.data ? Object.keys(response.data) : 'no data');

        // Check different possible response structures
        const userData = response.data?.user || response.data?.data?.user || response.data;
        console.log('[useAuthInitializer] Extracted user data:', userData);

        if (userData && (userData.id || userData._id)) {
          console.log('[useAuthInitializer] Found user data with id:', userData.id);

          // Normalize user data - ensure _id field exists (server returns 'id')
          const normalizedUserData = {
            ...userData,
            _id: userData._id || userData.id // Map 'id' to '_id' if needed
          };

          console.log('[useAuthInitializer] Normalized user data:', normalizedUserData);
          console.log('[useAuthInitializer] Server auth successful, user found:', normalizedUserData.email);

          // Initialize user in Redux store
          store.dispatch(initializeUser(normalizedUserData));

          // Process webcontent if available
          if (userData?.webcontent && !Array.isArray(userData.webcontent)) {
            console.log('[useAuthInitializer] Processing webcontent data');
            
            const webcontent = userData.webcontent;
            const contentData = {
              landing: webcontent.landing,
              slider: webcontent.slider,
              value: webcontent.value,
              live: webcontent.live,
              organizations: webcontent.organizations,
              timeline: webcontent.timeline,
              available: webcontent.available,
              socialChannels: webcontent.socialChannels,
              isNewWebpage: webcontent.isNewWebpage,
              domain: webcontent.domain,
              versionUpdated: webcontent.versionUpdated,
              version: webcontent.version
            };

            console.log('[useAuthInitializer] Updating content slice with actual webcontent data');
            store.dispatch(setAllContent(contentData));
          } else {
            console.log('[useAuthInitializer] No webcontent found during login - clearing persisted content and using initial values');
            // Clear persisted webcontent values and use initial values during login
            store.dispatch(clearContent());
          }
        } else {
          console.log('[useAuthInitializer] No valid user data from server');
          console.log('[useAuthInitializer] Response structure did not match expected format');
          // Initialize as not logged in
          store.dispatch(initializeUser({}));
        }
      } catch (error) {
    if (error.response?.status === 401) {
      console.log("[useAuthInitializer] Access token expired, trying refresh...");
      try {
        await apiClient.post("/auth/refresh");
        // Retry /auth/me after refreshing
        const retry = await apiClient.get("/auth/me");
        const userData = retry.data?.user || retry.data?.data?.user || retry.data;

        if (userData?.id) {
          store.dispatch(initializeUser({ ...userData, _id: userData.id }));
          return;
        }
      } catch (refreshError) {
        console.log("[useAuthInitializer] Refresh failed");
      }
    }
    store.dispatch(initializeUser({}));
      }
    };

    initializeAuth();
  }, []); // Run once on mount to always fetch fresh data

  return {
    isInitialized: currentUser.isInitialized
  };
}
