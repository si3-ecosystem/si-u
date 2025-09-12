"use client";

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/redux/store';
import { setAllContent } from '@/redux/slice/contentSlice';
import { useCurrentUserV2 } from '@/hooks/auth/useCurrentUserV2';
import { apiClient } from '@/services/api';

export function usePublisherContent() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useCurrentUserV2();
  const contentState = useSelector((state: RootState) => state.content);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if content is loaded
  const hasContent = !!(
    contentState.landing?.fullName ||
    contentState.slider?.length > 0 ||
    contentState.value?.experience ||
    contentState.live?.image ||
    contentState.timeline?.length > 0
  );

  useEffect(() => {
    const loadContent = async () => {
      // If content is already loaded, don't reload
      if (hasContent) {
        console.log('[usePublisherContent] Content already loaded');
        return;
      }

      // If user is not authenticated, don't try to load
      if (!isAuthenticated || !user) {
        console.log('[usePublisherContent] User not authenticated');
        return;
      }

      // If user has webcontent, use it
      if (user.webcontent) {
        console.log('[usePublisherContent] Loading content from user webcontent');
        const webcontent = user.webcontent;
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
          domain: webcontent.domain
        };
        dispatch(setAllContent(contentData));
        return;
      }

      // Try to fetch content from API
      try {
        setIsLoading(true);
        setError(null);
        console.log('[usePublisherContent] Fetching content from API');
        
        const response = await apiClient.get('/webcontent/get');
        if (response.status === 'success' && response.data) {
          console.log('[usePublisherContent] Content loaded from API:', response.data);
          dispatch(setAllContent(response.data));
        } else {
          console.log('[usePublisherContent] No content found in API response, using default content');
          // The default content is already in the contentSlice initialState
        }
      } catch (err: any) {
        console.error('[usePublisherContent] Error loading content:', err);
        console.log('[usePublisherContent] Using default content due to error');
        // Don't set error, just use default content
        setError(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [isAuthenticated, user, hasContent, dispatch]);

  return {
    contentState,
    hasContent,
    isLoading,
    error
  };
}
