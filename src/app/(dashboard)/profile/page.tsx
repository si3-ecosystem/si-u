"use client";

import { KollabsSection } from "@/components/organisms/profile/KollabsSection";
import { ProfileHeader } from "@/components/organisms/profile/ProfileHeader";
import { StatsGrid } from "@/components/organisms/profile/StatsGrid";
import { SuggestedKollaboards } from "@/components/organisms/profile/SuggestedKollaboards";
import {
  kollabs,
  profileStats,
  suggestedKollaboards,
} from "@/constants/profile";
import { useAuth } from "@/hooks/useAuth";
import { ClientOnly } from "@/components/atoms/ClientOnly";
import { LoadingSpinner } from "@/components/atoms/LoadingSpinner";

export default function ProfilePage() {
  const { user, getDisplayName, isLoading } = useAuth();

  return (
    <section className="container w-full mx-auto px-4 flex flex-col gap-8 md:gap-12">
      <ClientOnly fallback={<LoadingSpinner text="Loading profile..." />}>
        <ProfileHeader
          name={getDisplayName().toUpperCase()}
          username={user?.username ? `@${user.username}` : `@${user?.email?.split('@')[0] || 'user'}`}
          website={user?.website || `${getDisplayName().toLowerCase().replace(' ', '')}.edu`}
        />
      </ClientOnly>
      <StatsGrid stats={profileStats} />
      <KollabsSection kollabs={kollabs} />
      <SuggestedKollaboards kollaboards={suggestedKollaboards} />
    </section>
  );
}
