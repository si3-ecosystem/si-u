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
    <div className="w-full min-h-[306px] md:min-h-[389px] items-center flex px-8 lg:px-[115px] py-4 lg:pb-0 lg:pt-6 relative z-10 rounded-lg">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt="background"
          fill
          className="w-full absolute inset-0 z-0  object-cover object-center"
        />
      )}
      <div className="w-full flex-1 flex flex-col h-full justify-center gap-2 z-10 lg:mt-6">
        <h2 className="text-2xl md:text-[48px] font-normal text-black font-clesmont uppercase leading-normal max-w-[822px] ">
          {data.title || "title"}
        </h2>
        <p className="text-base md:text-[20px] leading-[140%] text-[#3D3D3D] max-w-[571px]">
          {data.description || "Description"}
        </p>
      </div>
    </div>
  );
}
