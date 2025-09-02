"use client";

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authApiV2 } from '@/services/authV2';
import { useAppDispatch } from '@/redux/store';
import { setAuthLoading, setAuthenticated, setUnauthenticated } from '@/redux/slice/authSliceV2';

export function AuthV2Provider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAuthLoading());
  }, [dispatch]);

  useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => authApiV2.me(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    onSuccess: (res) => {
      const user = (res as any).data?.user || (res as any).data || (res as any).data?.data || null;
      if (user?._id || user?.id) {
        dispatch(setAuthenticated({ ...user, _id: user._id || user.id }));
      } else {
        dispatch(setUnauthenticated());
      }
    },
    onError: () => {
      dispatch(setUnauthenticated());
    },
  });

  return <>{children}</>;
}

export default AuthV2Provider;

