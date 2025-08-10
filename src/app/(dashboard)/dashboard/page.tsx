"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Kollabs } from "@/components/molecules/icons/Kollabs";
import { Rewards } from "@/components/molecules/icons/Rewards";
import { SessionsCompleted } from "@/components/molecules/icons/SessionsCompleted";
import { LearningProgress } from "@/components/organisms/dashboard/dashboardLearningProgress";
import { DashboardProfileHeader } from "@/components/organisms/dashboard/dashboardProfileHeader";
import { UpcomingSessions } from "@/components/organisms/dashboard/dashboardUpcomingSessions";
import { useAppSelector } from "@/redux/store";
import { useQuery } from "@tanstack/react-query";
import { getDashboardBanner } from "@/lib/sanity/client";
import Loading from "@/app/loading";

const statsData = [
  {
    title: "Total earned",
    value: "1211 $SIU",
    icon: <Rewards />,
    iconColor: "bg-yellow-100",
  },
  {
    title: "Kollabs completed",
    value: "03",
    icon: <Kollabs />,
    iconColor: "bg-purple-100",
  },
  {
    title: "Sessions completed",
    value: "06",
    icon: <SessionsCompleted />,
    iconColor: "bg-orange-100",
  },
  {
    title: "Certifications achieved",
    value: "09",
    icon: <SessionsCompleted />,
    iconColor: "bg-blue-100",
  },
];

const coursesData = [
  {
    title: "The Future of User Engagement in Web3",
    progress: 87,
    avatarUrl: "/card_placeholder.png",
  },
  {
    title: "How to Build A Successful Team",
    progress: 45,
    avatarUrl: "/card_placeholder.png",
  },
  {
    title: "SocialFi: The Next Evolution of Crypto",
    progress: 45,
    avatarUrl: "/card_placeholder.png",
  },
];

const sessionsData = [
  {
    day: 25,
    month: "Apr",
    title: "SI HER DAO: Awareness Campaigns",
    date: "25th April 2025",
    time: "8:30-9:30 PM (UTC +6)",
    isLive: true,
  },
  {
    day: 30,
    month: "Apr",
    title: "Crypto Trading School",
    date: "30th April 2025",
    time: "8:30-9:30 PM (UTC +6)",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const currentUser = useAppSelector(state => state.user);
  const [isClient, setIsClient] = React.useState(false);

   const { data, isLoading } = useQuery({
    queryKey: ["dashboardBanner"],
    queryFn: getDashboardBanner,
  });


  // Ensure client-side rendering for user data to prevent hydration mismatch
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Get user data with fallbacks - only on client side
  const username = isClient ?
    (currentUser?.user?.email || currentUser?.user?.username || "user.edu") :
    "user.edu";
  const walletAddress = isClient ? currentUser?.user?.walletAddress : null;
  const subtext = isClient && walletAddress ?
    `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}.siher.eth` :
    "user.siher.eth";
  const avatarUrl = isClient ?
    (currentUser?.user?.avatar || "/placeholder.png") :
    "/placeholder.png";

  const handleShareProfile = () => {
    console.log("Share profile clicked");
  };

  const handleEditProfile = () => {
    router.push("/settings");
  };

  const handleLearnMore = () => {
    console.log("Learn more clicked");
  };

  const handleExploreSessions = () => {
    console.log("Explore sessions clicked");
  };

  if(isLoading) return <Loading />;

  return (
    <div className="min-h-screen w-full bg-[#f6f6f6]">
      <DashboardProfileHeader
        username={username}
        subtext={subtext}
        avatarUrl={avatarUrl}
        onShare={handleShareProfile}
        onEdit={handleEditProfile}
        statsData={statsData}
        bannerData={data}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <LearningProgress courses={coursesData} onLearnMore={handleLearnMore} />
        <UpcomingSessions
          sessions={sessionsData}
          onExplore={handleExploreSessions}
        />
      </div>
    </div>
  );
}
