"use client";
import { Banner } from "@/components/organisms/scholars/ideas-lab/Banner";
import { Highlights } from "@/components/organisms/scholars/ideas-lab/Highlights";
import { useQuery } from "@tanstack/react-query";
import { getScholarsIdeasLabSessionData } from "@/lib/sanity/client";
import { useScholarsIdeasLab } from "@/hooks/useScholarsIdeasLab";
import Loading from "@/app/loading";

export default function ScholarsIdeasLabPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["scholars-ideas-lab-session"],
    queryFn: getScholarsIdeasLabSessionData,
  });

  const cards = data?.cards || [];
  const ideaLabs = useScholarsIdeasLab(cards);

  if (isLoading) return <Loading />;

  if (error || !data)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        Error loading scholars ideas lab data.
      </div>
    );

  return (
    <div className="">
      <Banner data={data.banner ?? {}} />
      <Highlights
        title={data.title ?? ""}
        description={data.description ?? ""}
        categories={ideaLabs.categories}
        activeTab={ideaLabs.activeTab ?? ""}
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
