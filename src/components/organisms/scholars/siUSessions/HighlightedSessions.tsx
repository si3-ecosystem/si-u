import { HighlightedSessionCard } from "@/components/molecules/cards/HighlightedSessionCard";
import { SessionFilterDropdown } from "@/components/molecules/filters/SessionFilterDropdown";
import { urlForImage } from "@/lib/sanity/image";
import { Session } from "@/types/session";
import { Row } from "@tanstack/react-table";

interface HighlightedSessionsProps {
  title: string;
  description: string;
  rows: Row<Session>[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedStatus: "in_progress" | "completed" | "not_started" | "all" | null;
  setSelectedStatus: (
    value: "in_progress" | "completed" | "not_started" | "all" | null
  ) => void;
  selectedCommunity: string;
  setSelectedCommunity: (value: string) => void;
  dateRange: { start: string | null; end: string | null };
  setDateRange: (value: { start: string | null; end: string | null }) => void;
}

export function HighlightedSessions({
  title,
  description,
  rows,
  globalFilter,
  setGlobalFilter,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  selectedCommunity,
  setSelectedCommunity,
  dateRange,
  setDateRange,
}: HighlightedSessionsProps) {
  return (
    <div>
      <div className="flex items-center justify-between w-full mb-8">
        <div>
          <h2 className="text-black text-xl lg:text-2xl font-medium mb-2">
            {title}
          </h2>
          <p className="text-brandGray text-base leading-[140%] font-normal mb-4">
            {description}
          </p>
        </div>
        <SessionFilterDropdown
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedCommunity={selectedCommunity}
          setSelectedCommunity={setSelectedCommunity}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {rows.length === 0 ? (
          <p>No sessions found.</p>
        ) : (
          rows.map((row) => {
            const session = row.original;

            console.log("session", session);

            return (
              <HighlightedSessionCard
                key={session._id}
                data={{
                  title: session.title,
                  description: session.description,
                  ctaLink: `/scholars/sessions/${session._id}`,
                  progress: session.progress,
                  status: session.status,
                  position: session.position,
                  community: session.community?.communityName,
                  company: session.company,
                  videourl: session.videoUrl,
                  topic: session.topic,
                  speakerName: session.speakerName,
                  speakerImage: session.speakerImage,
                }}
                imageUrl={
                  session.thumbnail
                    ? urlForImage(session.thumbnail)?.src
                    : "/card_placeholder.png"
                }
              />
            );
          })
        )}
      </div>
    </div>
  );
}
