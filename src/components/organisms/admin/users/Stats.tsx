"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function UsersStats({ stats, statsLoading, statsError, refetchStats }: any) {
  if (statsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center p-6">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              <div className="ml-4 space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (statsError) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading statistics</p>
            <Button onClick={() => refetchStats()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">No statistics available</p>
            <p className="text-xs text-gray-500">Stats: {stats ? 'Available' : 'Not available'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User Statistics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.overview.totalUsers}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.overview.verifiedUsers}</div>
              <div className="text-sm text-gray-600">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.overview.walletVerifiedUsers}</div>
              <div className="text-sm text-gray-600">Wallet Verified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.overview.usersWithWallets}</div>
              <div className="text-sm text-gray-600">With Wallets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.overview.subscribedToNewsletter}</div>
              <div className="text-sm text-gray-600">Newsletter</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">{stats.activity.activeUsers}</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Role Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.roleSummary.roleBreakdown.map(({ role, count, percentage }: any) => (
              <div key={role} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{role}</div>
                <div className="text-xs text-gray-500">{percentage}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

