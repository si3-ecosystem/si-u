import { HighlightedSessionCard } from "@/components/molecules/cards/HighlightedSessionCard";
import { SlidersHorizontal } from "lucide-react";

export function HighlightedSessions() {
  const sessionData = {
    title: "Si Her Granting Pathways",
    description:
      "We are opening up the new month reflecting on the successes our last month.",
    ctaLink: "/learn-more",
  };
  return (
    <div>
      <div className="flex items-center justify-between w-full mb-8">
        <h2 className="text-black text-xl lg:text-2xl font-medium mb-2">
          Highlighted Sessions
        </h2>
        <div className="text-black text-xl lg:text-2xl font-medium mb-2 flex items-center gap-2">
          <SlidersHorizontal />
          Filter
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <HighlightedSessionCard
          data={sessionData}
          imageUrl="/card_placeholder.png"
        />
      </div>
    </div>
  );
}
