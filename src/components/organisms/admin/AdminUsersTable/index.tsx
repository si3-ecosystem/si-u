"use client";

import React, { useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { flexRender, useReactTable, getCoreRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { UsersStats } from '../users/Stats';
import { Controls } from '../users/Controls';
import { UsersPagination } from '../users/Pagination';
import { getAdminUserColumns } from '../users/Columns';

interface AdminUsersTableProps { className?: string; }

export function AdminUsersTable({ className = '' }: AdminUsersTableProps) {
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);

  const {
    users, isLoading, isError, pagination, stats, statsLoading, statsError,
    columnFilters, setColumnFilters, paginationState, filters, updateFilter, clearFilters,
    gotoPage, nextPage, previousPage, setPageSize, refetch, refetchStats, exportUsers
  } = useAdminUsers(40);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedWallet(text);
      setTimeout(() => setCopiedWallet(null), 1500);
    } catch {}
  };

  const columns = useMemo(
    () => getAdminUserColumns({ copiedWallet, copyToClipboard, refetch, refetchStats }),
    [copiedWallet, refetch, refetchStats]
  );

  const table = useReactTable({
    data: users,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: (updater: any) => {
      if (typeof updater === 'function') setColumnFilters(updater(columnFilters)); else setColumnFilters(updater);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    manualFiltering: true,
    pageCount: pagination.totalPages,
  });

  if (isError) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading users data</p>
            <button onClick={() => refetch()} className="inline-flex items-center border rounded px-3 py-1 text-sm">
              <RefreshCw className="h-4 w-4 mr-2" /> Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <UsersStats stats={stats} statsLoading={statsLoading} statsError={statsError} refetchStats={refetchStats} />

      <Card>
        <Controls
          filters={filters}
          isLoading={isLoading}
          updateFilter={updateFilter}
          clearFilters={clearFilters}
          paginationState={paginationState}
          setPageSize={setPageSize}
          exportUsers={exportUsers}
          refetch={refetch}
          refetchStats={refetchStats}
        />
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="whitespace-nowrap">
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center">
                            {flexRender(header.column.columnDef.header, header.getContext())}
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
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Loading users...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
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
          <UsersPagination pagination={pagination} gotoPage={gotoPage} nextPage={nextPage} previousPage={previousPage} />
        </CardContent>
      </Card>
    </div>
  );
}

