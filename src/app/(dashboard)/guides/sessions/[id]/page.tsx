// app/scholars/si-u-sessions/[id]/page.tsx
"use client";
import Loading from "@/app/loading";
import SessionOverview from "@/components/organisms/scholars/siUSessions/details/OverView";
import SessionHeader from "@/components/organisms/scholars/siUSessions/details/SessionHeader";
import { GuideSessionCommentSection } from "@/components/organisms/comment/GuideSessionCommentSection";
import { getGuidesById } from "@/lib/sanity/client";
import { GuidesSession } from "@/types/siherguides/session";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function SessionDetailsPage() {
  const { id } = useParams();
  const sessionId = Array.isArray(id) ? id[0] : id;

  const { data, isLoading } = useQuery<GuidesSession>({
    queryKey: sessionId ? [`guides-${sessionId}`] : [],
    queryFn: async () => {
      const session = await getGuidesById(sessionId);
      return session || ({} as GuidesSession);
    },
    enabled: !!sessionId,
  });

  if (isLoading) return <Loading />;

  if (!data || !data._id) {
    return <div className="text-center mt-10">Session not found</div>;
  }

  return (
    <section className="max-w-7xl mx-auto p-6 w-full">
      <SessionHeader title={data.title} description={data.description} />

      <div className="mt-6">
        {data.videoUrl && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Session Video</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={data.videoUrl}
                className="w-full h-[500px] rounded-lg"
                allowFullScreen
              />
            </div>
          </div>
        )}

        <SessionOverview overview={data.description} />
      </div>

      {/* Comment Section */}
      <div className="bg-white p-8 mt-6 rounded-lg">
        <GuideSessionCommentSection
          contentId={data._id}
          className="mt-0"
        />
      </div>
    </section>
  );
}
