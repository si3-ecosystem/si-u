import { urlForImage } from "@/lib/sanity/image";
import { SessionCategoryCount, SessionSchema, Topic } from "@/types/session";
import Image from "next/image";

export function PopularTopics({
  data,
  categoryCounts,
}: {
  data: SessionSchema;
  categoryCounts: SessionCategoryCount[];
}) {
  if (!data) return null;

  return (
    <div>
      <h2 className="text-black text-xl lg:text-2xl font-medium mb-2">
        {data.title}
      </h2>
      <p className="text-brandGray text-base leading-[140%] font-normal mb-4">
        {data.description}
      </p>
      <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide md:overflow-x-visible no-scrollbar gap-6">
        {data?.topics?.map((item: Topic, key) => {
          const imageurl = item.icon && urlForImage(item.icon)?.src;
          return (
            <div
              key={key}
              className="flex flex-col max-w-[228px] w-full rounded-lg bg-white overflow-hidden"
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
                <p className="text-base font-medium opacity-50">
                  {(() => {
                    const cat = categoryCounts?.find(
                      (c) => c.category === item.categoryKey
                    );
                    const count = cat ? cat.count : 0;
                    return (
                      <span className=" text-brandGray">
                        {count.toString().padStart(2, "0")} upcoming sessions
                      </span>
                    );
                  })()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
