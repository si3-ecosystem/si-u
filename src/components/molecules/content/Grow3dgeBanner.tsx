"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { urlForImage } from "@/lib/sanity/image";

interface Grow3dgeBannerProps {
  title: string;
  description?: string;
  backgroundImage?: any;
  thumbnailImage?: any;
  variant?: "default" | "gradient" | "minimal";
  textColor?: "light" | "dark";
  className?: string;
  showPartnerBadge?: boolean;
}

export function Grow3dgeBanner({
  title,
  description,
  backgroundImage,
  thumbnailImage,
  variant = "default",
  textColor = "light",
  className = "",
  showPartnerBadge = false,
}: Grow3dgeBannerProps) {
  const backgroundImageUrl = backgroundImage && urlForImage(backgroundImage)?.src;
  const thumbnailImageUrl = thumbnailImage && urlForImage(thumbnailImage)?.src;

  const textColorClasses = {
    light: "text-white",
    dark: "text-gray-900",
  };

  const overlayClasses = {
    default: "bg-gradient-to-r from-black/60 via-black/40 to-transparent",
    gradient: "bg-gradient-to-br from-blue-600/90 via-purple-600/80 to-pink-600/70",
    minimal: "bg-white/10 backdrop-blur-sm",
  };

  return (
    <div className={cn(
      "relative w-full h-[400px] lg:h-[500px] overflow-hidden rounded-lg",
      className
    )}>
      {/* Background Image */}
      {backgroundImageUrl && (
        <Image
          src={backgroundImageUrl}
          alt={title}
          fill
          className="object-cover object-center"
          priority
        />
      )}

      {/* Fallback gradient background */}
      {!backgroundImageUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
      )}

      {/* Overlay */}
      <div className={cn("absolute inset-0", overlayClasses[variant])} />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl">
            {/* Partner Badge */}
            {showPartnerBadge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/90 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                Partner Exclusive
              </div>
            )}

            {/* Thumbnail Image */}
            {thumbnailImageUrl && (
              <div className="mb-6">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border-2 border-white/20">
                  <Image
                    src={thumbnailImageUrl}
                    alt={title}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Title */}
            <h1 className={cn(
              "text-3xl lg:text-5xl font-bold mb-4 leading-tight",
              textColorClasses[textColor]
            )}>
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p className={cn(
                "text-lg lg:text-xl max-w-2xl leading-relaxed",
                textColor === "light" ? "text-white/90" : "text-gray-700"
              )}>
                {description}
              </p>
            )}

            {/* Grow3dge Branding */}
            <div className="mt-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G3</span>
              </div>
              <span className={cn(
                "text-sm font-medium",
                textColor === "light" ? "text-white/80" : "text-gray-600"
              )}>
                Grow3dge Innovation Hub
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl" />
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-lg" />
    </div>
  );
}
