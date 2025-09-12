"use client";

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCurrentUserV2 } from '@/hooks/auth/useCurrentUserV2';

export function AuthGateV2({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useCurrentUserV2();
  const router = useRouter();
  const pathname = usePathname();
  const [hasRedirected, setHasRedirected] = useState(false);

  const isLoginRoute = useMemo(() => pathname?.startsWith('/login') || pathname?.includes('/(auth)/'), [pathname]);
  const isAuthed = isAuthenticated;

  useEffect(() => {
    // Only redirect if we're actually loading and not authenticated
    if (isLoading) return;
    if (!isAuthed && !isLoginRoute && !hasRedirected) {
      setHasRedirected(true);
      router.replace('/login');
    }
  }, [isLoading, isAuthed, isLoginRoute, router, hasRedirected]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthed && !isLoginRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthGateV2;

