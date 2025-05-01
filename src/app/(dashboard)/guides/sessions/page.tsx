"use client";

import WorkShops from "@/components/organisms/guides/workShops";
import { useQuery } from "@tanstack/react-query";
import { getSiherGuidesSessionData } from "@/lib/sanity/client";
import type { SiherGuidesSession } from "@/types/siherguides/session";
import { GuidesBanner } from "@/components/molecules/banners/GuidesBanner";
import Loading from "@/app/loading";

export default function SessionsPage() {
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
      <GuidesBanner data={data} />
      <WorkShops guides={data.guides} />
    </div>
  );
}
