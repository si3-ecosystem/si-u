"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getFixCardById } from "@/lib/sanity/client/getFixCardById";
import Loading from "@/app/loading";
import { FixCardHeader } from "@/components/organisms/fixx/FixCardHeader";
import { FixCardVideoPlayer } from "@/components/organisms/fixx/FixCardVideoPlayer";
import { FixCardOverview } from "@/components/organisms/fixx/FixCardOverview";
import { FixCardActions } from "@/components/organisms/fixx/FixCardActions";

export default function FixCardDetailPage() {
  const { id } = useParams();
  const cardId = Array.isArray(id) ? id[0] : id;

  const { data, isLoading } = useQuery({
    queryKey: cardId ? [`fixCard-${cardId}`] : [],
    queryFn: async () => {
      const card = await getFixCardById(cardId);
      return card || {};
    },
    enabled: !!cardId,
  });

  if (isLoading) return <Loading />;
  if (!data || !data._id) {
    return <div className="text-center mt-10">Card not found</div>;
  }

  return (
    <section className="max-w-4xl mx-auto p-6 w-full">
      <FixCardHeader
        title={data.title}
        description={data.description}
        date={data.date}
        time={data.time}
        language={data.language}
        guideName={data.guideName}
      />

      <FixCardVideoPlayer videoUrl={data.videoUrl} thumbnail={data.fixImage} />

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <FixCardOverview overview={data.body} />
        <FixCardActions
          pdfUrl={data.pdfFile?.asset?.url}
          videoUrl={data.videoUrl}
        />
      </div>
    </section>
  );
}
