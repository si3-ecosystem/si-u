"use client";

import { useEffect } from 'react';
import { useAppSelector } from '@/redux/store';
import { store } from '@/redux/store';
import { initializeUser } from '@/redux/slice/userSlice';
import { setAllContent } from '@/redux/slice/contentSlice';

// Temporary compatibility layer: mirror authV2.user into legacy userSlice
// Read-only bridge to stop pages from hanging on isInitialized and to populate header/profile until migrated
export default function AuthV2LegacyBridge({ children }: { children: React.ReactNode }) {
  const { status, user } = useAppSelector((s) => (s as any).authV2 || { status: 'idle', user: null });

  useEffect(() => {
    if (status === 'authenticated' && (user?._id || user?.id)) {
      store.dispatch(initializeUser({ ...(user as any), _id: (user as any)._id || (user as any).id }));
      
      // Process webcontent if available
      if ((user as any)?.webcontent) {
        console.log('[AuthV2LegacyBridge] Processing webcontent data');
        
        const webcontent = (user as any).webcontent;
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

        console.log('[AuthV2LegacyBridge] Updating content slice with webcontent data');
        store.dispatch(setAllContent(contentData));
      }
    }
    if (status === 'unauthenticated') {
      store.dispatch(initializeUser({} as any));
    }
  }, [status, user]);

  return <>{children}</>;
}

