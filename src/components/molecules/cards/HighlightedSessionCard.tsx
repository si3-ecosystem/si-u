import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface HighlightedSessionData {
  title: string;
  description: string;
  ctaLink: string;
  progress?: number;
  status?: string;
  position?: string;
  community?: string;
  company?: string;
  videourl?: string;
}

interface HighlightedSessionCardProps {
  data: HighlightedSessionData;
  imageUrl?: string;
}

export function HighlightedSessionCard({
  data,
  imageUrl,
}: HighlightedSessionCardProps) {
  return (
    <Card className=" flex h-full w-full flex-col gap-6 shadow-none border-none  p-5">
      <div className="overflow-hidden rounded-2xl h-[144px] relative">
        <Image
          src={imageUrl || "/icons/jpg/si_her_guides_heroimage.jpg"}
          fill
          loading="lazy"
          decoding="async"
          alt="scholars"
          className="h-full w-full object-cover"
        />
        <Badge className="absolute top-2 left-2  ">Web3 Natives</Badge>
      </div>
      <div className="h-full flex flex-col justify-between gap-4 max-h-[220px]">
        <div className="flex flex-col ">
          <h2>{data.title}</h2>

          {data.community ? (
            <p className="text-sm font-medium text-brand leading-5 mt-1">
              {data.community}
            </p>
          ) : (
            <p className="text-sm font-medium text-brand leading-5 mt-1">
              {data.company}
            </p>
          )}
          <p className="text-xs text-brandGray leading-[18px] mt-1">
            {data.position}
          </p>

          {data?.status === "in_progress" ? (
            <div className="mt-4">
              <div className="flex  flex-col">
                <div className="w-full flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-left w-full text-gray-600 mb-2">
                    ENROLLED
                  </span>
                  <span className=" text-sm font-semibold text-[#8B8B8B]">
                    {data.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: `${data.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <h2 className="text-black text-sm leading-5 mt-2 line-clamp-4">
              {data.description}
            </h2>
          )}
        </div>
        <Button
          asChild
          variant={"outline"}
          className="w-full hover:bg-black hover:text-white h-11 rounded-lg "
        >
          <Link href={data.ctaLink || "#"}>Learn More</Link>
        </Button>
      </div>
    </Card>
  );
}
