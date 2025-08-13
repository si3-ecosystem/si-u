import { Globe, LinkedinIcon, MapPin, TwitterIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Community } from "@/types/community";
import { urlForImage } from "@/lib/sanity/image";
import { PartnerProgramForm } from "@/components/molecules/forms/PartnerProgramForm";

export function CollabCard({ item }: { item: Community }) {
  const cardBg = item.background && urlForImage(item?.background)?.src;

  const image = item.communityLogo && urlForImage(item?.communityLogo)?.src;

  return (
    <Card className="h-fit cursor-pointer overflow-hidden rounded-2xl !p-0 transition-all duration-300 !ease-in-out hover:shadow-lg sm:!h-full">
      <div className="flex h-full flex-col justify-between !p-0 -mt-1">
        <div className="flex h-fit flex-col">
          <div className="relative z-20 flex h-full w-full flex-col gap-6 px-5 pt-5">
            <Image
              src={cardBg || "/icons/jpg/collabcardbg.jpg"}
              alt={"community_bg"}
              title={"Background"}
              decoding="async"
              loading="lazy"
              fill
              className="absolute inset-0 -z-10 h-full w-full object-cover origin-center"
            />
            <div className="z-10 flex w-full items-start justify-between gap-4">
              <div className="flex h-[75px] w-[75px] items-center justify-center rounded-[14px] bg-white p-2 shadow-md">
                <Image
                  src={image || "/icons/jpg/sihericon.jpg"}
                  alt={item?.communityName}
                  title={item?.communityName}
                  decoding="async"
                  loading="lazy"
                  width={56}
                  height={56}
                  className="h-full w-full rounded-sm object-contain"
                />
              </div>
              <span className="flex items-center gap-2 text-white">
                <MapPin className="text-white size-4" />
                <p className=" text-base leading-6 font-normal text-white">
                  {item?.communityLocation}
                </p>
              </span>
            </div>
            <div className="flex flex-col gap-2 pb-3">
              <h4 className="line-clamp-2 text-xl leading-normal text-white font-semibold tracking-tight whitespace-pre-wrap text-black uppercase">
                {item?.communityName}
              </h4>
              <ul className="flex flex-wrap gap-3.5">
                {item?.communityType && item.communityType.length > 0 ? (
                  item.communityType.map((type, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="gap-1.5 border-none bg-none text-white outline-none"
                    >
                      <span
                        className="size-1.5 rounded-full bg-white"
                        aria-hidden="true"
                      ></span>
                      {type}
                    </Badge>
                  ))
                ) : (
                  <span className="opacity-0 ">Not Found</span>
                )}
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-6 bg-white px-5 py-6">
            <p className="line-clamp-5 break-words whitespace-pre-wrap ">
              {item?.communityDescription}
            </p>
            <ul className="flex flex-col gap-2.5">
              {item?.communityWebsite && (
                <li className="flex items-center gap-2">
                  <Globe className=" size-5 text-brand" />
                  <Link
                    target="_blank"
                    href={item.communityWebsite}
                    className="text-brand"
                  >
                    {item.communityWebsite}
                  </Link>
                </li>
              )}
              {item?.xHandle && (
                <li className="flex items-center gap-2">
                  <TwitterIcon className="text-brand" />
                  <Link
                    href={`https://twitter.com/${item.xHandle}`}
                    target="_blank"
                    className="text-brand"
                  >
                    {item.xHandle}
                  </Link>
                </li>
              )}

              {item?.linkedXHandle && (
                <li className="flex items-center gap-2">
                  <LinkedinIcon className="text-brand size-5" />
                  <Link
                    target="_blank"
                    href={`https://warpcast.com/${item.linkedIn}`}
                    className="text-brand"
                  >
                    {item.linkedXHandle}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="w-full px-5 pb-4">
          <PartnerProgramForm title="Partnership Inquiry" />
        </div>
      </div>
    </Card>
  );
}
