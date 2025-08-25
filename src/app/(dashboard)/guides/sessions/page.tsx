"use client";

import WorkShops from "@/components/organisms/guides/workShops";
import { useQuery } from "@tanstack/react-query";
import { getSiherGuidesSessionData } from "@/lib/sanity/client";
import type { SiherGuidesSession } from "@/types/siherguides/session";
import Loading from "@/app/loading";
import { ContentBanner } from "@/components/molecules/content/ContentBanner";
import { useState } from "react";

export default function SessionsPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  
  const { data, isLoading, error } = useQuery<SiherGuidesSession>({
    queryKey: ["siher-guides-session"],
    queryFn: getSiherGuidesSessionData,
  });

  if (isLoading) return <Loading />;

  if (error || !data)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        Error loading session data.
      </div>
    );

  return (
    <div className="">
      <div className="w-full min-h-screen">
        <ContentBanner
          title={data.banner?.title || "Si Her Guides Sessions"}
          description={
            data.banner?.description ||
            "Exclusive innovation hub for our partner community to collaborate and share cutting-edge insights"
          }
          backgroundImage={data.banner?.background}
          thumbnailImage={data.banner?.thumbnail}
          variant="default"
          textColor="dark"
          className=""
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          showSearch={true}
        />

        <div className="px-4 mt-11 lg:px-6 pb-16">
          <WorkShops data={data} globalFilter={globalFilter} />
        </div>
      </div>
    </div>
  );
}
