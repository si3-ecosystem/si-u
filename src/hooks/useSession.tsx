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
import { Session } from "@/types/session";

interface CategoryCount {
  category: string;
  count: number;
}

interface UseSessionTableReturn {
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
  selectedStatus: "in_progress" | "completed" | "not_started" | "all" | null;
  setSelectedStatus: (
    value: "in_progress" | "completed" | "not_started" | "all" | null
  ) => void;
  selectedCommunity: string;
  setSelectedCommunity: (value: string) => void;
  dateRange: { start: string | null; end: string | null };
  setDateRange: (value: { start: string | null; end: string | null }) => void;
  sorting: any[];
  setSorting: (value: any[]) => void;
  categories: string[];
  statuses: string[];
  communities: string[];
  categoryCounts: Array<{ category: string; count: number }>;
}

export function useSessionTable(
  sessions: Session[],
  initialCategory: string = "all",
  initialStatus: string = "all"
): UseSessionTableReturn {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "lastActivity", desc: true },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState<
    "in_progress" | "completed" | "not_started" | "all" | null
  >(initialStatus as any);
  const [selectedCommunity, setSelectedCommunity] = useState("all");
  const [dateRange, setDateRange] = useState<{
    start: string | null;
    end: string | null;
  }>({
    start: null,
    end: null,
  });

  const data = useMemo(() => {
    let filteredSessions = sessions;

    if (selectedCategory !== "all") {
      filteredSessions = filteredSessions.filter(
        (session) =>
          session.topic?.title?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedStatus !== "all") {
      filteredSessions = filteredSessions.filter(
        (session) => session.status === selectedStatus
      );
    }

    if (selectedCommunity !== "all") {
      filteredSessions = filteredSessions.filter(
        (session) => session.community?.communityName === selectedCommunity
      );
    }

    return filteredSessions;
  }, [
    sessions,
    selectedCategory,
    selectedStatus,
    selectedCommunity,
  ]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "community.communityName",
        header: "Community",
        cell: (info) => info.getValue() || "N/A",
      },
      {
        accessorKey: "topic.title",
        header: "Category",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "lastActivity",
        header: "Last Activity",
        cell: (info) =>
          info.getValue()
            ? new Date(info.getValue()).toLocaleDateString()
            : "N/A",
      },
    ],
    []
  );

  const table = useReactTable({
    data,
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
        sessions?.map((session) => session.topic?.slug?.current).filter(Boolean)
      )
    );
    return ["all", ...uniqueCategories];
  }, [sessions]);

  const categoryCounts = useMemo(() => {
    const countsMap = sessions.reduce(
      (acc: { [key: string]: number }, session) => {
        const category = session.topic?.slug?.current || "Unknown";
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

    const totalCount = sessions.length;
    return [{ category: "all", count: totalCount }, ...countsArray];
  }, [sessions]);

  const statuses = useMemo(() => {
    const uniqueStatuses = Array.from(
      new Set(sessions.map((session) => session.status))
    );
    return ["all", ...uniqueStatuses];
  }, [sessions]);

  const communities = useMemo(() => {
    const uniqueCommunities = Array.from(
      new Set(
        sessions
          .map((session) => session.community?.communityName)
          .filter(Boolean)
      )
    );
    return ["all", ...uniqueCommunities];
  }, [sessions]);

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
    selectedStatus,
    setSelectedStatus,
    selectedCommunity,
    setSelectedCommunity,
    dateRange,
    setDateRange,
    sorting,
    setSorting,
    // @ts-ignore
    categories,
    // @ts-ignore
    statuses,
    // @ts-ignore
    communities,
    categoryCounts,
  } as const;
}
