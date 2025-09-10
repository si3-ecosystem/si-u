"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, RefreshCw, Download, Users, Search } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { AddUserDialog } from '@/components/organisms/admin/AddUserDialog';
import { AdminUsersFilters } from '@/types/admin';

interface ControlsProps {
  filters: any;
  isLoading: boolean;
  updateFilter: (key: keyof AdminUsersFilters, value: any) => void;
  clearFilters: () => void;
  paginationState: { pageSize: number };
  setPageSize: (size: number) => void;
  exportUsers: () => void;
  refetch: () => void;
  refetchStats: () => void;
  currentUserRoles?: string[];
}

export function Controls(props: ControlsProps) {
  const { filters, isLoading, updateFilter, clearFilters, paginationState, setPageSize, exportUsers, refetch, refetchStats, currentUserRoles = [] } = props;

  // Role-based access control
  const isCurrentUserAdmin = currentUserRoles.includes('admin');
  const canCreateUsers = isCurrentUserAdmin;
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users Management
          </span>
          <div className="flex items-center gap-2">
            {canCreateUsers && (
              <AddUserDialog onCreated={() => { refetch(); refetchStats(); }} />
            )}
            <Button onClick={exportUsers} variant="outline" size="sm" disabled={isLoading}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <div className="space-y-4 px-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search users by email, name, or company..." value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} className="pl-10" />
            </div>
          </div>

          <Select value={filters.role || 'all'} onValueChange={(value) => updateFilter('role', value === 'all' ? '' : value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="guide">Guide</SelectItem>
              <SelectItem value="scholar">Scholar</SelectItem>
              <SelectItem value="partner">Grow3dge</SelectItem>
              <SelectItem value="team">Team</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.isVerified === null ? 'all' : String(filters.isVerified)} onValueChange={(value) => updateFilter('isVerified', value === 'all' ? null : value === 'true')}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Unverified</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.hasWallet === null ? 'all' : String(filters.hasWallet)} onValueChange={(value) => updateFilter('hasWallet', value === 'all' ? null : value === 'true')}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Wallet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="true">With Wallet</SelectItem>
              <SelectItem value="false">No Wallet</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.newsletter === null ? 'all' : String(filters.newsletter)} onValueChange={(value) => updateFilter('newsletter', value === 'all' ? null : value === 'true')}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Newsletter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All (newsletter)</SelectItem>
              <SelectItem value="true">Newsletter: Yes</SelectItem>
              <SelectItem value="false">Newsletter: No</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={clearFilters} variant="outline" size="sm" className="whitespace-nowrap">
            <Filter className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <Select value={String(paginationState.pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="40">40</SelectItem>
              <SelectItem value="60">60</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">users per page</span>
        </div>
      </div>
    </>
  );
}

