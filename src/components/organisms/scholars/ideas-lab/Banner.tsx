import { urlForImage } from "@/lib/sanity/image";
import Image from "next/image";

export type BannerProps = {
  data: {
    title?: string;
    description?: string;
    thumbnail?: any;
    background?: any;
  };
};

export function Banner({ data }: BannerProps) {
  const backgroundImage = data?.background && urlForImage(data.background)?.src;

  return (
    <section className="w-full ">
      <div className="w-full min-h-[389px] flex items-center relative z-10 rounded-lg px-8 lg:px-[115px] py-4 lg:pb-0 lg:pt-6">
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt="background"
            fill
            className="w-full absolute inset-0 z-0  object-cover object-center"
          />
        )}
        <div className="w-full flex-1 flex flex-col h-full justify-center gap-4 z-10">
          <h2 className="text-2xl md:text-[48px] font-normal text-black font-clesmont uppercase ">
            {data.title || "title"}
          </h2>
          <p className="text-base md:text-[20px] leading-[140%] text-[#3D3D3D] max-w-[571px]">
            {data.description || "Description"}
          </p>
        </div>
      </div>
    </section>
  );
}
