"use client";
import { useQuery } from "@tanstack/react-query";
import { getCommunityBanner } from "@/lib/sanity/client";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";

interface BannerData {
  title?: string;
  description?: string;
  thumbnail?: any;
  background?: any;
  ctaText?: string;
}

export function Banner() {
  const { data: banner, isLoading } = useQuery<BannerData>({
    queryKey: ["communityBanner"],
    queryFn: getCommunityBanner,
  });

  if (isLoading) return null;
  if (!banner) return null;

  const background = banner.background && urlForImage(banner.background)?.src;

  return (
    <section className="w-full">
      <div className="w-full min-h-[206px] flex px-4 lg:px-6 py-4 lg:pb-0 lg:pt-6 relative z-10 rounded-lg">
        {background && (
          <Image
            src={background}
            alt="background"
            fill
            className="w-full absolute inset-0 z-0 object-cover object-center"
          />
        )}
        <div className="w-full flex-1 flex flex-col h-full justify-center gap-2 z-10">
          <h2 className="text-xl font-normal text-black font-clesmont uppercase ">
            {banner.title || "Discover The WOMEN & NON-BINARY WEB3 ECOSYSTEM."}
          </h2>
          <p className="text-base leading-[140%] text-[#3D3D3D] max-w-[571px]">
            {banner.description || "Explore popular categories"}
          </p>
          {/* <div className="flex items-center gap-8 z-10 mt-5">
            <Button className="rounded-lg " variant={"secondary"}>
              {banner.ctaText || "Add Community"}
            </Button>
            <div className="text-base font-bold leading-6 flex items-center">
              <p>Info</p> <Info className="ml-2" />
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
