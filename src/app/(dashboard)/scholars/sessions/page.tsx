"use client";

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
  } = useSessionTable(data || []);

  if (isLoading || isSessionPageLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="max-w-[1920px] mx-auto w-full bg-[#f6f6f6] p-6 min-h-screen md:!pr-20 flex flex-col gap-8 lg:gap-16">
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
        data={
          sessionPageData ?? {
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
          }
        }
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
      />
    </div>
  );
}
