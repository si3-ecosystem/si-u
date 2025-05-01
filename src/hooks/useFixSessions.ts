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

  const now = new Date("2025-05-01T13:50:46+06:00");

  const upcoming = allCards.filter((card) => {
    const cardDateTime = card.date ? new Date(card.date) : new Date(0);
    return cardDateTime > now;
  });

  const previous = allCards.filter((card) => {
    const cardDateTime = card.date ? new Date(card.date) : new Date(0);
    return cardDateTime <= now;
  });

  return { loading, upcoming, previous, sessions };
}
