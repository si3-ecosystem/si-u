"use client";

import { useEffect, useRef, useState } from "react";
import { urlForImage } from "@/lib/sanity/image";
import { SessionCategoryCount, SessionSchema, Topic } from "@/types/session";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PopularTopics({
  data,
}: {
  data: SessionSchema;
  categoryCounts?: SessionCategoryCount[];
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll(); // Initial check
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, [data?.topics?.length]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      <h2 className="text-black text-xl lg:text-2xl font-medium mb-2">
        {data.title}
      </h2>
      <p className="text-brandGray text-base leading-[140%] font-normal mb-4">
        {data.description}
      </p>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md -ml-4"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto whitespace-nowrap scrollbar-hide md:overflow-x-visible no-scrollbar gap-6 scroll-smooth"
          style={{ scrollBehavior: "smooth" }}
        >
          {data?.topics?.map((item: Topic, key) => {
            const imageurl = item.icon && urlForImage(item.icon)?.src;
            return (
              <div
                key={key}
                className="flex-shrink-0 flex flex-col max-w-[228px] w-full rounded-lg bg-white overflow-hidden"
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

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md -mr-4"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}
