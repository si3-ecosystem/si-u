"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

// Dynamically import AdminGuard and AdminUsersTable to avoid SSR issues
const AdminGuard = dynamic(() => import('@/components/organisms/admin/AdminGuard').then(mod => ({ default: mod.AdminGuard })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-96">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Loading
          </h2>
          <p className="text-sm text-gray-600 text-center">
            Preparing admin interface...
          </p>
        </CardContent>
      </Card>
    </div>
  )
});

const AdminUsersTable = dynamic(() => import('@/components/organisms/admin/AdminUsersTable').then(mod => ({ default: mod.AdminUsersTable })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-8">
      <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
    </div>
  )
});

export default function AdminUsersPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Loading
            </h2>
            <p className="text-sm text-gray-600 text-center">
              Initializing admin interface...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
            <p className="text-gray-600 mt-1">
              Manage all registered users, their roles, and account status
            </p>
          </div>
        </div>

        {/* Users Table */}
        <AdminUsersTable />
      </div>
    </AdminGuard>
  );
}