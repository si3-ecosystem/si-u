import { urlForImage } from "@/lib/sanity/image";
import { SiherGuidesSession } from "@/types/siherguides/session";
import Image from "next/image";

type Props = {
  data: SiherGuidesSession;
};

export function GuidesBanner({ data }: Props) {
  const backgroundImage =
    data?.banner?.background && urlForImage(data?.banner?.background)?.src;

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
      <div className="w-full flex-1 flex flex-col h-full justify-center gap-2 z-10">
        <h2 className="text-2xl font-normal text-white font-clesmont uppercase max-w-[571px]">
          {data.title || "title"}
        </h2>
        <p className="text-base leading-[140%] text-white max-w-[571px]">
          {data.description || "Description"}
        </p>
      </div>
    </div>
  );
}
