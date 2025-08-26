"use client";
import { useMemo } from "react";
import { GuidesSession } from "@/types/siherguides/session";

interface UseSiherGuidesSessionsResult {
  upcomingSessions: GuidesSession[];
  previousSessions: GuidesSession[];
}

export function useSiherGuidesSessions(
  guides: GuidesSession[] | null | undefined,
  globalFilter: string = "",
  selectedCategory: string = ""
): UseSiherGuidesSessionsResult {

  const { upcomingSessions, previousSessions } = useMemo(() => {
    if (!guides || guides.length === 0) {
      return { upcomingSessions: [], previousSessions: [] };
    }

    // First filter by category if provided
    let filteredGuides = guides;
    if (selectedCategory && selectedCategory !== "all" && selectedCategory.trim()) {
      filteredGuides = guides.filter((guide) => {
        return guide.category?.slug?.current?.toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    // Then filter by search term if provided
    if (globalFilter && globalFilter.trim()) {
      const searchTerm = globalFilter.toLowerCase().trim();
      filteredGuides = filteredGuides.filter((guide) => {
        const title = guide.title?.toLowerCase() || "";
        const description = guide.description?.toLowerCase() || "";
        const guideName = guide.guideName?.toLowerCase() || "";
        
        return (
          title.includes(searchTerm) ||
          description.includes(searchTerm) ||
          guideName.includes(searchTerm)
        );
      });
    }

    const now = Date.now();
    const upcoming: GuidesSession[] = [];
    const previous: GuidesSession[] = [];

    filteredGuides.forEach((guide) => {
      if (!guide.date) {
        previous.push(guide);
        return;
      }
      
      try {
        const guideDate = new Date(guide.date).getTime();
        if (!isNaN(guideDate)) {
          if (guideDate > now) {
            upcoming.push(guide);
          } else {
            previous.push(guide);
          }
        } else {
          previous.push(guide);
        }
      } catch {
        previous.push(guide);
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
  }, [guides, globalFilter, selectedCategory]);

  return {
    upcomingSessions,
    previousSessions,
  };
}
