"use client";
import { PopularTopics } from "@/components/organisms/grow3dge/grow3dge-sessions/PopularTopics";
import Grow3dgeWorkShops from "@/components/organisms/grow3dge/Grow3dgeWorkShops";
import { useFixSessions } from "@/hooks/useFixSessions";
import { useGrow3dgeSessions } from "@/hooks/useGrow3dgeSessions";
import { useCurrentUserV2 } from "@/hooks/auth/useCurrentUserV2";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import Loading from "@/app/loading";
import { ContentBanner } from "@/components/molecules/content/ContentBanner";

export default function FixxSessionsPage() {
  const { loading, sessions } = useFixSessions();
  const [isClient, setIsClient] = useState(false);
  const { user } = useCurrentUserV2();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const hasPartnerRole =
    isClient &&
    !!user &&
    (user.roles?.includes("partner") || user.roles?.includes("admin"));

  const {
    globalFilter,
    setGlobalFilter,
    selectedCategory,
    setSelectedCategory,
    categoryCounts,
    filteredSessions,
  } = useGrow3dgeSessions(sessions?.fixCards || [], "");

  // Create filtered session data for the workshops component
  const filteredSessionData = sessions
    ? {
        ...sessions,
        fixCards: filteredSessions,
      }
    : null;

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

  if (!sessions) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        Error loading session data.
      </div>
    );
  }

  return (
    <div className="">
      <div className="w-full min-h-screen">
        <ContentBanner
          title={sessions?.banner?.title || "Grow3dge Sessions"}
          description={
            sessions.banner?.description ||
            "Exclusive innovation hub for our partner community to collaborate and access cutting-edge sessions"
          }
          backgroundImage={sessions.banner?.background}
          thumbnailImage={sessions.banner?.thumbnail}
          variant="default"
          textColor="dark"
          className="mb-8"
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          showSearch={true}
        />

        <div className="px-4 mt-11 lg:px-6 pb-16">
          <PopularTopics
            data={{
              topicTitle: sessions?.topicTitle || "Popular Topics",
              topicDesc:
                sessions?.topicDesc ||
                "Explore sessions by category and find content that interests you",
              topics: sessions?.topics || [], // Array of topics
            }}
            categoryCounts={categoryCounts}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />

          <Grow3dgeWorkShops
            data={filteredSessionData || sessions}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
}
