"use client";

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, RefreshCw, AlertTriangle } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { isAdmin, isLoading, checkingAuth } = useAdminAuth();

  // Ensure this component only renders on the client side to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading state until component is mounted and auth is checked
  if (!isMounted || isLoading || checkingAuth) {
    return (
      fallback || (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-96">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Verifying Access
              </h2>
              <p className="text-sm text-gray-600 text-center">
                Checking administrative privileges...
              </p>
            </CardContent>
          </Card>
        </div>
      )
    );
  }

  // Show unauthorized state (this should rarely be reached due to middleware)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-8 w-8 text-red-600 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Access Denied
            </h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              You don&apos;t have administrative privileges to access this page.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Shield className="h-4 w-4" />
              <span>Admin access required</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render children if user is admin
  return <>{children}</>;
}