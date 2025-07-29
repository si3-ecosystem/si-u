"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setUser, setConnected } from '@/redux/slice/userSlice';

/**
 * Hook to initialize authentication state from stored JWT token
 * This should be called once at the app level to restore user session
 */
export function useAuthInitializer() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user);

  useEffect(() => {
    // Only initialize if user is not already logged in
    if (currentUser.isLoggedIn || Object.keys(currentUser.user).length > 0) {
      return;
    }

    const initializeAuth = () => {
      try {
        // Check for JWT token in localStorage
        const token = localStorage.getItem('si3-jwt');
        
        if (!token) {
          console.log('No JWT token found in localStorage');
          return;
        }

        // Decode JWT token (simple base64 decode of payload)
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.error('Invalid JWT token format');
          return;
        }

        // Decode the payload (middle part)
        const payload = JSON.parse(atob(tokenParts[1]));
        
        // Check if token is expired
        if (payload.exp && payload.exp < Date.now() / 1000) {
          console.log('JWT token is expired');
          localStorage.removeItem('si3-jwt');
          return;
        }

        // Extract user data from JWT payload
        const userData = {
          _id: payload._id,
          email: payload.email,
          roles: payload.roles || [],
          firstName: payload.firstName,
          lastName: payload.lastName,
          isVerified: payload.isVerified || false,
          wallet_address: payload.wallet_address,
          createdAt: payload.createdAt,
          updatedAt: payload.updatedAt,
        };

        console.log('Initializing auth from JWT token:', userData);

        // Set user data in Redux store
        dispatch(setUser(userData));
        dispatch(setConnected(true));

      } catch (error) {
        console.error('Error initializing auth from JWT token:', error);
        // Clear invalid token
        localStorage.removeItem('si3-jwt');
      }
    };

    // Initialize auth
    initializeAuth();
  }, [dispatch, currentUser.isLoggedIn, currentUser.user]);

  return {
    isInitialized: currentUser.isLoggedIn || Object.keys(currentUser.user).length > 0
  };
}
