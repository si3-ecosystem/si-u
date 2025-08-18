import Image from "next/image";
import { cn } from "@/lib/utils";

interface ContentBannerProps {
  title: string;
  description: string;
  backgroundImage?: any;
  thumbnailImage?: any;
  variant?: "default" | "compact" | "hero";
  overlay?: boolean;
  textColor?: "light" | "dark";
  className?: string;
  children?: React.ReactNode;
}

export function ContentBanner({
  title,
  description,
  backgroundImage,
  // thumbnailImage,
  variant = "default",
  children,
}: ContentBannerProps) {
  return (
    <div className="w-full min-h-[204px] md:min-h-[240px] px-4 lg:px-6 items-center flex py-4 lg:pb-0 lg:pt-6 relative z-10 rounded-lg">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt="background"
          fill
          className="w-full absolute inset-0 z-0  object-cover object-center"
        />
      )}
      <div className="w-full flex items-center gap-6 z-10 relative">
        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h1
            className={cn(
              "font-bold mb-3 leading-tight text-white",
              variant === "hero"
                ? "text-3xl lg:text-4xl xl:text-5xl"
                : "text-2xl lg:text-3xl"
            )}
          >
            {title}
          </h1>

          <p
            className={cn(
              "leading-relaxed max-w-3xl text-white",
              variant === "hero" ? "text-lg lg:text-xl" : "text-base lg:text-lg"
            )}
          >
            {description}
          </p>

          {/* Additional content */}
          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </div>
  );
}
