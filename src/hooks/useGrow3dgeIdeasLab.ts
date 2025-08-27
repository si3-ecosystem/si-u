import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
} from "@tanstack/react-table";

export function useGrow3dgeIdeasLab(cards: any[]) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 6;

  const categories = useMemo(() => {
    // Extract and clean category titles
    const cats = cards
      .map((card) => card.category?.title?.trim())
      .filter((title): title is string => Boolean(title) && title.length > 0);
    
    const uniqueCats = Array.from(new Set(cats));
    
    return uniqueCats;
  }, [cards]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      { accessorKey: "title", header: "Title" },
      { accessorKey: "description", header: "Description" },
      { accessorKey: "date", header: "Date" },
      { accessorKey: "category.title", header: "Category" },
    ],
    []
  );

  const filteredCards = useMemo(
    () =>
      cards.filter((card) => !activeTab || card.category?.title === activeTab),
    [cards, activeTab]
  );

  const table = useReactTable({
    data: filteredCards,
    columns,
    state: {
      globalFilter,
      pagination: { pageIndex, pageSize },
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        setPageIndex((old) => updater({ pageIndex: old, pageSize }).pageIndex);
      } else if (typeof updater === "object") {
        setPageIndex(updater.pageIndex);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    manualFiltering: false,
  });

  return {
    categories,
    activeTab,
    setActiveTab,
    globalFilter,
    setGlobalFilter,
    pageRows: table.getRowModel().rows,
    pageCount: table.getPageCount(),
    pageIndex: table.getState().pagination.pageIndex,
    canPreviousPage: table.getCanPreviousPage(),
    canNextPage: table.getCanNextPage(),
    previousPage: table.previousPage,
    nextPage: table.nextPage,
    table,
  };
}
