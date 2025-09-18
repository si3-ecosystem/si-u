"use client";

/**
 * Authentication debugging utilities
 */

export function debugAuthState() {
  if (typeof window === 'undefined') return;

  const token = localStorage.getItem('si3-jwt');
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  console.log('[AuthDebug] Current auth state:', {
    localStorage: {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenStart: token?.substring(0, 20) + '...' || 'none'
    },
    cookies: {
      hasSi3Jwt: !!cookies['si3-jwt'],
      si3JwtLength: cookies['si3-jwt']?.length || 0,
      allCookies: Object.keys(cookies)
    },
    url: window.location.href,
    timestamp: new Date().toISOString()
  });

  return {
    hasLocalStorageToken: !!token,
    hasCookieToken: !!cookies['si3-jwt'],
    tokenLength: token?.length || 0,
    cookieLength: cookies['si3-jwt']?.length || 0
  };
}

export function validateToken(token: string | null): boolean {
  if (!token) return false;
  
  try {
    // Basic JWT structure validation
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Check if payload is valid JSON
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    // Check if token is expired
    if (payload.exp && payload.exp < now) {
      console.log('[AuthDebug] Token is expired:', {
        exp: payload.exp,
        now,
        expired: payload.exp < now
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('[AuthDebug] Token validation error:', error);
    return false;
  }
}

export function clearAuthData() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('si3-jwt');
    document.cookie = 'si3-jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    console.log('[AuthDebug] Cleared all auth data');
  } catch (error) {
    console.error('[AuthDebug] Error clearing auth data:', error);
  }
}
