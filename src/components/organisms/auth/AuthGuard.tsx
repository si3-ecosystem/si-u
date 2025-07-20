"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ClientOnly } from '@/components/atoms/ClientOnly';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireVerification?: boolean;
  allowedRoles?: string[];
}

export function AuthGuard({
  children,
  requireAuth = false,
  requireVerification = false,
  allowedRoles = []
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isVerified, hasRole, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // Set client flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run redirects on client side after hydration and when not loading
    if (!isClient || isLoading) return;

    // If auth is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
      return;
    }

    // If verification is required but user is not verified
    if (requireVerification && isAuthenticated && !isVerified) {
      router.push('/verify-email');
      return;
    }

    // If specific roles are required
    if (allowedRoles.length > 0 && isAuthenticated) {
      const hasRequiredRole = allowedRoles.some(role => hasRole(role));
      if (!hasRequiredRole) {
        router.push('/error?reason=unauthorized');
        return;
      }
    }
  }, [
    isClient,
    isLoading,
    isAuthenticated,
    isVerified,
    requireAuth,
    requireVerification,
    allowedRoles,
    hasRole,
    router,
    pathname
  ]);

  // Show loading during hydration or auth initialization
  if (!isClient || isLoading) {
    return (
      <LoadingSpinner
        fullScreen={true}
        text="Loading..."
        size="lg"
      />
    );
  }

  // Use ClientOnly wrapper to prevent hydration mismatches
  return (
    <ClientOnly fallback={<LoadingSpinner fullScreen={true} text="Loading..." size="lg" />}>
      <AuthGuardContent
        requireAuth={requireAuth}
        requireVerification={requireVerification}
        allowedRoles={allowedRoles}
        isAuthenticated={isAuthenticated}
        isVerified={isVerified}
        hasRole={hasRole}
      >
        {children}
      </AuthGuardContent>
    </ClientOnly>
  );
}

// Separate component for auth logic to ensure consistent rendering
interface AuthGuardContentProps {
  children: React.ReactNode;
  requireAuth: boolean;
  requireVerification: boolean;
  allowedRoles: string[];
  isAuthenticated: boolean;
  isVerified: boolean;
  hasRole: (role: string) => boolean;
}

function AuthGuardContent({
  children,
  requireAuth,
  requireVerification,
  allowedRoles,
  isAuthenticated,
  isVerified,
  hasRole
}: AuthGuardContentProps) {
  // If auth is required but not authenticated, don't render children
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If verification is required but not verified, don't render children
  if (requireVerification && isAuthenticated && !isVerified) {
    return null;
  }

  // If roles are required but user doesn't have them, don't render children
  if (allowedRoles.length > 0 && isAuthenticated) {
    const hasRequiredRole = allowedRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return null;
    }
  }

  return <>{children}</>;
}
