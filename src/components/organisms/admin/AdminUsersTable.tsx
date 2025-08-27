"use client";

import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Users,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Copy,
  Check
} from 'lucide-react';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { 
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef
} from '@tanstack/react-table';
import { toast } from 'sonner';

interface AdminUsersTableProps {
  className?: string;
}

export function AdminUsersTable({ className = '' }: AdminUsersTableProps) {
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);

  const {
    users,
    isLoading,
    isError,
    pagination,
    stats,
    statsLoading,
    statsError,
    tableSorting,
    setTableSorting,
    columnFilters,
    setColumnFilters,
    paginationState,
    setPaginationState,
    filters,
    updateFilter,
    clearFilters,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    refetch,
    refetchStats,
    exportUsers,
  } = useAdminUsers(40);

  // Helper function to copy wallet address
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedWallet(text);
      toast.success('Wallet address copied to clipboard!');
      setTimeout(() => setCopiedWallet(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy wallet address');
    }
  };

  // Helper function to truncate wallet address
  const truncateWallet = (address: string) => {
    if (!address) return '';
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Column definitions with improved roles and wallet display
  const columns = React.useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => {
        const email = row.original.email;
        let displayEmail = email;
        const isTemp = email?.includes('@wallet.temp');
        
        // Truncate wallet.temp emails to 10 characters
        if (isTemp) {
          const emailPrefix = email.split('@')[0];
          displayEmail = emailPrefix.length > 10 ? `${emailPrefix.slice(0, 10)}...` : emailPrefix;
        }
        
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium" title={email}>{displayEmail}</span>
              {isTemp && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                  TEMP
                </span>
              )}
            </div>
            {row.original.username && (
              <span className="text-sm text-gray-500">@{row.original.username}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const name = row.original.name || 
          `${row.original.firstName || ''} ${row.original.lastName || ''}`.trim() ||
          row.original.username ||
          'No name';
        return <span>{name}</span>;
      },
    },
    {
      accessorKey: 'roles',
      header: 'Roles',
      cell: ({ row }) => {
        const roles = row.original.roles || ['scholar']; // Default to scholar if no roles
        const badgeColors = {
          admin: 'bg-red-100 text-red-800',
          guide: 'bg-blue-100 text-blue-800',
          scholar: 'bg-green-100 text-green-800',
          partner: 'bg-purple-100 text-purple-800',
        };
        
        return (
          <div className="flex flex-wrap gap-1">
            {roles.map((role: string, index: number) => {
              const colorClass = badgeColors[role as keyof typeof badgeColors] || 'bg-gray-100 text-gray-800';
              return (
                <span 
                  key={`${role}-${index}`}
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
                >
                  {role}
                </span>
              );
            })}
          </div>
        );
      },
    },
    {
      accessorKey: 'wallet_address',
      header: 'Wallet Address',
      cell: ({ row }) => {
        const walletAddress = row.original.wallet_address || 
          row.original.walletInfo?.address ||
          (row.original.email?.includes('@wallet.temp') ? row.original.email.split('@')[0] : null);
        
        if (!walletAddress) {
          return (
            <span className="text-gray-400 text-sm">No wallet</span>
          );
        }
        
        const truncated = truncateWallet(walletAddress);
        const isRecentlyCopied = copiedWallet === walletAddress;
        
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">{truncated}</span>
            <button
              onClick={() => copyToClipboard(walletAddress)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title={`Copy full address: ${walletAddress}`}
            >
              {isRecentlyCopied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        );
      },
    },
    {
      accessorKey: 'isVerified',
      header: 'Verified',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          row.original.isVerified 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.original.isVerified ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      accessorKey: 'companyName',
      header: 'Company',
      cell: ({ row }) => row.original.companyName || row.original.company || 'N/A',
    },
    {
      accessorKey: 'newsletter',
      header: 'Newsletter',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          row.original.newsletter 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {row.original.newsletter ? 'Subscribed' : 'Not subscribed'}
        </span>
      ),
    },
    {
      accessorKey: 'lastLogin',
      header: 'Last Login',
      cell: ({ row }) => {
        if (!row.original.lastLogin) return 'Never';
        return new Date(row.original.lastLogin).toLocaleDateString();
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const date = row.original.createdAt || row.original.dateJoined;
        if (!date) return 'Unknown';
        return new Date(date).toLocaleDateString();
      },
    },
  ], [copiedWallet]);

  // Create table instance - simplified for manual pagination
  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting: tableSorting,
      columnFilters,
    },
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        setTableSorting(updater(tableSorting));
      } else {
        setTableSorting(updater);
      }
    },
    onColumnFiltersChange: (updater) => {
      if (typeof updater === 'function') {
        setColumnFilters(updater(columnFilters));
      } else {
        setColumnFilters(updater);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: pagination.totalPages, // Use backend-provided totalPages directly
  });

  if (isError) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading users data</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistics Cards */}
      {statsLoading ? (
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
      ) : statsError ? (
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
      ) : stats ? (
        <>
          {/* Overview Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.overview.totalUsers}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Check className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Verified Users</p>
                  <p className="text-2xl font-bold">{stats.overview.verifiedUsers}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Wallet Verified</p>
                  <p className="text-2xl font-bold">{stats.overview.walletVerifiedUsers}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">With Wallets</p>
                  <p className="text-2xl font-bold">{stats.overview.usersWithWallets}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Newsletter</p>
                  <p className="text-2xl font-bold">{stats.overview.subscribedToNewsletter}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Role Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Roles Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.roleDistribution).map(([role, count]) => (
                  <Badge key={role} variant="outline" className="px-3 py-1">
                    {role}: {String(count)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users Management
            </span>
            <div className="flex items-center gap-2">
              <Button 
                onClick={exportUsers} 
                variant="outline" 
                size="sm"
                disabled={isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by email, name, or company..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select 
              value={filters.role || 'all'} 
              onValueChange={(value) => updateFilter('role', value === 'all' ? '' : value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="guide">Guide</SelectItem>
                <SelectItem value="scholar">Scholar</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.isVerified === null ? 'all' : String(filters.isVerified)} 
              onValueChange={(value) => updateFilter('isVerified', value === 'all' ? null : value === 'true')}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="true">Verified</SelectItem>
                <SelectItem value="false">Unverified</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.hasWallet === null ? 'all' : String(filters.hasWallet)} 
              onValueChange={(value) => updateFilter('hasWallet', value === 'all' ? null : value === 'true')}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Wallet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="true">With Wallet</SelectItem>
                <SelectItem value="false">No Wallet</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={clearFilters} 
              variant="outline" 
              size="sm"
              className="whitespace-nowrap"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>

          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <Select 
              value={String(paginationState.pageSize)} 
              onValueChange={(value) => {
                const newSize = Number(value);
                console.log('Changing page size to:', newSize);
                setPageSize(newSize);
              }}
            >
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
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup: any) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header: any) => (
                      <TableHead key={header.id} className="whitespace-nowrap">
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center gap-1 ${
                              header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && (
                              <span className="ml-1">
                                {header.column.getIsSorted() === 'desc' ? (
                                  <ArrowDown className="h-4 w-4" />
                                ) : header.column.getIsSorted() === 'asc' ? (
                                  <ArrowUp className="h-4 w-4" />
                                ) : (
                                  <ArrowUpDown className="h-4 w-4 opacity-50" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Loading users...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row: any) => (
                    <TableRow key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell: any) => (
                        <TableCell key={cell.id} className="py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-6 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Showing {pagination.total > 0 ? ((pagination.page - 1) * pagination.limit) + 1 : 0} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} users
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('First page clicked');
                  gotoPage(1);
                }}
                disabled={!pagination.hasPrev}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('Previous page clicked');
                  previousPage();
                }}
                disabled={!pagination.hasPrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Page</span>
                <Input
                  type="number"
                  value={pagination.page}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    console.log('Manual page input:', page);
                    if (page >= 1 && page <= pagination.totalPages) {
                      gotoPage(page);
                    }
                  }}
                  className="w-16 h-8 text-center"
                  min={1}
                  max={pagination.totalPages}
                />
                <span className="text-sm text-gray-600">of {pagination.totalPages}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('Next page clicked');
                  nextPage();
                }}
                disabled={!pagination.hasNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('Last page clicked:', pagination.totalPages);
                  gotoPage(pagination.totalPages);
                }}
                disabled={!pagination.hasNext}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}