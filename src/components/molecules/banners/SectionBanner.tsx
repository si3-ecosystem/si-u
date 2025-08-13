import { urlForImage } from "@/lib/sanity/image";
import { SanityImage } from "@/types/diversityTracker";
import { Search } from "lucide-react";
import Image from "next/image";

type Props = {
  data: {
    background: SanityImage;
    title: string;
    description: string;
  };
  showSearch?: boolean;
  globalFilter?: string;
  setGlobalFilter: (value: string) => void;
};

export function SectionBanner({
  data,
  showSearch = false,
  globalFilter,
  setGlobalFilter,
}: Props) {
  const backgroundImage =
    data?.background && urlForImage(data?.background)?.src;
  return (
    <div className="w-full min-h-[204px] md:min-h-[240px] items-center flex px-4 lg:px-6 py-4 lg:pb-0 lg:pt-6 relative z-10 rounded-lg">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt="background"
          fill
          className="w-full absolute inset-0 z-0  object-cover object-center"
        />
      )}
      <div className="w-full flex-1 flex flex-col h-full justify-center gap-2 z-10">
        <h2 className="text-xl font-normal text-white font-clesmont uppercase max-w-[571px] ">
          {data.title || "title"}
        </h2>
        <p className="text-base leading-[140%] text-white max-w-[571px]">
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
    </div>
  );
}
