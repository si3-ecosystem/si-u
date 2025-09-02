"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import { UserRole } from '@/types/api';

interface UseAdminAuthReturn {
  isAdmin: boolean;
  isLoading: boolean;
  user: any;
  checkingAuth: boolean;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const authV2 = useAppSelector((s) => (s as any).authV2);
  const status = authV2?.status as 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  const user = authV2?.user;

  // Ensure we're on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determine admin status using authV2
  const isAdmin = !!(status === 'authenticated' && user?.roles?.includes('admin' as UserRole));
  const isLoading = !isMounted || status === 'idle' || status === 'loading';
  const checkingAuth = isLoading;

  useEffect(() => {
    if (!isMounted) return;

    if (status === 'unauthenticated') {
      console.log('[useAdminAuth] User not logged in (authV2), redirecting to login');
      router.replace('/login?redirect=/admin/users');
      return;
    }

    if (status === 'authenticated' && !isAdmin) {
      console.log('[useAdminAuth] User not admin (authV2), redirecting to unauthorized');
      router.replace('/error?reason=unauthorized&role=admin');
      return;
    }
  }, [isMounted, status, isAdmin, router]);

  return {
    isAdmin,
    isLoading,
    user,
    checkingAuth,
  };
}