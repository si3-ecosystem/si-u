import { Badge } from "@/components/ui/badge";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import React from "react";

interface HighlightCardProps {
  category: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

export function HighlightCard({
  category,
  title,
  description,
  ctaText,
  ctaLink,
  imageUrl,
}: HighlightCardProps) {
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

      <div className="py-3  flex flex-col justify-between">
        <div className="">
          <h3 className="text-base font-medium text-black line-clamp-2 mb-2">
            {title}
          </h3>
          <p className="text-sm font-normal leading-[140%] text-[#454545] line-clamp-6 mb-5">
            {description}
          </p>
        </div>
        <a
          href={ctaLink}
          className="inline-flex items-center gap-2 text-brand font-medium hover:underline text-sm leading-[125%] "
        >
          {ctaText}
          <MoveRight className="size-6" />
        </a>
      </div>
    </div>
  );
}
