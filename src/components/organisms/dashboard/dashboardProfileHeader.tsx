"use client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { StatsCard, StatsCardGrid } from "./dashboardStatsCard";
import { ProfileDiamond } from "@/components/molecules/icons/ProfileDiamond";
import { urlForImage } from "@/lib/sanity/image";

interface statsData {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconColor: string;
}

interface ProfileHeaderProps {
  username: string;
  subtext?: string;
  avatarUrl: string;
  statsData: statsData[];
  onShare?: () => void;
  onEdit?: () => void;
  bannerData: any;
}

export function DashboardProfileHeader({
  username,
  subtext,
  avatarUrl,
  onShare,
  onEdit,
  statsData,
  bannerData
}: ProfileHeaderProps) {

  const backgroundImage = bannerData?.banner?.background && urlForImage(bannerData?.banner?.background)?.src;
  return (
    <div className="flex flex-col justify-between rounded-lg  p-6 min-h-[267px] relative">
      <Image
        src={backgroundImage || "/dashboardbg.png"}
        alt="background"
        fill
        className="w-full absolute inset-0 z-0 object-cover object-center"
      />
      <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
          <div className="relative ">
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 ">
              <Image
                src={avatarUrl || "/placeholder.svg"}
                alt={username}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 flex items-center size-6 justify-center ">
              <ProfileDiamond />
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">{username}</h2>
            {subtext && <p className="text-sm text-gray-500">{subtext}</p>}
          </div>
        </div>
        <div className="flex gap-3 z-10">
          <Button
            variant="outline"
            className="rounded-lg bg-white"
            onClick={onShare}
          >
            Share Profile
          </Button>
          <Button
            className="rounded-lg bg-black text-white hover:bg-gray-800"
            onClick={onEdit}
          >
            Edit Profile
          </Button>
        </div>
      </div>
      <div className="z-10 ">
        <StatsCardGrid>
          {statsData.map((stat: statsData, index: number) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconColor={stat.iconColor}
            />
          ))}
        </StatsCardGrid>
      </div>
    </div>
  );
}
