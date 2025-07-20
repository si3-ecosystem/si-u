"use client";

import { Kollabs } from "@/components/molecules/icons/Kollabs";
import { Rewards } from "@/components/molecules/icons/Rewards";
import { SessionsCompleted } from "@/components/molecules/icons/SessionsCompleted";
import { LearningProgress } from "@/components/organisms/dashboard/dashboardLearningProgress";
import { DashboardProfileHeader } from "@/components/organisms/dashboard/dashboardProfileHeader";

import { UpcomingSessions } from "@/components/organisms/dashboard/dashboardUpcomingSessions";
import { useAuth } from "@/hooks/useAuth";
import { ClientOnly } from "@/components/atoms/ClientOnly";

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
  const { user, getDisplayName } = useAuth();

  const profileData = {
    username: user?.username || user?.email || `${getDisplayName().toLowerCase().replace(' ', '')}.edu`,
    subtext: user?.website || `${getDisplayName().toLowerCase().replace(' ', '')}.siher.eth`,
    avatarUrl: user?.avatar || "/placeholder.png",
  };

  const handleShareProfile = () => {
    console.log("Share profile clicked");
  };

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
  };

  const handleLearnMore = () => {
    console.log("Learn more clicked");
  };

  const handleExploreSessions = () => {
    console.log("Explore sessions clicked");
  };
  return (
    <div className="min-h-screen w-full bg-[#f6f6f6]">
      <ClientOnly fallback={
        <DashboardProfileHeader
          username="Loading..."
          subtext="Loading..."
          avatarUrl="/placeholder.png"
          onShare={handleShareProfile}
          onEdit={handleEditProfile}
          statsData={statsData}
        />
      }>
        <DashboardProfileHeader
          username={profileData.username}
          subtext={profileData.subtext}
          avatarUrl={profileData.avatarUrl}
          onShare={handleShareProfile}
          onEdit={handleEditProfile}
          statsData={statsData}
        />
      </ClientOnly>

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
