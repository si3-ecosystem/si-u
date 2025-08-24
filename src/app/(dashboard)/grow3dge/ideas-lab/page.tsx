"use client";

import { useQuery } from "@tanstack/react-query";
import { getGrow3dgeIdeasLabSessionData } from "@/lib/sanity/client";
import { useGrow3dgeIdeasLab } from "@/hooks/useGrow3dgeIdeasLab";
import { useAppSelector } from "@/redux/store";
import Loading from "@/app/loading";
import { ContentBanner } from "@/components/molecules/content/ContentBanner";
import { ContentListing } from "@/components/organisms/content/ContentListing";
import { CommentNotifications } from "@/components/molecules/comment/CommentNotifications";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";

function EnhancedContentListing({
  items,
  categories,
  activeCategory,
  onCategoryChange,
  ...props
}: any) {
  const enhancedItems = items.map((item: any) => {
    return {
      ...item,
      contentId: item._id,
    };
  });

  return (
    <ContentListing
      items={enhancedItems}
      categories={categories}
      activeCategory={activeCategory}
      onCategoryChange={onCategoryChange}
      {...props}
    />
  );
}

export default function Grow3dgeIdeaLabPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isClient, setIsClient] = useState(false);

  const currentUser = useAppSelector((state) => state.user);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["grow3dge-idea-labs-session"],
    queryFn: getGrow3dgeIdeasLabSessionData,
  });

  const cards = data?.cards || [];
  const ideaLabs = useGrow3dgeIdeasLab(cards);

  // Check if user has partner role
  const hasPartnerRole =
    isClient &&
    (currentUser?.user?.roles?.includes("partner") ||
      currentUser?.user?.roles?.includes("admin"));

  if (isLoading) return <Loading />;

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Error Loading Content
        </h1>
        <p className="text-gray-600">
          Unable to load ideas lab data. Please try again later.
        </p>
      </div>
    );
  }

  // Show access denied if user doesn't have partner role
  if (isClient && !hasPartnerRole) {
    return (
      <div className="w-full min-h-screen">
        <ContentBanner
          title={data.banner?.title || "Grow3dge Ideas Lab"}
          description={data.banner?.description ||
            "Exclusive innovation hub for our partner community to collaborate and share cutting-edge insights"}
          backgroundImage={(data.banner?.background?.asset?.src)}
          thumbnailImage={data.banner?.thumbnail}
          variant="default"
          textColor="dark"
          className="mb-8"
        />

        <div className="px-4 mt-11 lg:px-6 pb-16">
          <div className="max-w-2xl mx-auto text-center py-16">
            <Alert className="border-amber-200 bg-amber-50">
              <Lock className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <div className="space-y-2">
                  <h3 className="font-semibold">Partner Access Required</h3>
                  <p>
                    The Grow3dge Ideas Lab is exclusively available to our
                    partner community. This space is designed for partners to
                    collaborate, share insights, and contribute to innovative
                    solutions.
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
      </div>
    );
  }

  const filteredItems = ideaLabs.pageRows
    .map((row) => row.original || row)
    .filter((item) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.title?.toLowerCase().includes(query)
      );
    });

  return (
    <div className="w-full min-h-screen">
      <ContentBanner
        title={data.title || "Grow3dge Ideas Lab"}
        description={
          data.description ||
          "Exclusive innovation hub for our partner community to collaborate and share cutting-edge insights"
        }
        backgroundImage={data.banner?.background}
        thumbnailImage={data.banner?.thumbnail}
        variant="default"
        textColor="dark"
        className="mb-8"
      />

      <div className="mt-11  pb-16">
        <EnhancedContentListing
          title="Latest Partner Innovations"
          description="Discover cutting-edge research and collaborative opportunities exclusive to our partner network"
          items={filteredItems}
          categories={ideaLabs.categories}
          activeCategory={ideaLabs.activeTab}
          onCategoryChange={ideaLabs.setActiveTab}
          basePath="/grow3dge/ideas-lab"
          currentPage={ideaLabs.pageIndex + 1}
          totalPages={ideaLabs.pageCount}
          onPageChange={(page: number) => {
            console.log("Navigate to page:", page);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isLoading={false}
        />
      </div>

      {/* Global notifications */}
      <CommentNotifications />
    </div>
  );
}
