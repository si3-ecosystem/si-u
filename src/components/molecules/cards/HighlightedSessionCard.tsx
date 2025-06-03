import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { urlForImage } from "@/lib/sanity/image";
import { SanityImage, Topic } from "@/types/session";
import Image from "next/image";
import Link from "next/link";

interface HighlightedSessionData {
  title: string;
  description: string;
  ctaLink: string;
  progress?: number;
  status?: string | null;
  position?: string;
  community?: string;
  company?: string;
  videourl?: string;
  topic: Topic | null;
  speakerName?: string;
  speakerImage: SanityImage | null;
}

interface HighlightedSessionCardProps {
  data: HighlightedSessionData;
  imageUrl?: string;
}

export function HighlightedSessionCard({
  data,
  imageUrl,
}: HighlightedSessionCardProps) {
  const speakerImageUrl = data.speakerImage
    ? urlForImage(data.speakerImage)?.src
    : undefined;

  return (
    <Card className=" flex h-full w-full flex-col gap-[22px] shadow-none border-none  p-5">
      <div className="overflow-hidden rounded-2xl h-[207px] relative">
        <Image
          src={imageUrl || "/icons/jpg/si_her_guides_heroimage.jpg"}
          fill
          loading="lazy"
          decoding="async"
          alt="scholars"
          className="h-full w-full object-cover"
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-2">
          {data.topic && (
            <Badge key={data.topic.title}>{data.topic.title}</Badge>
          )}
        </div>
      </div>
      <div className="h-full flex flex-col justify-between gap-9 max-h-[220px]">
        <div className="flex flex-row gap-5">
          <div className="flex flex-col flex-grow">
            <div className="flex gap-5 justify-between w-full">
              <div className="flex flex-col gap-5">
                <h2 className="text-2xl font-bold text-[#9F44D3]">
                  {data.title}
                </h2>
                {/* {data.community ? (
                  <p className="text-base font-semibold text-brand leading-5 mt-1">
                    {data.community}
                  </p>
                ) : (
                  <p className="text-base font-semibold text-brand leading-5 mt-1">
                    {data.company}
                  </p>
                )} */}
                {data.speakerName && (
                  <p className="text-sm font-semibold text-brandGray leading-5 mt-1">
                    {data.speakerName}
                    <span className="text-sm font-normal text-[#00000099]">
                      {" "}
                      {data.position && `, ${data.position}`}
                    </span>
                  </p>
                )}
              </div>
              {speakerImageUrl && (
                <div className="w-[115px] h-auto rounded-full overflow-hidden">
                  <Image
                    src={speakerImageUrl}
                    width={48}
                    height={48}
                    alt={data.speakerName ?? "Speaker"}
                    className="rounded-full object-cover w-full h-full"
                  />
                </div>
              )}
            </div>

            <p className="text-sm text-brandGray leading-[18px] mt-2 line-clamp-3">
              {data.description}
            </p>
          </div>
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
