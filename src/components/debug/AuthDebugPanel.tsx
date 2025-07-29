"use client";

import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import { setUser, setConnected } from '@/redux/slice/userSlice';
import { Button } from '@/components/ui/button';

export function AuthDebugPanel() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [cookieToken, setCookieToken] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('si3-jwt');
      setJwtToken(token);
    }

    // Check cookie token
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const jwtCookie = cookies.find(cookie => cookie.trim().startsWith('si3-jwt='));
      setCookieToken(jwtCookie ? jwtCookie.split('=')[1] : null);
    }
  }, []);

  const simulateLogin = () => {
    // Simulate a logged-in user with the same ID as in the comments
    const mockUser = {
      _id: '687f48938fbd6dd8dfece1d2', // This matches the commentUserId from the logs
      email: 'test@example.com',
      roles: ['scholar'],
      firstName: 'Test',
      lastName: 'User',
      isVerified: true,
    };

    dispatch(setUser(mockUser));
    dispatch(setConnected(true));
  };

  const simulateLoginWithNestedUser = () => {
    // Simulate user data nested under 'user' property
    const mockUserData = {
      user: {
        _id: '687f48938fbd6dd8dfece1d2',
        email: 'test@example.com',
        roles: ['scholar'],
        firstName: 'Test',
        lastName: 'User',
        isVerified: true,
      }
    };

    dispatch(setUser(mockUserData));
    dispatch(setConnected(true));
  };

  const clearAuth = () => {
    dispatch(setUser({}));
    dispatch(setConnected(false));
    if (typeof window !== 'undefined') {
      localStorage.removeItem('si3-jwt');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md z-50">
      <h3 className="font-bold text-sm mb-2">Auth Debug Panel</h3>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>Redux User:</strong>
          <pre className="bg-gray-100 p-1 rounded text-xs overflow-auto max-h-20">
            {JSON.stringify(currentUser, null, 2)}
          </pre>
        </div>
        
        <div>
          <strong>JWT Token (localStorage):</strong>
          <div className="bg-gray-100 p-1 rounded break-all">
            {jwtToken ? `${jwtToken.substring(0, 20)}...` : 'None'}
          </div>
        </div>
        
        <div>
          <strong>JWT Token (cookie):</strong>
          <div className="bg-gray-100 p-1 rounded break-all">
            {cookieToken ? `${cookieToken.substring(0, 20)}...` : 'None'}
          </div>
        </div>
      </div>

      <div className="flex gap-1 mt-3">
        <Button onClick={simulateLogin} size="sm" variant="outline">
          Login (Direct)
        </Button>
        <Button onClick={simulateLoginWithNestedUser} size="sm" variant="outline">
          Login (Nested)
        </Button>
        <Button onClick={clearAuth} size="sm" variant="destructive">
          Clear
        </Button>
      </div>
    </div>
  );
}
