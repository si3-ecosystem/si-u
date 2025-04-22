// app/scholars/si-u-sessions/[id]/page.tsx
"use client";
import SessionOverview from "@/components/organisms/scholars/siUSessions/details/OverView";
import SessionCurriculum from "@/components/organisms/scholars/siUSessions/details/SessionCurriculum";
import SessionHeader from "@/components/organisms/scholars/siUSessions/details/SessionHeader";
import SessionProgress from "@/components/organisms/scholars/siUSessions/details/SessionProgress";
import { getSessionById } from "@/lib/sanity/client";
import { Session } from "@/types/session";
import { useQuery } from "@tanstack/react-query";
import { redirect, useParams } from "next/navigation";

export default function SessionDetailsPage() {
  const { id } = useParams();
  const sessionId = Array.isArray(id) ? id[0] : id;

  const { data, isLoading } = useQuery<Session>({
    queryKey: sessionId ? [`session-${sessionId}`] : [],
    queryFn: async () => {
      const session = await getSessionById(sessionId);
      return session || ({} as Session);
    },
    enabled: !!sessionId,
  });

  if (!sessionId) return redirect("/scholars/si-u-sessions");

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  if (!data || Object.keys(data).length === 0) {
    return <div className="text-center mt-10">Session not found</div>;
  }

  return (
    <section className="max-w-4xl mx-auto p-6">
      <SessionHeader
        title={data.title}
        description={data.description}
        community={data.community}
      />
      <SessionProgress
        thumbnail={data.thumbnail}
        progress={data.progress}
        lastActivity={data.lastActivity}
        status={data.status}
        videoUrl={data.videoUrl}
      />
      <div className="bg-white p-8">
        <SessionOverview overview={data.overview} />
        <SessionCurriculum curriculum={data.curriculum} />
      </div>
    </section>
  );
}
