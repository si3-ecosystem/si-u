"use client";


import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare } from "lucide-react";
import { ContentFilters } from "@/components/molecules/content/ContentFilters";
import { ContentCard } from "@/components/molecules/content/ContentCard";
import { ContentPagination } from "@/components/molecules/content/ContentPagination";

interface Grow3dgeContentListingProps {
  title: string;
  description?: string;
  items: any[];
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  basePath: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  isLoading?: boolean;
  className?: string;
}

export function Grow3dgeContentListing({
  title,
  description,
  items,
  categories,
  activeCategory,
  onCategoryChange,
  basePath,
  currentPage,
  totalPages,
  onPageChange,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  isLoading = false,
  className = "",
}: Grow3dgeContentListingProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {title}
          </h2>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
            <Users className="w-3 h-3 mr-1" />
            Partner Access
          </Badge>
        </div>
        
        {description && (
          <p className="text-gray-600 text-lg max-w-3xl">
            {description}
          </p>
        )}
      </div>

      {/* Filters */}
      <ContentFilters
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        className="mb-8"
      />

      {/* Content Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-64 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No content found
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchQuery || activeCategory
              ? "Try adjusting your search or filter criteria to find what you're looking for."
              : "No partner content is available at the moment. Check back soon for new innovations and insights."}
          </p>
        </div>
      ) : (
        <>
          <div className={cn(
            viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          )}>
            {items.map((item, index) => (
              <ContentCard
                key={item._id || index}
                title={item.title}
                description={item.description}
                date={item.date}
                image={item.ideaLabImage}
                category={item.category}
                href={`${basePath}/${item._id}`}
                variant={viewMode === 'list' ? 'horizontal' : 'vertical'}
                className="group hover:shadow-lg transition-all duration-300"
                badges={[
                  {
                    text: "Partner",
                    variant: "secondary",
                    className: "bg-blue-100 text-blue-700 border-blue-200"
                  }
                ]}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <ContentPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              className="mt-12"
            />
          )}
        </>
      )}

    </div>
  );
}
