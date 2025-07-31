"use client";
import { Banner } from "@/components/organisms/fixx/fixx-sessions/Banner";
import { Sessions } from "@/components/organisms/fixx/fixx-sessions/Sessions";
import { useFixSessions } from "@/hooks/useFixSessions";
import Loading from "@/app/loading";

export default function FixxSessionsPage() {
  const { loading, sessions } = useFixSessions();

  if (loading) return <Loading />;

  return (
    <div className="w-full ">
      <Banner data={sessions.banner} />
      <Sessions sessions={sessions} />
    </div>
  );
}
