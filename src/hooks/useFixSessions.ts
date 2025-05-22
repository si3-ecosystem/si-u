import { useQuery } from "@tanstack/react-query";
import { getFixSessions } from "@/lib/sanity/client";

export function useFixSessions() {
  const { data: sessions = [], isLoading: loading } = useQuery({
    queryKey: ["fixSessions"],
    queryFn: getFixSessions,
  });

  return { loading, sessions: sessions[0] };
}
