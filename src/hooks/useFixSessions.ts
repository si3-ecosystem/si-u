import { useQuery } from "@tanstack/react-query";
import { getFixSessions } from "@/lib/sanity/client";

export function useFixSessions() {
  const { data: sessions = [], isLoading: loading } = useQuery({
    queryKey: ["fixSessions"],
    queryFn: getFixSessions,
  });

  const allCards = (sessions as any[]).flatMap((session) =>
    (session.fixCards || []).map((card: any) => ({
      ...card,
      sessionTitle: session.title,
      sessionDescription: session.description,
      banner: session.banner,
    }))
  );

  // For FIXX, we only show previous sessions (replays)
  const previousSessions = allCards.sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : new Date(0);
    const dateB = b.date ? new Date(b.date) : new Date(0);
    return dateB.getTime() - dateA.getTime(); // Sort by most recent first
  });

  return { loading, sessions: previousSessions };
}
