"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { urlForImage } from "@/lib/sanity/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Topic {
  _id: string;
  title: string;
  description?: string;
  slug?: {
    current: string;
  };
  icon?: any;
}

interface CategoryCount {
  category: string;
  count: number;
}

interface PopularTopicsProps {
  data: {
    title?: string;
    description?: string;
    topicTitle?: string;
    topicDesc?: string;
    topics?: Topic[];  // Array of topics
  };
  categoryCounts?: CategoryCount[];
  setSelectedCategory: (value: string) => void;
  selectedCategory?: string;
}

export function PopularTopics({
  data,
  categoryCounts = [],
  setSelectedCategory,
  selectedCategory,
}: PopularTopicsProps) {
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

  // Create display items from the topics array or fallback to category counts
  const displayItems = data?.topics && data.topics.length > 0
    ? data.topics // Use the topics array directly
    : categoryCounts
        .filter((count) => count.category !== "all")
        .map((count) => ({
          _id: count.category,
          title:
            count.category.charAt(0).toUpperCase() + count.category.slice(1),
          slug: { current: count.category },
        }));

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-black text-xl lg:text-2xl font-medium mb-2">
            {data?.topicTitle || data?.title || "Popular Topics"}
          </h2>
          <p className="text-brandGray text-base leading-[140%] font-normal">
            {data?.topicDesc || data?.description || "Explore sessions by category"}
          </p>
        </div>
        {selectedCategory && selectedCategory !== "all" && selectedCategory !== "" && (
          <button
            onClick={() => setSelectedCategory("all")}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {/* Category/Topic Cards - No "All Sessions" card */}
            {displayItems?.map((item: any, index: number) => {
              const categorySlug = item.slug?.current || item._id;
              const imageUrl = item.icon && urlForImage(item.icon)?.src;

              return (
                <div
                  key={index}
                  className={`flex-shrink-0 flex flex-col max-w-[228px] w-full rounded-lg bg-white overflow-hidden border-2 transition-colors cursor-pointer ${
                    selectedCategory === categorySlug 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedCategory(categorySlug)}
                >
                  {imageUrl && (
                    <div className="relative w-full h-20 mb-2 overflow-hidden rounded-md">
                      <Image
                        src={imageUrl}
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

        {/* Navigation Buttons */}
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
