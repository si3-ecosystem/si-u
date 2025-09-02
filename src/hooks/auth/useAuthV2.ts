"use client";

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setAuthLoading, setAuthenticated, setUnauthenticated, mergeUser } from '@/redux/slice/authSliceV2';
import { authApiV2 } from '@/services/authV2';

export function useAuthV2() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => (s as any).authV2);

  const bootstrap = useCallback(async () => {
    dispatch(setAuthLoading());
    try {
      const res = await authApiV2.me();
      const user = (res as any).data?.user || (res as any).data || res?.data?.data || null;
      if (user?.id || user?._id) {
        dispatch(setAuthenticated({ ...user, _id: user._id || user.id }));
        return true;
      }
      dispatch(setUnauthenticated());
      return false;
    } catch (e) {
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
        const user = (meRes as any).data?.user || (meRes as any).data || meRes?.data?.data || null;
        if (user) {
          dispatch(mergeUser({ ...user, _id: user._id || user.id }));
        }
      } catch {}
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
    if (user) dispatch(mergeUser({ ...user, _id: user._id || user.id }));
  }, [dispatch]);

  return { auth, bootstrap, startEmail, verifyEmail, logout, refresh };
}

