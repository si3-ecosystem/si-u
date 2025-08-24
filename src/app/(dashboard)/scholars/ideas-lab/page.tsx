"use client";

import { useQuery } from "@tanstack/react-query";
import { getScholarsIdeasLabSessionData } from "@/lib/sanity/client";
import { useScholarsIdeasLab } from "@/hooks/useScholarsIdeasLab";
import Loading from "@/app/loading";
import { ContentBanner } from "@/components/molecules/content/ContentBanner";
import { ContentListing } from "@/components/organisms/content/ContentListing";

import { CommentNotifications } from "@/components/molecules/comment/CommentNotifications";
import { useState } from "react";

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

export default function ScholarsIdeaLabPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data, isLoading, error } = useQuery({
    queryKey: ["scholars-idea-labs-session"],
    queryFn: getScholarsIdeasLabSessionData,
  });

  const cards = data?.cards || [];
  const ideaLabs = useScholarsIdeasLab(cards);

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

  // Filter items based on search query
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
        title={data.title || "Scholars Ideas Lab"}
        description={
          data.description ||
          "Explore innovative ideas and research from our scholar community"
        }
        backgroundImage={(data?.banner?.background)}
        thumbnailImage={data?.banner?.thumbnail}
        variant="default"
        textColor="dark"
        className="mb-8"
      />

      <div className="mt-11 pb-16">
        <EnhancedContentListing
          title="Latest Ideas"
          description="Discover the latest research ideas and innovations from our scholar community"
          items={filteredItems}
          categories={ideaLabs.categories}
          activeCategory={ideaLabs.activeTab}
          onCategoryChange={ideaLabs.setActiveTab}
          basePath="/scholars/ideas-lab"
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
