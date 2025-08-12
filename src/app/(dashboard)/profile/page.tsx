"use client";

import { useRouter } from "next/navigation";
import { KollabsSection } from "@/components/organisms/profile/KollabsSection";
import { ProfileHeader } from "@/components/organisms/profile/ProfileHeader";
import { StatsGrid } from "@/components/organisms/profile/StatsGrid";
import { SuggestedKollaboards } from "@/components/organisms/profile/SuggestedKollaboards";
import { useAppSelector } from "@/redux/store";
import {
  kollabs,
  profileStats,
  suggestedKollaboards,
} from "@/constants/profile";
import { getDisplayUsernameWithAt } from "@/lib/utils/username";

export default function ProfilePage() {
  const router = useRouter();
  const currentUser = useAppSelector(state => state.user);

  const handleEditProfile = () => {
    router.push("/settings");
  };

  const handleShare = () => {
    // Implement share functionality
    console.log("Share profile clicked");
  };

  // Get user data with fallbacks
  const userName = currentUser?.user?.name || currentUser?.user?.username || "User";
  const userEmail = currentUser?.user?.email || "";
  const username = getDisplayUsernameWithAt(currentUser?.user);
  const website = currentUser?.user?.website || "";

  return (
    <section className="container w-full mx-auto px-4 flex flex-col gap-8 md:gap-12">
      <ProfileHeader
        name={userName.toUpperCase()}
        username={username}
        website={website}
        onEditProfile={handleEditProfile}
        onShare={handleShare}
      />
      <StatsGrid stats={profileStats} />
      <KollabsSection kollabs={kollabs} />
      <SuggestedKollaboards kollaboards={suggestedKollaboards} />
    </section>
  );
}
