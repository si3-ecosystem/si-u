"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
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
  const { 
    user, 
    isLoggedIn, 
    isInitialized, 
    isInitializing 
  } = useSelector((state: RootState) => state.user);

  // Ensure we're on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only calculate admin status after mounting
  // const isAdmin = isMounted && isLoggedIn && user?.roles?.includes('admin' as UserRole);
  const isAdmin = true; // Temporarily disable admin check for testing
  const isLoading = !isMounted || isInitializing || !isInitialized;
  const checkingAuth = !isMounted || !isInitialized;

  useEffect(() => {
    // Only redirect if we're mounted, done initializing and user is not admin
    if (isMounted && isInitialized && !isInitializing) {
      if (!isLoggedIn) {
        console.log('[useAdminAuth] User not logged in, redirecting to login');
        router.replace('/login?redirect=/admin/dashboard');
        return;
      }

      if (!isAdmin) {
        console.log('[useAdminAuth] User not admin, redirecting to unauthorized');
        router.replace('/error?reason=unauthorized&role=admin');
        return;
      }
    }
  }, [isMounted, isInitialized, isInitializing, isLoggedIn, isAdmin, router]);

  return {
    isAdmin,
    isLoading,
    user,
    checkingAuth,
  };
}