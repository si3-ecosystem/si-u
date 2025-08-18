"use client";
import { useMemo } from "react";
import { GuidesSession } from "@/types/siherguides/session";

interface UseSiherGuidesSessionsResult {
  upcomingSessions: GuidesSession[];
  previousSessions: GuidesSession[];
}

export function useSiherGuidesSessions(
  guides: GuidesSession[] | null | undefined
): UseSiherGuidesSessionsResult {

  const { upcomingSessions, previousSessions } = useMemo(() => {
    if (!guides || guides.length === 0) {
      return { upcomingSessions: [], previousSessions: [] };
    }

    const now = Date.now();
    const upcoming: GuidesSession[] = [];
    const previous: GuidesSession[] = [];

    guides.forEach((guide) => {
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
  }, [guides]);

  return {
    upcomingSessions,
    previousSessions,
  };
}
