// app/scholars/si-u-sessions/[id]/page.tsx
"use client";
import Loading from "@/app/loading";
import SessionOverview from "@/components/organisms/scholars/siUSessions/details/OverView";
import SessionCurriculum from "@/components/organisms/scholars/siUSessions/details/SessionCurriculum";
import SessionHeader from "@/components/organisms/scholars/siUSessions/details/SessionHeader";
import SessionProgress from "@/components/organisms/scholars/siUSessions/details/SessionProgress";
import { ScholarSessionCommentSection } from "@/components/organisms/comment/ScholarSessionCommentSection";
import { getSessionById } from "@/lib/sanity/client";
import { Session } from "@/types/session";
import { useQuery } from "@tanstack/react-query";

import { useParams } from "next/navigation";

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

  if (isLoading) return <Loading />;

  if (!data || Object.keys(data).length === 0) {
    return <div className="text-center mt-10">Session not found</div>;
  }

  return (
    <section className="max-w-7xl mx-auto p-6 w-full">
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

      {/* Comment Section */}
      <div className="bg-white p-8 mt-6 rounded-lg border">
        <ScholarSessionCommentSection
          contentId={data._id}
          className="mt-0"
        />
      </div>
    </section>
  );
}
