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

export function useSessionTable(
  sessions: Session[],
  initialCategory: string = "all",
  initialStatus: string = "all"
) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "lastActivity", desc: true },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
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
        (session) => session.category === selectedCategory
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
    dateRange,
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
        accessorKey: "category",
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
        pageSize: 10,
      },
    },
  });

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(sessions?.map((session) => session.category))
    );
    return ["all", ...uniqueCategories];
  }, [sessions]);

  const categoryCounts = useMemo(() => {
    const countsMap = sessions.reduce(
      (acc: { [key: string]: number }, session) => {
        const category = session.category;
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
    categories,
    statuses,
    communities,
    categoryCounts,
  };
}
