import { urlForImage } from "@/lib/sanity/image";
import { cn } from "@/lib/utils";
import { SessionBanner as Types } from "@/types/session";
import { Search } from "lucide-react";
import Image from "next/image";

type Props = {
  data: Types;
  className?: string;
  showSearch?: boolean;
  globalFilter?: string;
  setGlobalFilter: (value: string) => void;
};

export function SessionBanner({
  data,
  className,
  showSearch = false,
  globalFilter,
  setGlobalFilter,
}: Props) {
  const imageurl = data.thumbnail && urlForImage(data.thumbnail)?.src;
  const backgroundImage = data?.background && urlForImage(data.background)?.src;

  return (
    <div className="w-full min-h-[206px] flex px-4 lg:px-6 py-4 lg:pb-0 lg:pt-6 relative z-10 rounded-lg">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt="background"
          fill
          className="w-full absolute inset-0 z-0  object-cover object-center"
        />
      )}
      <div className="w-full flex-1 flex flex-col h-full justify-center gap-2 z-10">
        <h2 className="text-xl font-normal text-black font-clesmont uppercase ">
          {data.title || "title"}
        </h2>
        <p className="text-base leading-[140%] text-[#3D3D3D] max-w-[571px]">
          {data.description || "Description"}
        </p>

        {showSearch && (
          <div className="flex items-center gap-2.5 w-fit rounded-full bg-white border border-transparent pl-4  pr-1 mt-2">
            <Search className="size-4 opacity-50" />
            <input
              type="search"
              placeholder="Search Sessions"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="text-opacity-50 w-full sm:w-[259px] h-11 outline-none border-none"
            />
            <button className="text-base text-white font-normal px-4 py-2 rounded-full bg-brand">
              Search
            </button>
          </div>
        )}
      </div>
      <div className="hidden md:block z-10 lg:pr-14 ">
        <Image
          src={imageurl || "/placeholder.png"}
          alt="placeholder banner"
          width={400}
          height={400}
          className={cn("max-w-[160px] w-full max-h-[182px] h-full", className)}
        />
      </div>
    </div>
  );
}
