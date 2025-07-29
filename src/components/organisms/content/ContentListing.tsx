"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Tabs } from '@/components/molecules/tabs/guideTabs';
import { HighlightCard } from '@/components/molecules/cards/highlightCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Grid, List } from 'lucide-react';
import { urlForImage } from '@/lib/sanity/image';
import { cn } from '@/lib/utils';

interface ContentItem {
  _id: string;
  title: string;
  description: string;
  category?: {
    title: string;
  };
  ideaLabImage?: any;
  image?: any;
  date?: string;
  author?: string;
  commentCount?: number;
}

interface ContentListingProps {
  title: string;
  description: string;
  items: ContentItem[];
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  basePath: string; // e.g., '/guides/ideas-lab' or '/scholars/sessions'
  
  // Pagination
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  
  // Search & Filter
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  
  // Layout
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  
  // Loading state
  isLoading?: boolean;
  
  className?: string;
}

export function ContentListing({
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
  searchQuery = '',
  onSearchChange,
  viewMode = 'grid',
  onViewModeChange,
  isLoading = false,
  className = '',
}: ContentListingProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange?.(localSearchQuery);
  };

  const renderGridView = () => (
    <div className="flex flex-wrap gap-6">
      {items.map((item) => (
        <HighlightCard
          key={item._id}
          category={item.category?.title || ''}
          title={item.title}
          description={item.description}
          ctaText="Read More"
          ctaLink={`${basePath}/${item._id}`}
          imageUrl={
            urlForImage(item.ideaLabImage || item.image)?.src || 
            "/card_placeholder.png"
          }
          commentCount={item.commentCount}
          publishedAt={item.date}
          author={item.author}
        />
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item._id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex gap-4">
            {/* Thumbnail */}
            <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
              <Image
              src={
                urlForImage(item.ideaLabImage || item.image)?.src || 
                "/card_placeholder.png"
              }
              alt={item.title}
              fill
              className="object-cover"
              sizes="96px"
            />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {item.title}
                </h3>
                {item.category && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full whitespace-nowrap">
                    {item.category.title}
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {item.date && (
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  )}
                  {item.author && <span>By {item.author}</span>}
                  {item.commentCount !== undefined && (
                    <span>{item.commentCount} comments</span>
                  )}
                </div>
                
                <Button variant="outline" size="sm" asChild>
                  <a href={`${basePath}/${item._id}`}>Read More</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          {onSearchChange && (
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search content..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
          )}

          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs
        tabs={categories.map((cat) => ({ id: cat, label: cat }))}
        activeTab={activeCategory}
        onTabChange={onCategoryChange}
      />

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading content...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No content found</p>
          <p className="text-sm text-gray-400">
            {searchQuery ? 'Try adjusting your search terms' : 'Check back later for new content'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {viewMode === 'grid' ? renderGridView() : renderListView()}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onPageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
