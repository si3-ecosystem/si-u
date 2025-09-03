"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import {
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
  columnFilters: ColumnFiltersState;
  setColumnFilters: (filters: ColumnFiltersState) => void;
  paginationState: PaginationState;

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
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL search parameters
  const initializeFromURL = useCallback(() => {
    const urlFilters: AdminUsersFilters = {
      search: searchParams.get('search') || '',
      role: searchParams.get('role') || '',
      isVerified: searchParams.get('verified') ? searchParams.get('verified') === 'true' : null,
      hasWallet: searchParams.get('hasWallet') ? searchParams.get('hasWallet') === 'true' : null,
      newsletter: searchParams.get('newsletter') ? searchParams.get('newsletter') === 'true' : null,
    };

    const urlSorting: AdminUsersSorting = {
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };

    const urlPagination: PaginationState = {
      pageIndex: Math.max(0, (parseInt(searchParams.get('page') || '1') - 1)),
      pageSize: parseInt(searchParams.get('limit') || String(initialPageSize)),
    };

    return { urlFilters, urlSorting, urlPagination };
  }, [searchParams, initialPageSize]);

  // State management
  const [filters, setFilters] = useState<AdminUsersFilters>(defaultFilters);
  const [sorting, setSorting] = useState<AdminUsersSorting>(defaultSorting);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // Ensure client-side mounting and initialize from URL
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const { urlFilters, urlSorting, urlPagination } = initializeFromURL();
      setFilters(urlFilters);
      setSorting(urlSorting);
      setPagination(urlPagination);
    }
  }, [initializeFromURL]);

  // Update URL when filters, sorting, or pagination changes
  const updateURL = useCallback((newFilters: AdminUsersFilters, newSorting: AdminUsersSorting, newPagination: PaginationState) => {
    const params = new URLSearchParams();

    // Add filters to URL
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.role) params.set('role', newFilters.role);
    if (newFilters.isVerified !== null) params.set('verified', String(newFilters.isVerified));
    if (newFilters.hasWallet !== null) params.set('hasWallet', String(newFilters.hasWallet));
    if (newFilters.newsletter !== null) params.set('newsletter', String(newFilters.newsletter));

    // Add sorting to URL
    if (newSorting.sortBy !== 'createdAt') params.set('sortBy', newSorting.sortBy);
    if (newSorting.sortOrder !== 'desc') params.set('sortOrder', newSorting.sortOrder);

    // Add pagination to URL
    if (newPagination.pageIndex > 0) params.set('page', String(newPagination.pageIndex + 1));
    if (newPagination.pageSize !== initialPageSize) params.set('limit', String(newPagination.pageSize));

    const newURL = params.toString() ? `?${params.toString()}` : '';
    router.replace(`/admin/users${newURL}`, { scroll: false });
  }, [router, initialPageSize]);

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
      
      // Handle different response structures - check both direct users and nested data.users
      if (!result || (
        // @ts-ignore
        !result.users && !result.data?.users)) {
        console.warn('[useAdminUsers] Invalid API response structure:', result);
        // Return empty structure instead of throwing, to prevent UI crashes
        return {
          status: 'success',
          users: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalUsers: 0,
            limit: queryParams.limit || 40,
            hasNextPage: false,
            hasPreviousPage: false,
          }
        };
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
      
      if (!result || !result.data) {
        console.warn('[useAdminUsers] Invalid stats API response structure:', result);
        // Return empty stats structure instead of throwing
        return {
          status: 'success',
          data: {
            overview: {
              totalUsers: 0,
              verifiedUsers: 0,
              walletVerifiedUsers: 0,
              usersWithWallets: 0,
              subscribedToNewsletter: 0
            },
            roleSummary: {
              roleBreakdown: []
            },
            activity: {
              activeUsers: 0,
              recentRegistrations: 0
            }
          }
        };
      }
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled: isMounted, 
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
  // API response structure: { status: "success", users: [...], pagination: {...} }
  const users = response?.users || [];
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


  // Extract statistics from the dedicated API and transform to match component structure
  const stats = statsResponse?.data ? {
    overview: {
      totalUsers: statsResponse.data.total || 0,
      verifiedUsers: statsResponse.data.verified || 0,
      walletVerifiedUsers: statsResponse.data.walletVerified || 0,
      usersWithWallets: statsResponse.data.withWallet || 0,
      subscribedToNewsletter: statsResponse.data.newsletterSubscribers || 0
    },
    roleSummary: {
      roleBreakdown: statsResponse.data.byRole ? Object.entries(statsResponse.data.byRole).map(([role, count]) => ({
        role,
        count: count as number,
        percentage: Math.round(((count as number) / (statsResponse.data.total || 1)) * 100)
      })) : []
    },
    activity: {
      activeUsers: statsResponse.data.active30Days || 0
    }
  } : null;

  // Table columns definition moved to AdminUsersTable component
  // for better access to copy functionality

  // Table configuration - moved to component
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Return data for component to create table

  // Helper functions with URL updates
  const updateFilter = useCallback((key: keyof AdminUsersFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    const newPagination = { ...pagination, pageIndex: 0 }; // Reset to first page
    setFilters(newFilters);
    setPagination(newPagination);
    updateURL(newFilters, sorting, newPagination);
  }, [filters, pagination, sorting, updateURL]);

  const clearFilters = useCallback(() => {
    const newPagination = { ...pagination, pageIndex: 0 };
    setFilters(defaultFilters);
    setPagination(newPagination);
    updateURL(defaultFilters, sorting, newPagination);
  }, [pagination, sorting, updateURL]);

  const gotoPage = useCallback((page: number) => {
    console.log('[useAdminUsers] gotoPage called with:', page);
    const newPagination = { ...pagination, pageIndex: page - 1 };
    setPagination(newPagination);
    updateURL(filters, sorting, newPagination);
  }, [pagination, filters, sorting, updateURL]);

  const nextPage = useCallback(() => {
    console.log('[useAdminUsers] nextPage called, hasNext:', paginationInfo.hasNext);
    if (paginationInfo.hasNext) {
      const newPagination = { ...pagination, pageIndex: pagination.pageIndex + 1 };
      setPagination(newPagination);
      updateURL(filters, sorting, newPagination);
    }
  }, [paginationInfo.hasNext, pagination, filters, sorting, updateURL]);

  const previousPage = useCallback(() => {
    console.log('[useAdminUsers] previousPage called, hasPrev:', paginationInfo.hasPrev);
    if (paginationInfo.hasPrev) {
      const newPagination = { ...pagination, pageIndex: pagination.pageIndex - 1 };
      setPagination(newPagination);
      updateURL(filters, sorting, newPagination);
    }
  }, [paginationInfo.hasPrev, pagination, filters, sorting, updateURL]);

  const setPageSize = useCallback((size: number) => {
    console.log('[useAdminUsers] setPageSize called with:', size);
    const newPagination = { pageSize: size, pageIndex: 0 };
    setPagination(newPagination);
    updateURL(filters, sorting, newPagination);
  }, [filters, sorting, updateURL]);

  const exportUsers = useCallback(async () => {
    try {
      toast.info('Preparing export...');

      // Fetch all users by paginating through all pages
      let allUsers: any[] = [];
      let currentPage = 1;
      let hasMorePages = true;
      const limit = 100; // Maximum allowed by API

      while (hasMorePages) {
        const exportParams = {
          ...queryParams,
          limit,
          page: currentPage,
        };

        const result = await apiClient.get<any>('/admin/users', exportParams);
        const pageUsers = result?.data?.users || [];

        if (pageUsers.length === 0) {
          hasMorePages = false;
        } else {
          allUsers = [...allUsers, ...pageUsers];

          // Show progress for large exports
          if (currentPage > 1) {
            toast.info(`Fetching users... (${allUsers.length} collected)`);
          }

          // Check if we have more pages based on the response
          const pagination = result?.data?.pagination;
          hasMorePages = pagination?.hasNextPage || pageUsers.length === limit;
          currentPage++;
        }
      }

      if (allUsers.length === 0) {
        toast.warning('No users found to export');
        return;
      }

      // Convert to CSV format
      const csvData = allUsers.map((user: any) => ({
        Email: user.email || 'N/A',
        Username: user.username || 'N/A',
        Name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A',
        Roles: Array.isArray(user.roles) ? user.roles.join(', ') : (user.roles || 'scholar'),
        'Email Verified': user.isVerified ? 'Yes' : 'No',
        'Wallet Verified': user.isWalletVerified ? 'Yes' : 'No',
        'Wallet Address': user.wallet_address || user.walletInfo?.address || 'N/A',
        'Connected Wallet': user.walletInfo?.connectedWallet || 'N/A',
        Company: user.companyName || user.companyAffiliation || 'N/A',
        Newsletter: user.newsletter ? 'Yes' : 'No',
        Interests: Array.isArray(user.interests) ? user.interests.join(', ') : (user.interests || 'N/A'),
        'Personal Values': Array.isArray(user.personalValues) ? user.personalValues.join(', ') : (user.personalValues || 'N/A'),
        'Last Login': user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never',
        'Created At': user.createdAt ? new Date(user.createdAt).toLocaleString() : 'Unknown',
        'Updated At': user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'Unknown',
      }));

      // Convert to CSV string
      const headers = Object.keys(csvData[0]);
      const csvContent = [
        headers.join(','),
        ...csvData.map(row =>
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Escape commas and quotes in CSV
            return `"${String(value).replace(/"/g, '""')}"`;
          }).join(',')
        )
      ].join('\n');

      // Download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Successfully exported ${allUsers.length} users`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export users');
    }
  }, [queryParams]);

  return {
    // Data
    users,
    isLoading,
    isError,
    error: error as Error | null,

    // Pagination
    pagination: paginationInfo,

    // Statistics
    // @ts-ignore
    stats,
    statsLoading,
    statsError: statsError as Error | null,

    // Table state
    columnFilters,
    setColumnFilters,
    paginationState: pagination,

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