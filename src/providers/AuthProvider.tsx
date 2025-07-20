"use client";

import { useEffect, useState, useRef } from 'react';
import { useAppDispatch } from '@/redux/store';
import { setUser, setConnected, setLoading, resetUser } from '@/redux/slice/userSlice';
import { authService } from '@/lib/api/authService';

interface AuthProviderProps {
  children: React.ReactNode;
}

// Global flag to prevent multiple initializations
let isInitializing = false;
let hasInitialized = false;

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const [isClient, setIsClient] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || initRef.current || hasInitialized || isInitializing) return;

    initRef.current = true;
    isInitializing = true;

    const initializeAuth = async () => {
      try {
        dispatch(setLoading(true));

        const isAuth = authService.isAuthenticated();

        if (typeof window !== 'undefined' && isAuth) {
          try {
            const response = await authService.checkAuth();
            if (response?.data?.user) {
              dispatch(setUser(response.data.user));
              dispatch(setConnected(true));
            } else {
              dispatch(resetUser());
            }
          } catch (error) {
            console.error('AuthProvider: Auth check failed:', error);
            authService.clearAuth();
            dispatch(resetUser());
          }
        } else {
          dispatch(resetUser());
        }
      } catch (error) {
        console.error('AuthProvider: Auth initialization failed:', error);
        dispatch(resetUser());
      } finally {
        dispatch(setLoading(false));
        isInitializing = false;
        hasInitialized = true;
      }
    };

    initializeAuth();
  }, [dispatch, isClient]);

  return <>{children}</>;
}
