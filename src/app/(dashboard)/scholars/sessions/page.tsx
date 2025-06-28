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
import { Banner } from "@/components/organisms/scholars/siUSessions/Banner";
import { HighlightedSessions } from "@/components/organisms/scholars/siUSessions/HighlightedSessions";
import { PopularTopics } from "@/components/organisms/scholars/siUSessions/PopularTopics";
import { useSessionTable } from "@/hooks/useSession";
import { getSessionData, getSessionPageData } from "@/lib/sanity/client";
import { Session, SessionSchema } from "@/types/session";
import { useQuery } from "@tanstack/react-query";

export default function SIUSession() {
  const { data, isLoading } = useQuery<Session[]>({
    queryKey: ["getSessions"],
    queryFn: getSessionData,
    refetchOnWindowFocus: false,
  });

  console.log("data", data);

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
    <div className=" w-full bg-[#f6f6f6] min-h-screen flex flex-col gap-8 lg:gap-16">
      <Banner
        data={
          sessionPageData?.banner ?? {
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
          }
        }
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <PopularTopics
        categoryCounts={categoryCounts}
        data={sessionPageData ?? fallbackSessionPageData}
        setSelectedCategory={setSelectedCategory}
      />
      <HighlightedSessions
        title={sessionPageData?.siutitle ?? "Highlighted Sessions"}
        description={sessionPageData?.siudescription || "Highlighted Sessions"}
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
  );
}
