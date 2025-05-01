"use client";
import { Banner } from "@/components/organisms/ideas-lab/Banner";
import { Highlights } from "@/components/organisms/ideas-lab/Highlights";
import { useQuery } from "@tanstack/react-query";
import { getIdeaLabsSessionData } from "@/lib/sanity/client";
import { useIdeaLabs } from "@/hooks/useIdeaLabs";
import type { IdeaLabsSession } from "@/types/idealabs_session";
import Loading from "@/app/loading";

export default function IdeaLabsPage() {
  const { data, isLoading, error } = useQuery<IdeaLabsSession>({
    queryKey: ["idea-labs-session"],
    queryFn: getIdeaLabsSessionData,
  });

  const cards = data?.cards || [];
  const ideaLabs = useIdeaLabs(cards);

  if (isLoading) return <Loading />;

  if (error || !data)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        Error loading idea labs data.
      </div>
    );

  return (
    <div className="">
      <Banner data={data.banner ?? {}} />
      <Highlights
        title={data.title}
        description={data.description}
        categories={ideaLabs.categories}
        activeTab={ideaLabs.activeTab}
        setActiveTab={ideaLabs.setActiveTab}
        pageRows={ideaLabs.pageRows}
        pageCount={ideaLabs.pageCount}
        pageIndex={ideaLabs.pageIndex}
        canPreviousPage={ideaLabs.canPreviousPage}
        canNextPage={ideaLabs.canNextPage}
        previousPage={ideaLabs.previousPage}
        nextPage={ideaLabs.nextPage}
      />
    </div>
  );
}
