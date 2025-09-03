"use client";

const fallbackSessionPageData = {
  _id: "",
  title: "",
  description: "",
  topics: [],
  siutitle: "",
  siudescription: "",
  siusessions: [],
  banner: {
    title: "",
    description: "",
    thumbnail: {
      _type: "image",
      asset: { _ref: "", _type: "reference" },
    },
    background: {
      _type: "image",
      asset: { _ref: "", _type: "reference" },
    },
  },
};

import Loading from "@/app/loading";
import { ContentBanner } from "@/components/molecules/content/ContentBanner";
import { HighlightedSessions } from "@/components/organisms/scholars/siUSessions/HighlightedSessions";
import { PopularTopics } from "@/components/organisms/scholars/siUSessions/PopularTopics";
import { useSessionTable } from "@/hooks/useSession";
import { getSessionData, getSessionPageData } from "@/lib/sanity/client";
import { Session, SessionSchema } from "@/types/session";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUserV2 } from "@/hooks/auth/useCurrentUserV2";

export default function SIUSession() {
  useCurrentUserV2();
  const { data, isLoading } = useQuery<Session[]>({
    queryKey: ["getSessions"],
    queryFn: getSessionData,
    refetchOnWindowFocus: false,
  });

  const { data: sessionPageData, isLoading: isSessionPageLoading } =
    useQuery<SessionSchema>({
      queryKey: ["getSessionsPageData"],
      queryFn: getSessionPageData,
      refetchOnWindowFocus: false,
    });

  const {
    rows,
    globalFilter,
    setGlobalFilter,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    selectedCommunity,
    setSelectedCommunity,
    dateRange,
    setDateRange,
    categoryCounts,
    pageIndex,
    pageCount,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    gotoPage,
  } = useSessionTable(data || [], "all", "all");

  if (isLoading || isSessionPageLoading) return <Loading />;

  return (
    <div className=" w-full  min-h-screen flex flex-col gap-8 lg:gap-16">
      <ContentBanner
        title={sessionPageData?.banner?.title || "Grow3dge Ideas Lab"}
        description={
          sessionPageData?.banner?.description ||
          "Exclusive innovation hub for our partner community to collaborate and share cutting-edge insights"
        }
        backgroundImage={sessionPageData?.banner?.background}
        thumbnailImage={sessionPageData?.banner?.thumbnail}
        variant="default"
        textColor="dark"
        className="mb-8"
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        showSearch={true}
      />

      <div className="space-y-11">
        <PopularTopics
          categoryCounts={categoryCounts}
          data={sessionPageData ?? fallbackSessionPageData}
          setSelectedCategory={setSelectedCategory}
        />
        <HighlightedSessions
          title={sessionPageData?.siutitle ?? "Highlighted Sessions"}
          description={
            sessionPageData?.siudescription || "Highlighted Sessions"
          }
          rows={rows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedCommunity={selectedCommunity}
          setSelectedCommunity={setSelectedCommunity}
          dateRange={dateRange}
          setDateRange={setDateRange}
          pageIndex={pageIndex}
          pageCount={pageCount}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          previousPage={previousPage}
          nextPage={nextPage}
          gotoPage={gotoPage}
        />
      </div>
    </div>
  );
}
