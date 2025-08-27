/**
 * AuthDebugger Component
 * 
 * This component helps debug authentication issues by showing
 * real-time auth state, token storage, and Redux state.
 * 
 * Add this to any page during development to track auth issues.
 */

"use client";

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/redux/store';
import { UnifiedAuthService } from '@/services/authService';

export function AuthDebugger() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const currentUser = useAppSelector(state => state.user);

  useEffect(() => {
    const updateDebugInfo = () => {
      const info = {
        timestamp: new Date().toLocaleTimeString(),
        localStorage: {
          'si3-jwt': typeof window !== 'undefined' ? localStorage.getItem('si3-jwt') : null,
          'token': typeof window !== 'undefined' ? localStorage.getItem('token') : null,
        },
        cookies: typeof window !== 'undefined' ? {
          'si3-jwt': document.cookie.includes('si3-jwt='),
          allCookies: document.cookie.split(';').map(c => c.trim().split('=')[0])
        } : {},
        redux: {
          isLoggedIn: currentUser.isLoggedIn,
          isInitialized: currentUser.isInitialized,
          hasUser: !!currentUser.user,
          userEmail: currentUser.user?.email,
          userId: currentUser.user?._id,
          userRoles: currentUser.user?.roles || []
        },
        authService: (() => {
          try {
            const authState = UnifiedAuthService.getAuthState();
            return {
              isAuthenticated: authState.isAuthenticated,
              hasToken: !!authState.token,
              tokenLength: authState.token?.length,
              userEmail: authState.user?.email
            };
          } catch (error) {
            return { error: error.message };
          }
        })(),
        url: typeof window !== 'undefined' ? window.location.href : 'N/A'
      };
      setDebugInfo(info);
    };

    // Update immediately
    updateDebugInfo();

    // Update every 2 seconds
    const interval = setInterval(updateDebugInfo, 2000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const testLogout = async () => {
    try {
      await UnifiedAuthService.logout({ redirect: false });
      console.log('Test logout completed');
    } catch (error) {
      console.error('Test logout failed:', error);
    }
  };

  const testAuthCheck = async () => {
    try {
      const isAuth = UnifiedAuthService.isAuthenticated();
      console.log('Manual auth check result:', isAuth);
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const forceReinitialization = async () => {
    try {
      const result = await UnifiedAuthService.initialize();
      console.log('Force reinitialization result:', result);
    } catch (error) {
      console.error('Force reinitialization failed:', error);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg max-w-md max-h-96 overflow-y-auto text-xs font-mono z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm">Auth Debug</h3>
        <div className="flex gap-1">
          <button 
            onClick={testAuthCheck}
            className="px-2 py-1 bg-blue-600 rounded text-xs"
          >
            Check
          </button>
          <button 
            onClick={forceReinitialization}
            className="px-2 py-1 bg-green-600 rounded text-xs"
          >
            Init
          </button>
          <button 
            onClick={testLogout}
            className="px-2 py-1 bg-red-600 rounded text-xs"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div>
          <strong>Time:</strong> {debugInfo.timestamp}
        </div>
        
        <div>
          <strong>URL:</strong> {debugInfo.url}
        </div>
        
        <div>
          <strong>localStorage:</strong>
          <pre className="text-xs bg-gray-800 p-1 rounded mt-1">
            {JSON.stringify(debugInfo.localStorage, null, 2)}
          </pre>
        </div>
        
        <div>
          <strong>Cookies:</strong>
          <pre className="text-xs bg-gray-800 p-1 rounded mt-1">
            {JSON.stringify(debugInfo.cookies, null, 2)}
          </pre>
        </div>
        
        <div>
          <strong>Redux State:</strong>
          <pre className="text-xs bg-gray-800 p-1 rounded mt-1">
            {JSON.stringify(debugInfo.redux, null, 2)}
          </pre>
        </div>
        
        <div>
          <strong>AuthService:</strong>
          <pre className="text-xs bg-gray-800 p-1 rounded mt-1">
            {JSON.stringify(debugInfo.authService, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

// Console helper functions for manual debugging
if (typeof window !== 'undefined') {
  (window as any).debugAuth = {
    checkState: () => {
      console.log('=== AUTH DEBUG STATE ===');
      console.log('localStorage si3-jwt:', localStorage.getItem('si3-jwt'));
      console.log('localStorage token:', localStorage.getItem('token'));
      console.log('cookies:', document.cookie);
      console.log('AuthService.isAuthenticated():', UnifiedAuthService.isAuthenticated());
      console.log('AuthService.getAuthState():', UnifiedAuthService.getAuthState());
    },
    clearStorage: () => {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
      console.log('All storage cleared');
    },
    testLogin: async (email: string, otp: string) => {
      try {
        const result = await UnifiedAuthService.verifyEmailOTP(email, otp);
        console.log('Test login result:', result);
      } catch (error) {
        console.error('Test login failed:', error);
      }
    }
  };
  
  console.log('Auth debug helpers available: window.debugAuth');
}