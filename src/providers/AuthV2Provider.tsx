"use client";

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authApiV2 } from '@/services/authV2';
import { useAppDispatch } from '@/redux/store';
import { setAuthLoading, setAuthenticated, setUnauthenticated } from '@/redux/slice/authSliceV2';
import { setAllContent } from '@/redux/slice/contentSlice';
import { debugAuthState, validateToken, clearAuthData } from '@/utils/authDebug';

interface AuthV2ProviderProps {
  readonly children: React.ReactNode;
}

export function AuthV2Provider({ children }: AuthV2ProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAuthLoading());
  }, [dispatch]);

  const { data, error, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      // Check if we have a valid token before making the request
      const token = localStorage.getItem('si3-jwt');
      if (!token || !validateToken(token)) {
        clearAuthData();
        throw new Error('No valid token found');
      }
      
      return authApiV2.me();
    },
    retry: (failureCount, error) => {
      // Only retry once for 401 errors
      if (failureCount < 1 && error?.message?.includes('401')) {
        return true;
      }
      return false;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    enabled: typeof window !== 'undefined', // Only run on client side
  });

  useEffect(() => {
    console.log('[AuthV2Provider] Auth state change:', {
      isLoading,
      hasError: !!error,
      hasData: !!data,
      errorMessage: error?.message || 'none'
    });

    if (isLoading) return;
    
    if (error) {
      console.log('[AuthV2Provider] Authentication error, setting unauthenticated:', error);
      
      // If it's a 401 error, clear auth data and redirect
      if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
        console.log('[AuthV2Provider] 401 Unauthorized error, clearing auth data');
        clearAuthData();
      }
      
      dispatch(setUnauthenticated());
      return;
    }
    
    const res: any = data as any;
    const user = res?.data?.user || res?.data?.data?.user || res?.data || null;
    
    console.log('[AuthV2Provider] User data received:', {
      hasUser: !!user,
      userId: user?._id || user?.id,
      userEmail: user?.email,
      responseStructure: {
        hasData: !!res?.data,
        hasUserInData: !!res?.data?.user,
        hasDataInData: !!res?.data?.data?.user
      }
    });

    if (user?._id || user?.id) {
      console.log('[AuthV2Provider] User authenticated successfully');
      dispatch(setAuthenticated({ ...user, _id: user._id || user.id }));
      
      // Process webcontent if available
      if (user?.webcontent) {
        console.log('[AuthV2Provider] Processing webcontent data');
        
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

        console.log('[AuthV2Provider] Updating content slice with webcontent data:', {
          hasLanding: !!contentData.landing?.fullName,
          hasSlider: contentData.slider?.length > 0,
          hasLive: !!contentData.live?.image,
          domain: contentData.domain,
          isNewWebpage: contentData.isNewWebpage
        });

        dispatch(setAllContent(contentData));
      } else {
        console.log('[AuthV2Provider] No webcontent found - skipping content update');
      }
    } else {
      console.log('[AuthV2Provider] No valid user data, setting unauthenticated');
      dispatch(setUnauthenticated());
    }
  }, [data, error, isLoading, dispatch]);

  return <>{children}</>;
}

export default AuthV2Provider;

