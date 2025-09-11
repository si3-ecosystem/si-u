"use client";

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authApiV2 } from '@/services/authV2';
import { useAppDispatch } from '@/redux/store';
import { setAuthLoading, setAuthenticated, setUnauthenticated } from '@/redux/slice/authSliceV2';
import { setAllContent } from '@/redux/slice/contentSlice';

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
    queryFn: async () => authApiV2.me(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isLoading) return;
    if (error) {
      dispatch(setUnauthenticated());
      return;
    }
    const res: any = data as any;
    const user = res?.data?.user || res?.data?.data?.user || res?.data || null;
    if (user?._id || user?.id) {
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
      dispatch(setUnauthenticated());
    }
  }, [data, error, isLoading, dispatch]);

  return <>{children}</>;
}

export default AuthV2Provider;

