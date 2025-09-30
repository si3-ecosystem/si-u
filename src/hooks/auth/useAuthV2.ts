"use client";

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setAuthLoading, setAuthenticated, setUnauthenticated, mergeUser } from '@/redux/slice/authSliceV2';
import { setAllContent, clearContent } from '@/redux/slice/contentSlice';
import { authApiV2 } from '@/services/authV2';

// Helper function to process webcontent data
const processWebContent = (user: any, dispatch: any, isLogin: boolean = false) => {
  if (user?.webcontent && !Array.isArray(user.webcontent)) {
    console.log('[useAuthV2] Processing webcontent data');
    
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

    console.log('[useAuthV2] Updating content slice with webcontent data');
    dispatch(setAllContent(contentData));
  } else {
    if (isLogin) {
      console.log('[useAuthV2] No webcontent found during login - clearing persisted content and using initial values');
      // Clear persisted webcontent values and use initial values during login
      dispatch(clearContent());
    } else {
      console.log('[useAuthV2] No webcontent found - skipping content update');
    }
  }
};

export function useAuthV2() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.authV2);

  const bootstrap = useCallback(async () => {
    dispatch(setAuthLoading());
    try {
      const res = await authApiV2.me();
      const user = (res as any).data?.user || (res as any).data?.data?.user || (res as any).data || null;
      if (user?.id || user?._id) {
        dispatch(setAuthenticated({ ...user, _id: user._id || user.id }));
        processWebContent(user, dispatch, true);
        return true;
      }
      dispatch(setUnauthenticated());
      return false;
    } catch (error) {
      console.error('[useAuthV2] Error during bootstrap:', error);
      dispatch(setUnauthenticated());
      return false;
    }
  }, [dispatch]);

  const startEmail = useCallback(async (email: string) => {
    await authApiV2.startEmailLogin(email);
    return true;
  }, []);

  const verifyEmail = useCallback(async (email: string, otp: string) => {
    const res = await authApiV2.verifyEmailLogin(email, otp);
    const data = (res as any).data;
    if (data?.user) {
      // Persist token if provided (for middleware/cookies)
      if (data.token && typeof document !== 'undefined') {
        try {
          localStorage.setItem('si3-jwt', data.token);
          const expires = new Date();
          expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000));
          document.cookie = `si3-jwt=${encodeURIComponent(data.token)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
        } catch {}
      }
      // Set immediate user from verify response
      const immediateUser = { ...data.user, _id: data.user._id || data.user.id };
      dispatch(setAuthenticated(immediateUser));
      // Fetch full profile to avoid placeholders/dummy data
      try {
        const meRes = await authApiV2.me();
        const user = (meRes as any).data?.user || (meRes as any).data?.data?.user || (meRes as any).data || null;
        if (user) {
          dispatch(mergeUser({ ...user, _id: user._id || user.id }));
          processWebContent(user, dispatch, true);
        }
      } catch (error) {
        console.error('[useAuthV2] Error fetching full profile:', error);
      }
      return true;
    }
    return false;
  }, [dispatch]);

  const logout = useCallback(async () => {
    try { await authApiV2.logout(); } catch {}
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('si3-jwt');
        // Clear cookie
        document.cookie = `si3-jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    } catch {}
    dispatch(setUnauthenticated());
  }, [dispatch]);

  const refresh = useCallback(async () => {
    const res = await authApiV2.refreshProfile();
    const data: any = (res as any).data || res;
    const user = data?.user || data?.data?.user || null;
    if (user) {
      dispatch(mergeUser({ ...user, _id: user._id || user.id }));
      processWebContent(user, dispatch);
    }
  }, [dispatch]);

  return { auth, bootstrap, startEmail, verifyEmail, logout, refresh };
}

