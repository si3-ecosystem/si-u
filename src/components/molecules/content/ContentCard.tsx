"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { urlForImage } from "@/lib/sanity/image";

interface BadgeConfig {
  text: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

interface ContentCardProps {
  title: string;
  description: string;
  date?: string;
  image?: any;
  category?: {
    title: string;
    color?: string;
  };
  href: string;
  variant?: "vertical" | "horizontal";
  className?: string;
  badges?: BadgeConfig[];
  author?: string;
  commentCount?: number;
}

export function ContentCard({
  title,
  description,
  date,
  image,
  category,
  href,
  variant = "vertical",
  className = "",
  badges = [],
  author,
  commentCount,
}: ContentCardProps) {
  const imageUrl = image && urlForImage(image)?.src;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (variant === "horizontal") {
    return (
      <Link href={href} className={cn("block", className)}>
        <Card className="p-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex gap-4">
            {/* Image */}
            <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={imageUrl || "/card_placeholder.png"}
                alt={title}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Badges */}
              {badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {badges.map((badge, index) => (
                    <Badge
                      key={index}
                      variant={badge.variant || "secondary"}
                      className={badge.className}
                    >
                      {badge.text}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Category */}
              {category && (
                <Badge variant="outline" className="mb-2">
                  {category.title}
                </Badge>
              )}

              {/* Title */}
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {description}
              </p>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(date)}</span>
                  </div>
                )}
                {author && (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{author}</span>
                  </div>
                )}
                {commentCount !== undefined && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{commentCount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Vertical variant (default)
  return (
    <Link href={href} className={cn("block", className)}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* Image */}
        <div className="relative h-48 bg-gray-100">
          <Image
            src={imageUrl || "/card_placeholder.png"}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Badges overlay */}
          {badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <Badge
                  key={index}
                  variant={badge.variant || "secondary"}
                  className={cn("backdrop-blur-sm", badge.className)}
                >
                  {badge.text}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          {category && (
            <Badge variant="outline" className="mb-3">
              {category.title}
            </Badge>
          )}

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {description}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              {date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(date)}</span>
                </div>
              )}
              {author && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{author}</span>
                </div>
              )}
            </div>
            
            {commentCount !== undefined && (
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span>{commentCount}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
