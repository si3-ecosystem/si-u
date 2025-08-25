"use client";
import { useMemo } from "react";
import { FixCard } from "@/types/siherguides/session";

interface UseGrow3dgeFixSessionsResult {
  upcomingSessions: FixCard[];
  previousSessions: FixCard[];
}

export function useGrow3dgeFixSessions(
  fixCards: FixCard[] | null | undefined
): UseGrow3dgeFixSessionsResult {

  const { upcomingSessions, previousSessions } = useMemo(() => {
    if (!fixCards || fixCards.length === 0) {
      return { upcomingSessions: [], previousSessions: [] };
    }

    const now = Date.now();
    const upcoming: FixCard[] = [];
    const previous: FixCard[] = [];

    fixCards.forEach((card) => {
      if (!card.date) {
        previous.push(card);
        return;
      }
      
      try {
        const cardDate = new Date(card.date).getTime();
        if (!isNaN(cardDate)) {
          if (cardDate > now) {
            upcoming.push(card);
          } else {
            previous.push(card);
          }
        } else {
          previous.push(card);
        }
      } catch {
        previous.push(card);
      }
    });

    // Sort upcoming sessions by date (ascending - earliest first)
    upcoming.sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateA - dateB;
    });
    
    // Sort previous sessions by date (descending - most recent first)
    previous.sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateB - dateA;
    });

    return { upcomingSessions: upcoming, previousSessions: previous };
  }, [fixCards]);

  return {
    upcomingSessions,
    previousSessions,
  };
}