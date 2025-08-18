import { useQuery } from "@tanstack/react-query";
import { getCommunities } from "@/lib/sanity/client";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { Community } from "@/types/community";

export function useCommunitiesTable() {
  const {
    data: communities,
    isLoading,
    isError,
    error,
  } = useQuery<Community[]>({
    queryKey: ["communities"],
    queryFn: getCommunities,
  });

  const safeCommunities = useMemo<Community[]>(
    () => (Array.isArray(communities) ? communities : []),
    [communities]
  );

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [location, setLocation] = useState("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 12,
  });

  // Filtering logic
  const filtered = useMemo(() => {
    return safeCommunities.filter((c) => {
      const matchesSearch =
        (c.communityName?.toLowerCase().includes(search.toLowerCase()) ??
          false) ||
        (c.communityDescription?.toLowerCase().includes(search.toLowerCase()) ??
          false) ||
        (c.communityLocation?.toLowerCase().includes(search.toLowerCase()) ??
          false);

      const matchesType =
        type === "all" ||
        (Array.isArray(c.communityType) && c.communityType.includes(type));

      const matchesLocation =
        location === "all" || c.communityLocation === location;

      return matchesSearch && matchesType && matchesLocation;
    });
  }, [safeCommunities, search, type, location]);

  // Table setup
  const table = useReactTable<Community>({
    data: filtered,
    columns: [], // Define columns if needed for a table UI
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    pageCount: Math.ceil(filtered.length / pagination.pageSize),
  });

  // For filter dropdowns (fix Set typing for TS)
  const allTypes = useMemo(() => {
    const typeSet = new Set<string>();
    safeCommunities.forEach((c) =>
      Array.isArray(c.communityType)
        ? c.communityType.forEach((t) => typeSet.add(t))
        : null
    );
    return Array.from(typeSet);
  }, [safeCommunities]);
  const allLocations = useMemo(() => {
    const locationSet = new Set<string>();
    safeCommunities.forEach((c) => {
      if (c.communityLocation) locationSet.add(c.communityLocation);
    });
    return Array.from(locationSet);
  }, [safeCommunities]);

  // Paginated data for cards
  const paginatedCommunities = table.getRowModel().rows.map((r) => r.original);

  return {
    isLoading,
    isError,
    error,
    table,
    search,
    setSearch,
    type,
    setType,
    location,
    setLocation,
    allTypes,
    allLocations,
    filteredCommunities: paginatedCommunities,
    pageCount: table.getPageCount(),
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    setPagination,
  };
}
