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
  pageIndex: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  previousPage: () => void;
  nextPage: () => void;
  gotoPage: (page: number) => void;
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
  pageIndex,
  pageCount,
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
  gotoPage,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {rows.length === 0 ? (
          <p>No sessions found.</p>
        ) : (
          rows.map((row) => {
            const session = row.original;

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

      {/* Pagination Controls */}
      {pageCount > 1 && (
        <div className="flex items-center max-w-[400px] mx-auto w-full justify-between mt-8 gap-3">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            First
          </button>
          <div className="flex items-center gap-2 ">
            <button
              onClick={previousPage}
              disabled={!canPreviousPage}
              className="px-3 py-1 rounded-md border border-gray-300 max-sm:hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
              // Show first page, last page, and pages around current page
              let pageNumber: number;
              if (pageCount <= 5) {
                pageNumber = i;
              } else if (pageIndex < 3) {
                pageNumber = i; // First few pages
              } else if (pageIndex > pageCount - 4) {
                pageNumber = pageCount - 5 + i; // Last few pages
              } else {
                pageNumber = pageIndex - 2 + i; // Middle pages
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => gotoPage(pageNumber)}
                  className={`w-9 h-9 rounded-md ${
                    pageIndex === pageNumber
                      ? "bg-brand text-white"
                      : "border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {pageNumber + 1}
                </button>
              );
            })}

            <button
              onClick={nextPage}
              disabled={!canNextPage}
              className="px-3 py-1 rounded-md border max-sm:hidden border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
}
