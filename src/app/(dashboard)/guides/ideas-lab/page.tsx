"use client";
import { useQuery } from "@tanstack/react-query";
import { getIdeaLabsSessionData } from "@/lib/sanity/client";
import { useIdeaLabs } from "@/hooks/useIdeaLabs";
import type { IdeaLabsSession } from "@/types/idealabs_session";
import Loading from "@/app/loading";
import { Highlights } from "@/components/organisms/guides/ideas-lab/Highlights";
import { ContentBanner } from "@/components/molecules/content/ContentBanner";
import { useCurrentUserV2 } from "@/hooks/auth/useCurrentUserV2";

export default function IdeaLabsPage() {
  useCurrentUserV2();
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
        Error loading Ideas Lab data.
      </div>
    );

  return (
    <>
      <ContentBanner
        title={data?.banner?.title || "Grow3dge Ideas Lab"}
        description={
          data.banner?.description ||
          "Exclusive innovation hub for our partner community to collaborate and share cutting-edge insights"
        }
        backgroundImage={data.banner?.background}
        thumbnailImage={data.banner?.thumbnail}
        variant="default"
        textColor="dark"
        className="mb-8"
      />

      <div className="px-4 mt-11 lg:px-6 pb-16">
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
    </>
  );
}
