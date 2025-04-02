"use client";

import { LearningProgress } from "@/components/organisms/dashboard/dashboardLearningProgress";
import { DashboardProfileHeader } from "@/components/organisms/dashboard/dashboardProfileHeader";
import {
  StatsCard,
  StatsCardGrid,
} from "@/components/organisms/dashboard/dashboardStatsCard";
import { UpcomingSessions } from "@/components/organisms/dashboard/dashboardUpcomingSessions";
import { Banknote, BookOpen, GraduationCap, Users } from "lucide-react";

const statsData = [
  {
    title: "Total earned",
    value: "1211 $SIU",
    icon: <Banknote className="h-5 w-5 text-yellow-500" />,
    iconColor: "bg-yellow-100",
  },
  {
    title: "Kollabs completed",
    value: "03",
    icon: <Users className="h-5 w-5 text-purple-500" />,
    iconColor: "bg-purple-100",
  },
  {
    title: "Sessions completed",
    value: "06",
    icon: <BookOpen className="h-5 w-5 text-orange-500" />,
    iconColor: "bg-orange-100",
  },
  {
    title: "Certifications achieved",
    value: "09",
    icon: <GraduationCap className="h-5 w-5 text-blue-500" />,
    iconColor: "bg-blue-100",
  },
];

const coursesData = [
  {
    title: "The Future of User Engagement in Web3",
    progress: 87,
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    title: "How to Build A Successful Team",
    progress: 45,
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    title: "SocialFi: The Next Evolution of Crypto",
    progress: 45,
    avatarUrl: "/placeholder.svg?height=40&width=40",
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
  const profileData = {
    username: "annabanana.edu",
    subtext: "annabanana.siher.eth",
    avatarUrl: "/placeholder.svg?height=64&width=64",
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
    <div className="min-h-screen w-full bg-[#f6f6f6] p-6  md:!pr-20">
      <DashboardProfileHeader
        username={profileData.username}
        subtext={profileData.subtext}
        avatarUrl={profileData.avatarUrl}
        onShare={handleShareProfile}
        onEdit={handleEditProfile}
      />

      <StatsCardGrid>
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </StatsCardGrid>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LearningProgress courses={coursesData} onLearnMore={handleLearnMore} />
        <UpcomingSessions
          sessions={sessionsData}
          onExplore={handleExploreSessions}
        />
      </div>
    </div>
  );
}
