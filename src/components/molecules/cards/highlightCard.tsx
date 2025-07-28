import { Badge } from "@/components/ui/badge";
import { MoveRight, MessageCircle, Calendar, User } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useReduxCommentCount } from "@/hooks/useReduxComments";

interface HighlightCardProps {
  category: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  commentCount?: number;
  publishedAt?: string;
  author?: string;
  showMetadata?: boolean;
  contentId?: string; // For fetching comment count from Redux
}

export function HighlightCard({
  category,
  title,
  description,
  ctaText,
  ctaLink,
  imageUrl,
  commentCount,
  publishedAt,
  author,
  showMetadata = true,
  contentId,
}: HighlightCardProps) {
  // Get comment count from Redux if contentId is provided
  // Always call the hook, but conditionally use the result
  const { count: reduxCommentCount } = useReduxCommentCount(contentId || '');

  // Use Redux count if contentId is provided, otherwise fall back to prop
  const displayCommentCount = contentId ? reduxCommentCount : commentCount;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };
  return (
    <div className="border border-gray-200 rounded-lg p-3 overflow-hidden sm:w-full sm:max-w-[320px]">
      {/* Image Section */}
      <div className="relative h-[178px] w-full rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 left-2 text-xs text-black font-normal capitalize ">
          {category.toUpperCase()}
        </Badge>
      </div>

      <div className="py-3 flex flex-col justify-between">
        <div className="">
          <h3 className="text-base font-medium text-black line-clamp-2 mb-2">
            {title}
          </h3>
          <p className="text-sm font-normal leading-[140%] text-[#454545] line-clamp-6 mb-3">
            {description}
          </p>

          {/* Metadata */}
          {showMetadata && (
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
              {publishedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(publishedAt)}</span>
                </div>
              )}
              {author && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{author}</span>
                </div>
              )}
              {displayCommentCount !== undefined && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{displayCommentCount}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <a
          href={ctaLink}
          className="inline-flex items-center gap-2 text-brand font-medium hover:underline text-sm leading-[125%]"
        >
          {ctaText}
          <MoveRight className="size-6" />
        </a>
      </div>
    </div>
  );
}
