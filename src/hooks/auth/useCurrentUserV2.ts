"use client";

import { useAppSelector } from '@/redux/store';

export interface CurrentUserState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
}

export function useCurrentUserV2(): CurrentUserState {
  // New source of truth
  const authV2 = useAppSelector((s) => (s as any).authV2);
  // Legacy fallback (temporary during migration)
  const legacy = useAppSelector((s) => (s as any).user);

  const v2Authed = authV2?.status === 'authenticated' && !!(authV2?.user?._id || authV2?.user?.id);
  const v2Loading = authV2?.status === 'loading';

  // Prefer new store; fallback to legacy only if new not ready
  const user = v2Authed ? authV2.user : (legacy?.user?._id ? legacy.user : null);
  const isAuthenticated = v2Authed || !!legacy?.isLoggedIn;
  const isLoading = v2Loading && !isAuthenticated;
  const isEmailVerified = !!(user?.isVerified || user?.isEmailVerified);

  return { user, isAuthenticated, isLoading, isEmailVerified };
}

