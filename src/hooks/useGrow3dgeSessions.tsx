/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useState, useMemo } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";

interface CategoryCount {
  category: string;
  count: number;
}

interface FixCard {
  _id: string;
  title: string;
  description: string;
  category?: {
    _id: string;
    title: string;
    slug: {
      current: string;
    };
  };
  date?: string;
  language?: string;
  guideName?: string;
  // Updated to support multiple partners
  partners?: Array<{
    _id: string;
    name: string;
    title?: string;
    logo: any;
  }>;
  // Legacy single partner field (deprecated but kept for backward compatibility)
  partner?: {
    _id: string;
    title: string;
    logo: any;
  };
  [key: string]: any;
}

interface UseGrow3dgeSessionsReturn {
  rows: any[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  pageIndex: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  previousPage: () => void;
  nextPage: () => void;
  gotoPage: (page: number) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  sorting: any[];
  setSorting: (value: any[]) => void;
  categories: string[];
  categoryCounts: Array<{ category: string; count: number }>;
  filteredSessions: FixCard[];
}

export function useGrow3dgeSessions(
  fixCards: FixCard[],
  initialCategory: string = ""
): UseGrow3dgeSessionsReturn {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const filteredSessions = useMemo(() => {
    let filtered = fixCards || [];

    // Only filter by category if a specific category is selected
    if (selectedCategory && selectedCategory !== "all" && selectedCategory !== "") {
      filtered = filtered.filter(
        (session) =>
          session.category?.slug?.current?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (globalFilter) {
      filtered = filtered.filter(
        (session) =>
          session.title?.toLowerCase().includes(globalFilter.toLowerCase()) ||
          session.description?.toLowerCase().includes(globalFilter.toLowerCase()) ||
          session.guideName?.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }

    return filtered;
  }, [fixCards, selectedCategory, globalFilter]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "category.title",
        header: "Category",
        cell: (info) => info.getValue() || "N/A",
      },
      {
        accessorKey: "guideName",
        header: "Guide",
        cell: (info) => info.getValue() || "N/A",
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: (info) =>
          info.getValue()
            ? new Date(info.getValue()).toLocaleDateString()
            : "N/A",
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredSessions,
    columns,
    state: {
      globalFilter,
      columnFilters,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 12,
      },
    },
  });

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        fixCards?.map((session) => session.category?.slug?.current).filter(Boolean)
      )
    );
    return ["all", ...uniqueCategories];
  }, [fixCards]);

  const categoryCounts = useMemo(() => {
    const countsMap = (fixCards || []).reduce(
      (acc: { [key: string]: number }, session) => {
        const category = session.category?.slug?.current || "Unknown";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {}
    );

    const countsArray: CategoryCount[] = Object.entries(countsMap).map(
      ([category, count]) => ({
        category,
        count,
      })
    );

    const totalCount = fixCards?.length || 0;
    return [{ category: "all", count: totalCount }, ...countsArray];
  }, [fixCards]);

  const gotoPage = (page: number) => {
    table.setPageIndex(page);
  };

  return {
    rows: table.getRowModel().rows,
    globalFilter,
    setGlobalFilter,
    pageIndex: table.getState().pagination.pageIndex,
    pageCount: table.getPageCount(),
    canPreviousPage: table.getCanPreviousPage(),
    canNextPage: table.getCanNextPage(),
    previousPage: table.previousPage,
    nextPage: table.nextPage,
    gotoPage,
    selectedCategory,
    setSelectedCategory,
    sorting,
    setSorting,
    // @ts-ignore
    categories,
    categoryCounts,
    filteredSessions,
  } as const;
}
