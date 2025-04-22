import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { urlForImage } from "@/lib/sanity/image";
import { SanityImage, Tag } from "@/types/session";
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
  tags: Tag[];
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
        <div className="absolute top-2 left-2 flex flex-wrap gap-2">
          {data?.tags?.length > 0 &&
            data.tags.map((tag) => (
              <Badge key={tag._id} className=" ">
                {tag.title}
              </Badge>
            ))}
        </div>
      </div>
      <div className="h-full flex flex-col justify-between gap-4 max-h-[220px]">
        <div className="flex flex-row gap-4">
          <div className="flex flex-col flex-grow">
            <div className="flex gap-4 justify-between w-full">
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold">{data.title}</h2>
                {data.community ? (
                  <p className="text-base font-medium text-brand leading-5 mt-1">
                    {data.community}
                  </p>
                ) : (
                  <p className="text-base font-medium text-brand leading-5 mt-1">
                    {data.company}
                  </p>
                )}
                {data.speakerName && (
                  <p className="text-sm text-brandGray leading-5 mt-1">
                    {data.speakerName}
                    {data.position && `, ${data.position}`}
                  </p>
                )}
              </div>
              {speakerImageUrl && (
                <div className="w-12 h-12 rounded-full overflow-hidden">
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
