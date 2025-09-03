"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PaginationProps {
  pagination: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean };
  gotoPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
}

export function UsersPagination({ pagination, gotoPage, nextPage, previousPage }: PaginationProps) {
  return (
    <div className="flex items-center justify-between p-6 border-t">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>
          Showing {pagination.total > 0 ? ((pagination.page - 1) * pagination.limit) + 1 : 0} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => gotoPage(1)} disabled={!pagination.hasPrev}>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => previousPage()} disabled={!pagination.hasPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">Page</span>
          <Input
            type="number"
            value={pagination.page}
            onChange={(e) => {
              const page = parseInt(e.target.value);
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

        <Button variant="outline" size="sm" onClick={() => nextPage()} disabled={!pagination.hasNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => gotoPage(pagination.totalPages)} disabled={!pagination.hasNext}>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

