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
import { GuidesSession } from "@/types/siherguides/session";

interface CategoryCount {
  category: string;
  count: number;
}

interface UseGuidesSessionsWithFilteringReturn {
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
  filteredSessions: GuidesSession[];
  upcomingSessions: GuidesSession[];
  previousSessions: GuidesSession[];
}

export function useGuidesSessionsWithFiltering(
  guides: GuidesSession[],
  initialCategory: string = ""
): UseGuidesSessionsWithFilteringReturn {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const filteredSessions = useMemo(() => {
    let filtered = guides || [];

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
  }, [guides, selectedCategory, globalFilter]);

  // Separate into upcoming and previous sessions based on date
  const { upcomingSessions, previousSessions } = useMemo(() => {
    const now = Date.now();
    const upcoming: GuidesSession[] = [];
    const previous: GuidesSession[] = [];

    filteredSessions.forEach((session) => {
      if (!session.date) {
        previous.push(session);
        return;
      }
      
      try {
        const sessionDate = new Date(session.date).getTime();
        if (!isNaN(sessionDate)) {
          if (sessionDate > now) {
            upcoming.push(session);
          } else {
            previous.push(session);
          }
        } else {
          previous.push(session);
        }
      } catch {
        previous.push(session);
      }
    });

    upcoming.sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateA - dateB;
    });
    
    previous.sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateB - dateA;
    });

    return { upcomingSessions: upcoming, previousSessions: previous };
  }, [filteredSessions]);

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
        guides?.map((session) => session.category?.slug?.current).filter((cat): cat is string => Boolean(cat))
      )
    );
    return ["all", ...uniqueCategories];
  }, [guides]);

  const categoryCounts = useMemo(() => {
    const countsMap = (guides || []).reduce(
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

    const totalCount = guides?.length || 0;
    return [{ category: "all", count: totalCount }, ...countsArray];
  }, [guides]);

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
    categories,
    categoryCounts,
    filteredSessions,
    upcomingSessions,
    previousSessions,
  } as const;
}