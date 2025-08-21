"use client";
import { Banner } from "@/components/organisms/fixx/fixx-sessions/Banner";
import { PopularTopics } from "@/components/organisms/grow3dge/grow3dge-sessions/PopularTopics";
import { FilteredSessions } from "@/components/organisms/grow3dge/grow3dge-sessions/FilteredSessions";
import { useFixSessions } from "@/hooks/useFixSessions";
import { useGrow3dgeSessions } from "@/hooks/useGrow3dgeSessions";
import { useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import Loading from "@/app/loading";

export default function FixxSessionsPage() {
  const { loading, sessions } = useFixSessions();
  const [isClient, setIsClient] = useState(false);
  const currentUser = useAppSelector((state) => state.user);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const hasPartnerRole =
    isClient &&
    (currentUser?.user?.roles?.includes("partner") ||
      currentUser?.user?.roles?.includes("admin"));

  const {
    globalFilter,
    setGlobalFilter,
    selectedCategory,
    setSelectedCategory,
    pageIndex,
    pageCount,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    gotoPage,
    categoryCounts,
    filteredSessions,
  } = useGrow3dgeSessions(sessions?.fixCards || [], "");

  if (loading) return <Loading />;

  // Show access denied if user doesn't have partner role
  if (isClient && !hasPartnerRole) {
    return (
      <div className="w-full min-h-screen p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-amber-200 bg-amber-50">
            <Lock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <div className="space-y-2">
                <h3 className="font-semibold">Partner Access Required</h3>
                <p>
                  The Grow3dge Sessions are exclusively available to our partner
                  community. This space is designed for partners to access
                  specialized content and participate in partner-only sessions.
                </p>
                <p className="text-sm">
                  If you believe you should have access, please contact your
                  account manager or reach out to our support team.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col gap-8 lg:gap-16">
      <Banner
        data={sessions?.banner}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />

      <PopularTopics
        data={{
          topicTitle: sessions?.topicTitle || "Popular Topics",
          topicDesc: sessions?.topicDesc || "Explore sessions by category and find content that interests you",
          topics: sessions?.topics || [], // Array of topics
        }}
        categoryCounts={categoryCounts}
        setSelectedCategory={setSelectedCategory}
      />

      <FilteredSessions
        title={sessions?.title || "Grow3dge Sessions"}
        description={
          sessions?.description || "Explore our collection of partner sessions"
        }
        sessions={filteredSessions}
        selectedCategory={selectedCategory}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
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
