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
import { useQuery } from "@tanstack/react-query";
import { getAllTopics } from "@/lib/sanity/client";

interface FilterOption {
  title: string;
  value: string;
}

interface SessionFilterDropdownProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
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
}

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
  const { data: topics, isLoading: topicsLoading } = useQuery({
    queryKey: ["all-topics"],
    queryFn: getAllTopics,
  });

  const topicOptions: FilterOption[] = topics
    ? [
        { title: "All Topics", value: "all" },
        ...topics.map((t: any) => ({
          title: t.title,
          value: t.slug?.current || t.slug,
        })),
      ]
    : [{ title: "All Topics", value: "all" }];

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
            {topicsLoading ? (
              <DropdownMenuRadioItem value="all" disabled>
                Loading topics…
              </DropdownMenuRadioItem>
            ) : (
              topicOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.title}
                </DropdownMenuRadioItem>
              ))
            )}
          </DropdownMenuRadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <DropdownMenuRadioGroup
            value={selectedStatus ?? undefined}
            onValueChange={(value) => setSelectedStatus(value as any)}
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
