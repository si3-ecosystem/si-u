"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { urlForImage } from "@/lib/sanity/image";
import { SessionCategoryCount, SessionSchema, Topic } from "@/types/session";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PopularTopics({
  data,
  setSelectedCategory,
}: {
  data: SessionSchema;
  categoryCounts?: SessionCategoryCount[];
  setSelectedCategory: (value: string) => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: false,
    dragFree: true,
  });


  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative ">
      <h2 className="text-black text-xl lg:text-2xl font-medium mb-2">
        {data.title}
      </h2>
      <p className="text-brandGray text-base leading-[140%] font-normal mb-4">
        {data.description}
      </p>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {data?.topics?.map((item: Topic, key) => {
              const value = item.title 
              const imageurl = item.icon && urlForImage(item.icon)?.src;
              return (
                <div
                  key={key}
                  className="flex-shrink-0 flex flex-col max-w-[228px] w-full rounded-lg bg-white overflow-hidden"
                  onClick={() => setSelectedCategory(value)}
                  style={{ cursor: 'pointer' }}
                >
                  {imageurl && (
                    <div className="relative w-full h-20 mb-2 overflow-hidden rounded-md">
                      <Image
                        src={imageurl}
                        alt={item.title}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-medium leading-6 text-black">
                      {item.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md -ml-4 ${
            !prevBtnEnabled ? "opacity-50 cursor-default" : ""
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <button
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md -mr-4 ${
            !nextBtnEnabled ? "opacity-50 cursor-default" : ""
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
