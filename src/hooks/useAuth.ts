"use client";

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
  setUser,
  setAddress,
  setConnected,
  resetUser,
  setLoading,
  setError
} from '@/redux/slice/userSlice';
import { authService } from '@/lib/api/authService';
import type {
  UseAuthReturn,
  LoginCredentials,
  WalletCredentials,
  User
} from '@/types/auth';

export function useAuth(): UseAuthReturn {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const { user, address, isLoggedIn, isLoading, error } = useAppSelector(
    (state) => state.user
  );

  // Set client flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);



  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      let response;
      if (credentials.otp) {
        // Verify OTP
        response = await authService.verifyEmailOTP(credentials.email, credentials.otp);
      } else {
        // Send OTP
        response = await authService.sendEmailOTP(credentials.email);
        return; // Don't proceed to user setting for OTP send
      }

      if (response.data?.user) {
        dispatch(setUser(response.data.user));
        dispatch(setConnected(true));
        
        // Redirect to dashboard or intended page
        router.push('/dashboard');
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Login failed'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, router]);

  const loginWithWallet = useCallback(async (credentials: WalletCredentials) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await authService.verifyWalletSignature(
        credentials.address, 
        credentials.signature
      );

      if (response.data?.user) {
        dispatch(setUser(response.data.user));
        dispatch(setAddress(credentials.address));
        dispatch(setConnected(true));
        
        // Redirect to dashboard
        router.push('/dashboard');
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Wallet login failed'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, router]);

  const logout = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      
      // Call logout API
      await authService.logout();
      
      // Clear Redux state
      dispatch(resetUser());
      
      // Redirect to login
      router.push('/login');
    } catch (error) {
      // Even if API call fails, clear local state
      dispatch(resetUser());
      router.push('/login');
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, router]);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.checkAuth();
      if (response?.data?.user) {
        dispatch(setUser(response.data.user));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }, [dispatch]);

  // Computed values (SSR-safe)
  const isAuthenticated = isClient ? (authService.isAuthenticated() && isLoggedIn) : false;
  const isVerified = user?.isVerified ?? false;
  
  const hasRole = useCallback((role: string) => {
    return user?.roles?.includes(role) ?? false;
  }, [user?.roles]);

  const isAdmin = hasRole('admin');
  const isGuide = hasRole('guide');
  const isPartner = hasRole('partner');

  const getDisplayName = useCallback(() => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.username) {
      return user.username;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  }, [user]);

  const getInitials = useCallback(() => {
    const displayName = getDisplayName();
    return displayName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }, [getDisplayName]);

  return {
    // State
    user,
    address,
    isLoggedIn,
    isLoading,
    error,
    
    // Computed
    isAuthenticated,
    isVerified,
    hasRole,
    isAdmin,
    isGuide,
    isPartner,
    
    // Actions
    login,
    loginWithWallet,
    logout,
    refreshUser,
    
    // Utilities
    getDisplayName,
    getInitials,
  };
}
