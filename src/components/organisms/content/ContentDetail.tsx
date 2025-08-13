"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { urlForImage } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";

interface ContentDetailProps {
  title: string;
  description: string;
  date?: string;
  image?: any;
  videoUrl?: string;
  body?: any;
  category?: {
    title: string;
    color?: string;
  };
  className?: string;
}

export function ContentDetail({
  title,
  description,
  date,
  image,
  videoUrl,
  body,
  category,
  className = "",
}: ContentDetailProps) {
  const imageUrl = image && urlForImage(image)?.src;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Custom components for PortableText
  const portableTextComponents = {
    block: {
      normal: ({ children }: any) => (
        <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
      ),
      h1: ({ children }: any) => (
        <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8">{children}</h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-6">{children}</h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-5">{children}</h3>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-6 bg-blue-50 italic text-gray-700">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">{children}</ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => <li className="ml-4">{children}</li>,
      number: ({ children }: any) => <li className="ml-4">{children}</li>,
    },
    marks: {
      strong: ({ children }: any) => (
        <strong className="font-semibold text-gray-900">{children}</strong>
      ),
      em: ({ children }: any) => (
        <em className="italic text-gray-700">{children}</em>
      ),
      link: ({ children, value }: any) => (
        <a
          href={value.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <article className={cn("w-full", className)}>
      {/* Header */}
      <header className="mb-8">
        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {date && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(date)}</span>
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
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {title}
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 leading-relaxed">
          {description}
        </p>
      </header>

      {/* Media */}
      {(imageUrl || videoUrl) && (
        <div className="mb-8">
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {videoUrl ? (
              <div className="relative w-full h-full">
                <iframe
                  src={videoUrl}
                  title={title}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            ) : imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            ) : null}
            
            {videoUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-gray-900 ml-1" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Body */}
      {body && (
        <div className="prose prose-lg max-w-none">
          <PortableText
            value={body}
            components={portableTextComponents}
          />
        </div>
      )}

      {/* Fallback content if no body */}
      {!body && (
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed">
            This content is part of our exclusive partner innovation hub. 
            Detailed insights and research findings are available to our partner community.
          </p>
        </div>
      )}
    </article>
  );
}
