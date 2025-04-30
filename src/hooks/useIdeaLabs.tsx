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
import { IdeaLabCard } from "@/types/idealabs_session";

export function useIdeaLabs(cards: IdeaLabCard[]) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const table = useReactTable({
    data: cards,
    columns: [
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "date",
        header: "Date",
      },
      {
        accessorKey: "category.title",
        header: "Category",
        cell: (info) => info.row.original.category?.title || "",
      },
    ],
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
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

  const allCards = table.getCoreRowModel().rows.map((row) => row.original);
  const categories = useMemo(() => {
    const cats = allCards
      .map((card) => card.category?.title)
      .filter(Boolean) as string[];
    return ["All", ...Array.from(new Set(cats))];
  }, [allCards]);

  const filteredCards = useMemo(() => {
    if (activeTab === "All") return allCards;
    return allCards.filter((card) => card.category?.title === activeTab);
  }, [allCards, activeTab]);

  // Pagination (10 per page)
  const pageRows = table
    .getRowModel()
    .rows.filter((row) =>
      activeTab === "All" ? true : row.original.category?.title === activeTab
    );
  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  return {
    rows: table.getRowModel().rows,
    pageIndex,
    pageCount,
    canPreviousPage,
    canNextPage,
    previousPage: table.previousPage,
    nextPage: table.nextPage,
    globalFilter,
    setGlobalFilter,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    table,
    categories,
    activeTab,
    setActiveTab,
    filteredCards,
    pageRows,
  };
}
