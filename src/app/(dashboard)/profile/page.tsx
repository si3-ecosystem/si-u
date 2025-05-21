import { KollabsSection } from "@/components/organisms/profile/KollabsSection";
import { ProfileHeader } from "@/components/organisms/profile/ProfileHeader";
import { StatsGrid } from "@/components/organisms/profile/StatsGrid";
import { SuggestedKollaboards } from "@/components/organisms/profile/SuggestedKollaboards";
import {
  kollabs,
  profileStats,
  suggestedKollaboards,
} from "@/constants/profile";

export default function ProfilePage() {
  return (
    <section className="container w-full mx-auto px-4 flex flex-col gap-8 md:gap-12">
      <ProfileHeader
        name="ELENA OWEN"
        username="@elenaowen"
        website="elena.edu"
      />
      <StatsGrid stats={profileStats} />
      <KollabsSection kollabs={kollabs} />
      <SuggestedKollaboards kollaboards={suggestedKollaboards} />
    </section>
  );
}
