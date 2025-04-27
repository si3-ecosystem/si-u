"use client";

import WorkShops from "@/components/organisms/guides/workShops";
import { useQuery } from "@tanstack/react-query";
import { getSiherGuidesSessionData } from "@/lib/sanity/client";
import type { SiherGuidesSession } from "@/types/siherguides/session";
import { GuidesBanner } from "@/components/molecules/banners/GuidesBanner";

export default function SessionsPage() {
  const { data, isLoading, error } = useQuery<SiherGuidesSession>({
    queryKey: ["siher-guides-session"],
    queryFn: getSiherGuidesSessionData,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>Error loading session data.</div>;

  console.log("data", data);
  return (
    <div className="py-8">
      <GuidesBanner data={data} />
      <WorkShops guides={data.guides} />
    </div>
  );
}
