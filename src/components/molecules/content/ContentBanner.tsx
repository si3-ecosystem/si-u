import Image from "next/image";
import { cn } from "@/lib/utils";
import { urlForImage } from "@/lib/sanity/image";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";

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
  showSearch?: boolean;
  globalFilter?: string;
  setGlobalFilter?: (value: string) => void;
}

export function ContentBanner({
  title,
  description,
  backgroundImage,
  // thumbnailImage,
  children,
  showSearch = false,
  globalFilter,
  setGlobalFilter,
}: ContentBannerProps) {
  return (
    <Card className=" min-h-[204px]  max-w-screen-2xl w-full md:min-h-[340px] px-8 lg:px-[120px] items-center flex py-8 lg:pb-0 lg:pt-6 relative z-10 !rounded-[30px] overflow-hidden">
      {backgroundImage && (
        <Image
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignoreƒ
          src={urlForImage(backgroundImage)?.src}
          alt="background"
          fill
          priority
          decoding="async"
          className="w-full absolute inset-0 z-0  object-cover object-center "
        />
      )}
      <div className="w-full flex items-center gap-6 z-10 relative">
        {/* Text Content */}
        <div className="flex-1 min-w-0 !space-y-2">
          <h1
            className={cn(
              "font-bold mb-4 lg:mb-6 text-white text-3xl lg:text-[52px] leading-[64px]"
            )}
          >
            {title}
          </h1>
          <p
            className={cn(
              " max-w-3xl text-xl lg:text-[22px] text-white leading-normal"
            )}
          >
            {description}
          </p>

          {showSearch && (
            <div className="mt-6">
              <div className="flex items-center gap-2.5 w-fit rounded-full bg-white border border-transparent pl-4  pr-1 !mt-8">
              <Search className="size-4 opacity-50" />
              <input
                type="search"
                placeholder="Search Sessions"
                value={globalFilter}
                onChange={(e) =>
                  setGlobalFilter && setGlobalFilter(e.target.value)
                }
                className="text-opacity-50 w-full sm:w-[259px] h-11 outline-none border-none"
              />
              <button className="text-base text-white font-normal px-4 py-2 rounded-full bg-brand">
                Search
              </button>
            </div>
            </div>
          )}

          {/* Additional content */}
          {children && <div className="">{children}</div>}
        </div>
      </div>
    </Card>
  );
}
