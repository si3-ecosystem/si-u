"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
}

export function ContentPagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  showPageNumbers = true,
  maxVisiblePages = 5,
}: ContentPaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate range around current page
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - halfVisible);
      let end = Math.min(totalPages, currentPage + halfVisible);

      // Adjust if we're near the beginning or end
      if (currentPage <= halfVisible) {
        end = Math.min(totalPages, maxVisiblePages);
      } else if (currentPage > totalPages - halfVisible) {
        start = Math.max(1, totalPages - maxVisiblePages + 1);
      }

      // Add first page and ellipsis if needed
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }

      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis and last page if needed
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-9 w-9 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        {showPageNumbers && (
          <>
            {visiblePages.map((page, index) => {
              if (page === '...') {
                return (
                  <div
                    key={`ellipsis-${index}`}
                    className="flex items-center justify-center h-9 w-9"
                  >
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </div>
                );
              }

              const pageNumber = page as number;
              const isActive = pageNumber === currentPage;

              return (
                <Button
                  key={pageNumber}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  className="h-9 w-9 p-0"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </>
        )}

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-9 w-9 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Page Info */}
      <div className="ml-4 text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
