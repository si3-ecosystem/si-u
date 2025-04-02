"use client";

import { CollabCard } from "@/components/molecules/cards/collabCard";
import { Banner } from "@/components/organisms/communities/Banner";
import { CommunitiesSearchAndFilter } from "@/components/organisms/communities/CommunitiesSearchAndFilter";
import { useCommunitiesFilter } from "@/hooks/useCommunitiesFilterReturn";

const communities = [
  {
    _id: "1",
    published: true,
    order: 1,
    background: "/community/communitycardbg.png",
    communityLogo: "/community/applistlogo.png",
    communityName: "APP LIST",
    communityType: ["Women & Non-Binary", "Education"],
    communityLocation: "Global",
    communityDescription:
      "Find, Book and Meet Mentors around the world. Get virtual mentorship from over 1,374+ mentors from the world’s leading companies in our global community.",
    communityWebsite: "https://applist.com",
    communityLeaderName: "Kara Sher",
    communityLeaderEmail: "kara@example.com",
    xHandle: "kara_sher.eth",
    linkedIn: "kara_sher.eth",
    discover: "mentorship",
  },
  {
    _id: "2",
    published: true,
    order: 2,
    background: "/community/communitycardbg.png",
    communityLogo: "/community/appaustinlogo.png",
    communityName: "AIGA AUSTIN",
    communityType: ["Women & Non-Binary"],
    communityLocation: "Global",
    communityDescription:
      "AIGA is the professional association for design. We connect our creative community through programming that inspires, educates and advocates for design.",
    communityWebsite: "https://aiga-austin.com",
    communityLeaderName: "Kara Sher",
    communityLeaderEmail: "kara@example.com",
    xHandle: "kara_sher.eth",
    linkedIn: "kara_sher.eth",
    discover: "design",
  },
  {
    _id: "3",
    published: true,
    order: 3,
    background: "/community/communitycardbg.png",
    communityLogo: "/community/appaustinlogo.png",
    communityName: "API WHO DESIGN",
    communityType: ["Women & Non-Binary", "Education"],
    communityLocation: "Global",
    communityDescription:
      "API (Asian & Pacific Islanders) Who Design is a living and growing directory that features APIs in the design industry. Our mission is to highlight the breadth of talent within...",
    communityWebsite: "https://apiwhodesign.com",
    communityLeaderName: "Kara Sher",
    communityLeaderEmail: "kara@example.com",
    xHandle: "kara_sher.eth",
    linkedIn: "kara_sher.eth",
    discover: "design",
  },
];
export default function CommunityPage() {
  const { filteredCommunities } = useCommunitiesFilter(communities);
  return (
    <div className="py-8 flex flex-col gap-10 lg:gap-16 max-lg:px-4">
      <Banner />
      <CommunitiesSearchAndFilter communities={communities} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 container mx-auto w-full">
        {filteredCommunities.length > 0 ? (
          filteredCommunities.map((community) => (
            <CollabCard key={community.communityName} item={community} />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            No communities found.
          </p>
        )}
      </div>
    </div>
  );
}
