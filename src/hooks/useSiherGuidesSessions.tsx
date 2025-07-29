"use client";
import { useMemo, useState } from "react";
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

interface UseSiherGuidesSessionsResult {
  upcomingSessions: GuidesSession[];
  previousSessions: GuidesSession[];
  rows: unknown[];
  pageIndex: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  previousPage: () => void;
  nextPage: () => void;
}

export function useSiherGuidesSessions(
  guides: GuidesSession[]
): UseSiherGuidesSessionsResult {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const { upcomingSessions, previousSessions } = useMemo(() => {
    const now = new Date();
    const upcoming: GuidesSession[] = [];
    const previous: GuidesSession[] = [];

    guides.forEach((guide) => {
      if (!guide.date) {
        previous.push(guide);
        return;
      }
      // Parse the guide date
      const guideDate = new Date(guide.date);
      if (guideDate.getTime() > now.getTime()) {
        upcoming.push(guide);
      } else {
        previous.push(guide);
      }
    });
    upcoming.sort(
      (a, b) =>
        new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
    );
    previous.sort(
      (a, b) =>
        new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    );
    return { upcomingSessions: upcoming, previousSessions: previous };
  }, [guides]);

  const columns = useMemo(
    () => [
      { accessorKey: "title", header: "Title" },
      { accessorKey: "guideName", header: "Guide" },
      { accessorKey: "date", header: "Date" },
      { accessorKey: "time", header: "Time" },
      { accessorKey: "language", header: "Language" },
      { accessorKey: "partner.title", header: "Partner" },
    ],
    []
  );

  const table = useReactTable({
    data: guides,
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

  return {
    upcomingSessions,
    previousSessions,
    rows: table.getRowModel().rows,
    pageIndex: table.getState().pagination.pageIndex,
    pageCount: table.getPageCount(),
    canPreviousPage: table.getCanPreviousPage(),
    canNextPage: table.getCanNextPage(),
    previousPage: table.previousPage,
    nextPage: table.nextPage,
  };
}
