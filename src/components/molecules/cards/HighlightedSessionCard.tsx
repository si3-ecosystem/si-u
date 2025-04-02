import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface HighlightedSessionData {
  title: string;
  description: string;
  ctaLink: string;
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
      <div className="flex flex-col ">
        <h2>{data.title}</h2>
        <p className="text-sm font-medium text-brand leading-5 mt-1">
          karakrysthal X Elena
        </p>
        <p className="text-xs text-brandGray leading-[18px] mt-1">
          Co-Founder & DC, Metis
        </p>
        <h2 className="text-black text-sm leading-5 mt-2">
          {data.description}
        </h2>
        <Button
          asChild
          variant={"outline"}
          className="w-full hover:bg-black hover:text-white h-11 rounded-lg mt-4"
        >
          <Link href={data.ctaLink || "#"}>Learn More</Link>
        </Button>
      </div>
    </Card>
  );
}
