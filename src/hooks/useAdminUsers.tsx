"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  SortingState,
  ColumnFiltersState,
  PaginationState,
} from '@tanstack/react-table';
import { apiClient } from '@/services/api';
import {
  AdminUserTableData,
  AdminUsersFilters,
  AdminUsersSorting,
  AdminUsersQueryParams
} from '@/types/admin';
import { toast } from 'sonner';

// Types for the new statistics API
interface AdminUserStats {
  overview: {
    totalUsers: number;
    verifiedUsers: number;
    walletVerifiedUsers: number;
    usersWithWallets: number;
    subscribedToNewsletter: number;
  };
  verification: {
    total: number;
    verified: number;
    unverified: number;
    walletVerified: number;
  };
  wallets: {
    total: number;
    withWallet: number;
    withoutWallet: number;
  };
  roleDistribution: Record<string, number>;
  roleSummary: {
    totalRoles: number;
    totalUsersFromRoles: number;
    averageUsersPerRole: number;
    roleBreakdown: Array<{
      role: string;
      count: number;
      percentage: number;
    }>;
  };
  activity: {
    recentRegistrations: number;
    activeUsers: number;
    activeUserPercentage: number;
  };
  generatedAt: string;
}

interface UseAdminUsersReturn {
  // Data
  users: AdminUserTableData[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  // Statistics
  stats: AdminUserStats | null;
  statsLoading: boolean;
  statsError: Error | null;

  // Table state
  tableSorting: SortingState;
  setTableSorting: (sorting: SortingState) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (filters: ColumnFiltersState) => void;
  paginationState: PaginationState;
  setPaginationState: (pagination: PaginationState) => void;

  // Filters
  filters: AdminUsersFilters;
  setFilters: (filters: AdminUsersFilters) => void;
  updateFilter: (key: keyof AdminUsersFilters, value: any) => void;
  clearFilters: () => void;

  // Sorting
  sorting: AdminUsersSorting;
  setSorting: (sorting: AdminUsersSorting) => void;

  // Pagination controls
  gotoPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;

  // Actions
  refetch: () => void;
  refetchStats: () => void;
  exportUsers: () => void;
}

const defaultFilters: AdminUsersFilters = {
  search: '',
  role: '',
  isVerified: null,
  hasWallet: null,
  newsletter: null,
};

const defaultSorting: AdminUsersSorting = {
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function useAdminUsers(initialPageSize: number = 40): UseAdminUsersReturn {
  const [isMounted, setIsMounted] = useState(false);
  // State management
  const [filters, setFilters] = useState<AdminUsersFilters>(defaultFilters);
  const [sorting, setSorting] = useState<AdminUsersSorting>(defaultSorting);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // Ensure client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Convert filters and sorting to query params
  const queryParams = useMemo((): AdminUsersQueryParams => {
    const params: AdminUsersQueryParams = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortBy: sorting.sortBy,
      sortOrder: sorting.sortOrder,
    };

    if (filters.search) params.search = filters.search;
    if (filters.role) params.role = filters.role;
    // Map isVerified to status as per backend API
    if (filters.isVerified !== null) {
      params.status = filters.isVerified ? 'verified' : 'unverified';
    }
    if (filters.hasWallet !== null) params.hasWallet = String(filters.hasWallet);
    if (filters.newsletter !== null) params.newsletter = String(filters.newsletter);

    console.log('[useAdminUsers] Query params generated:', params);
    return params;
  }, [filters, sorting, pagination]);

  // Fetch users data
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<any>({
    queryKey: ['admin-users', queryParams],
    queryFn: async (): Promise<any> => {
      console.log('[useAdminUsers] Fetching users with params:', queryParams);
      const result = await apiClient.get<any>('/admin/users', queryParams);
      console.log('[useAdminUsers] API Response:', result);
      if (!result.data) {
        throw new Error('No data received from API');
      }
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled: isMounted, // Only run query after component is mounted
  });

  // Fetch statistics data separately
  const {
    data: statsResponse,
    isLoading: statsLoading,
    isError: statsIsError,
    error: statsError,
    refetch: refetchStats,
  } = useQuery<any>({
    queryKey: ['admin-users-stats'],
    queryFn: async (): Promise<any> => {
      console.log('[useAdminUsers] Fetching user statistics...');
      const result = await apiClient.get<any>('/admin/users/stats');
      console.log('[useAdminUsers] Stats API Response:', result);
      if (!result.data) {
        throw new Error('No statistics data received from API');
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled: isMounted, // Only run query after component is mounted
  });

  // Error handling effects
  useEffect(() => {
    if (isError) {
      console.error('[useAdminUsers] Error fetching users:', error);
      toast.error('Failed to fetch users data');
    }
  }, [isError, error]);

  useEffect(() => {
    if (statsIsError) {
      console.error('[useAdminUsers] Error fetching stats:', statsError);
      toast.error('Failed to fetch user statistics');
    }
  }, [statsIsError, statsError]);

  // Extract data from response - the apiClient returns the raw API response
  // API response structure: { status: "success", data: { users: [...] }, pagination: {...} }
  const users = response?.data?.users || [];
  const paginationInfo = response?.pagination ? {
    page: response.pagination.currentPage,
    limit: response.pagination.limit,
    total: response.pagination.totalUsers,
    totalPages: response.pagination.totalPages,
    hasNext: response.pagination.hasNextPage,
    hasPrev: response.pagination.hasPreviousPage,
  } : {
    page: 1,
    limit: initialPageSize,
    total: users.length,
    totalPages: Math.ceil(users.length / initialPageSize),
    hasNext: false,
    hasPrev: false,
  };


  // Extract statistics from the dedicated API
  const stats = statsResponse?.data || null;

  // Table columns definition moved to AdminUsersTable component
  // for better access to copy functionality

  // Table configuration - moved to component
  const [tableSorting, setTableSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Return data for component to create table

  // Helper functions
  const updateFilter = useCallback((key: keyof AdminUsersFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, pageIndex: 0 })); // Reset to first page
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, []);

  const gotoPage = useCallback((page: number) => {
    console.log('[useAdminUsers] gotoPage called with:', page);
    setPagination(prev => ({ ...prev, pageIndex: page - 1 }));
  }, []);

  const nextPage = useCallback(() => {
    console.log('[useAdminUsers] nextPage called, hasNext:', paginationInfo.hasNext);
    if (paginationInfo.hasNext) {
      setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
    }
  }, [paginationInfo.hasNext]);

  const previousPage = useCallback(() => {
    console.log('[useAdminUsers] previousPage called, hasPrev:', paginationInfo.hasPrev);
    if (paginationInfo.hasPrev) {
      setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }));
    }
  }, [paginationInfo.hasPrev]);

  const setPageSize = useCallback((size: number) => {
    console.log('[useAdminUsers] setPageSize called with:', size);
    setPagination(prev => {
      const newPagination = { ...prev, pageSize: size, pageIndex: 0 };
      console.log('[useAdminUsers] New pagination state:', newPagination);
      return newPagination;
    });
  }, []);

  const exportUsers = useCallback(() => {
    // Export functionality - could be implemented to download CSV
    const csv = users.map(user => ({
      Email: user.email,
      Name: user.name || user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A',
      Role: user.roles?.[0] || 'scholar',
      Verified: user.isVerified ? 'Yes' : 'No',
      Company: user.companyName || user.company || 'N/A',
      Created: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
    }));
    
    console.log('Exporting users:', csv);
    toast.success('Export functionality would download CSV here');
  }, [users]);

  return {
    // Data
    users,
    isLoading,
    isError,
    error: error as Error | null,

    // Pagination
    pagination: paginationInfo,

    // Statistics
    stats,
    statsLoading,
    statsError: statsError as Error | null,

    // Table state
    tableSorting,
    setTableSorting,
    columnFilters,
    setColumnFilters,
    paginationState: pagination,
    setPaginationState: setPagination,

    // Filters
    filters,
    setFilters,
    updateFilter,
    clearFilters,

    // Sorting
    sorting,
    setSorting,

    // Pagination controls
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    // Actions
    refetch,
    refetchStats,
    exportUsers,
  };
}