import { Banner } from "@/components/organisms/scholars/siUSessions/Banner";
import { HighlightedSessions } from "@/components/organisms/scholars/siUSessions/HighlightedSessions";
import { PopularTopics } from "@/components/organisms/scholars/siUSessions/PopularTopics";

export default function page() {
  return (
    <div className="max-w-[1920px] w-full bg-[#f6f6f6] p-6 min-h-screen md:!pr-20 flex flex-col gap-8 lg:gap-16">
      <Banner />
      <PopularTopics />
      <HighlightedSessions />
    </div>
  );
}
