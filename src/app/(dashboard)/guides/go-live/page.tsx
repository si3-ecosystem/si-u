"use client";

import { useQuery } from "@tanstack/react-query";
import { getLiveSessionsData, getLiveSessionSchema } from "@/lib/sanity/client";
import { ContentBanner } from "@/components/molecules/content/ContentBanner";
import { LiveSessionsManager } from "@/components/organisms/live-sessions/LiveSessionsManager";
import Loading from "@/app/loading";
import { useState } from "react";

export default function LiveSessionsPage() {
  const [globalFilter, setGlobalFilter] = useState("");

  const { data: schemaData, isLoading: schemaLoading } = useQuery({
    queryKey: ["live-session-schema"],
    queryFn: getLiveSessionSchema,
  });

  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ["live-sessions"],
    queryFn: getLiveSessionsData,
  });

  if (schemaLoading || sessionsLoading) return <Loading />;

  return (
    <div className="w-full min-h-screen">
      <ContentBanner
        title={schemaData?.banner?.title || "GO LIVE"}
        description={
          schemaData?.banner?.description ||
          "The Go Live cycle allows Si Her Guides to manage their live sessions from scheduling to attendance tracking and Proof of Attendance (POA)"
        }
        backgroundImage={schemaData?.banner?.background}
        thumbnailImage={schemaData?.banner?.thumbnail}
        variant="default"
        textColor="light"
        className=""
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        showSearch={true}
      />

      <div className="px-4 mt-11 lg:px-6 pb-16">
        <LiveSessionsManager 
          sessions={sessionsData || []}
          globalFilter={globalFilter}
        />
      </div>
    </div>
  );
}