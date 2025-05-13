import { urlForImage } from "@/lib/sanity/image";
import { DiversityTracker } from "@/types/diversityTracker";
import Image from "next/image";

type Props = {
  data: DiversityTracker;
};

export function DiversityTrackerBanner({ data }: Props) {
  const backgroundImage =
    data?.banner?.background && urlForImage(data.banner?.background)?.src;

  return (
    <div className="w-full min-h-[306px] md:min-h-[306px] px-8 lg:px-[115px] lg:min-h-[493px] flex  py-4 relative z-10 rounded-lg">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt="background"
          fill
          className="w-full absolute inset-0 z-0  object-cover object-center"
        />
      )}
      <div className="w-full flex-1 flex flex-col h-full justify-center gap-4 z-10 lg:mt-6">
        <h2 className="text-2xl md:text-[48px] font-normal max-w-[822px] text-black font-clesmont uppercase leading-normal">
          {data.banner.title || "title"}
        </h2>
        <p className="text-base md:text-[20px] leading-[140%] text-[#3D3D3D] max-w-[791px]">
          {data.banner.subTitle || "Description"}
        </p>
        <p className="text-base leading-[140%] text-[#3D3D3D] max-w-[791px]">
          {data.banner.description || "Description"}
        </p>
      </div>
    </div>
  );
}
