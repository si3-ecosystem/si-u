"use client";

import { ChevronDownIcon, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

interface FilterOption {
  title: string;
  value: string;
}

interface SessionFilterDropdownProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedCommunity: string;
  setSelectedCommunity: (value: string) => void;
  dateRange: { start: string | null; end: string | null };
  setDateRange: (value: { start: string | null; end: string | null }) => void;
}

const categoryOptions: FilterOption[] = [
  { title: "All Categories", value: "all" },
  { title: "Blockchain", value: "blockchain" },
  { title: "NFTs", value: "nfts" },
  { title: "Cryptocurrency", value: "cryptocurrency" },
  { title: "DeFi", value: "defi" },
];

const statusOptions: FilterOption[] = [
  { title: "All Statuses", value: "all" },
  { title: "In Progress", value: "in_progress" },
  { title: "Completed", value: "completed" },
  { title: "Not Started", value: "not_started" },
];

export function SessionFilterDropdown({
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
}: SessionFilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filter
          <ChevronDownIcon className="h-4 w-4 opacity-60" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-4 flex flex-col gap-4">
        <div className="space-y-2">
          <Label>Topics</Label>
          <DropdownMenuRadioGroup
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            {categoryOptions.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.title}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <DropdownMenuRadioGroup
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            {statusOptions.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.title}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
