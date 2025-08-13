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

export default function ProfilePage() {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.user);

  const handleEditProfile = () => {
    router.push("/settings");
  };

  const handleShare = () => {
    console.log("Share profile clicked");
  };

  const userEmail = currentUser?.user?.email || "";
  const username = currentUser?.user?.username || "";
  const website = currentUser?.user?.website || "";

  return (
    <section className="container w-full mx-auto px-4 flex flex-col gap-8 md:gap-12">
      <ProfileHeader
        username={username}
        website={website}
        email={userEmail}
        onEditProfile={handleEditProfile}
        onShare={handleShare}
      />
      <div className="flex flex-col gap-8 md:gap-12 relative ">
        <div className="flex flex-col gap-8 md:gap-12 relative blur-sm">
          <StatsGrid stats={profileStats} />
          <KollabsSection kollabs={kollabs} />
          <SuggestedKollaboards kollaboards={suggestedKollaboards} />
        </div>

        {/* Coming Soon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Coming Soon
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
