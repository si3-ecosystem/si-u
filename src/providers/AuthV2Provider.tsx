"use client";

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authApiV2 } from '@/services/authV2';
import { useAppDispatch } from '@/redux/store';
import { setAuthLoading, setAuthenticated, setUnauthenticated } from '@/redux/slice/authSliceV2';
import { setAllContent, clearContent } from '@/redux/slice/contentSlice';
// Token validation and auth data clearing utilities
const validateToken = (token: string | null): boolean => {
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < now) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('si3-jwt');
    document.cookie = 'si3-jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  } catch (error) {
    // Silently handle errors
  }
};

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
    if (isLoading) return;
    
    if (error) {
      // If it's a 401 error, clear auth data and redirect
      if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
        clearAuthData();
      }
      
      dispatch(setUnauthenticated());
      return;
    }
    
    const res: any = data as any;
    const user = res?.data?.user || res?.data?.data?.user || res?.data || null;

    if (user?._id || user?.id) {
      dispatch(setAuthenticated({ ...user, _id: user._id || user.id }));
      
      // Process webcontent if available
      if (user?.webcontent && !Array.isArray(user.webcontent)) {
        // webcontent is an object with actual data
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
          domain: webcontent.domain,
          versionUpdated: webcontent.versionUpdated,
          version: webcontent.version
        };

        dispatch(setAllContent(contentData));
      } else {
        console.log('[AuthV2Provider] No webcontent found or empty array - clearing persisted content and using initial values');
        // Clear persisted webcontent values and use initial values
        dispatch(clearContent());
      }
    } else {
      dispatch(setUnauthenticated());
    }
  }, [data, error, isLoading, dispatch]);

  return <>{children}</>;
}

export default AuthV2Provider;

