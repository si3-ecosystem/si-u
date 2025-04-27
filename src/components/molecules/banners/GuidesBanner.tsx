import { urlForImage } from "@/lib/sanity/image";
import { cn } from "@/lib/utils";
import { GuidesSessionBanner } from "@/types/siherguides/session";
import Image from "next/image";

type Props = {
  data: GuidesSessionBanner;
  className?: string;
};

export function GuidesBanner({ data, className }: Props) {
  const imageurl = data?.thumbnail && urlForImage(data?.thumbnail)?.src;
  const backgroundImage =
    data?.background && urlForImage(data?.background)?.src;

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
      <div className="w-full flex-1 flex flex-col h-full justify-center gap-2 z-10 lg:mt-6">
        <h2 className="text-xl font-normal text-black font-clesmont uppercase ">
          {data.title || "title"}
        </h2>
        <p className="text-base leading-[140%] text-[#3D3D3D] max-w-[571px]">
          {data.description || "Description"}
        </p>
      </div>
      <div className="hidden md:block z-10 lg:pr-14 ">
        <Image
          src={imageurl || "/placeholder.png"}
          alt="placeholder banner"
          width={400}
          height={400}
          className={cn(" w-full max-h-[182px] h-full", className)}
        />
      </div>
    </div>
  );
}
