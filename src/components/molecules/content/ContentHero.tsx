import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentHeroProps {
  title: string;
  description: string;
  publishedAt?: string;
  author?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  category?: {
    title: string;
    color?: string;
  };
  image?: any;
  tags?: string[];
  variant?: 'default' | 'compact';
  className?: string;
}

export function ContentHero({
  title,
  description,
  publishedAt,
  author,
  category,
  image,
  tags = [],
  variant = 'default',
  className = '',
}: ContentHeroProps) {
  const isCompact = variant === 'compact';

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'mx-auto w-full',
        isCompact ? 'max-w-4xl' : 'max-w-5xl'
      )}>
        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {publishedAt && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Published {formatDate(publishedAt)}</span>
            </div>
          )}
          
          {author && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>
                {author.name}
                {author.role && (
                  <span className="text-gray-400 ml-1">• {author.role}</span>
                )}
              </span>
            </div>
          )}
          
          {category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {category.title}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h1 className={cn(
          'font-bold text-gray-900 mb-4 leading-tight',
          isCompact ? 'text-2xl lg:text-3xl' : 'text-3xl lg:text-4xl xl:text-5xl'
        )}>
          {title}
        </h1>

        {/* Description */}
        <p className={cn(
          'text-gray-600 leading-relaxed mb-8',
          isCompact ? 'text-base lg:text-lg' : 'text-lg lg:text-xl'
        )}>
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Hero Image */}
        {image && (
          <div className={cn(
            'relative w-full mb-8 rounded-lg overflow-hidden bg-gray-100',
            isCompact ? 'h-64 lg:h-80' : 'h-80 lg:h-96 xl:h-[500px]'
          )}>
            <Image
              src={urlForImage(image)?.src || "/card_placeholder.png"}
              alt={title}
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          </div>
        )}
      </div>
    </div>
  );
}
