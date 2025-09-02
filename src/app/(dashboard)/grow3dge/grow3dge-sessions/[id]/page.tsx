"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getFixCardById } from "@/lib/sanity/client/getFixCardById";
import { useCurrentUserV2 } from "@/hooks/auth/useCurrentUserV2";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import Loading from "@/app/loading";
import { FixCardHeader } from "@/components/organisms/fixx/FixCardHeader";
import { FixCardVideoPlayer } from "@/components/organisms/fixx/FixCardVideoPlayer";
import { FixCardOverview } from "@/components/organisms/fixx/FixCardOverview";
import { FixCardActions } from "@/components/organisms/fixx/FixCardActions";

export default function FixCardDetailPage() {
  const { id } = useParams();
  const cardId = Array.isArray(id) ? id[0] : id;
  const [isClient, setIsClient] = useState(false);
  const { user } = useCurrentUserV2();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if user has partner role
  const hasPartnerRole =
    isClient && !!user && (user.roles?.includes("partner") || user.roles?.includes("admin"));

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

  // Show access denied if user doesn't have partner role
  if (isClient && !hasPartnerRole) {
    return (
      <div className="w-full min-h-screen p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-amber-200 bg-amber-50">
            <Lock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <div className="space-y-2">
                <h3 className="font-semibold">Partner Access Required</h3>
                <p>
                  This session content is exclusively available to our partner
                  community. Partners have access to detailed session content,
                  videos, and resources.
                </p>
                <p className="text-sm">
                  If you believe you should have access, please contact your
                  account manager or reach out to our support team.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
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
          pdfGuide={data.pdfGuide}
          hideDownloadButton={data?.pdfGuide?.enabled}
        />
      </div>
    </section>
  );
}
