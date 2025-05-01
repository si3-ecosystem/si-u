"use client";

import Loading from "@/app/loading";
import { CollabCard } from "@/components/molecules/cards/collabCard";
import { Banner } from "@/components/organisms/communities/Banner";
import { CommunitiesSearchAndFilter } from "@/components/organisms/communities/CommunitiesSearchAndFilter";
import { useCommunitiesTable } from "@/hooks/useCommunitiesTable";
import { Community } from "@/types/community";

export default function CommunityPage() {
  const {
    filteredCommunities,
    isLoading,
    search,
    setSearch,
    type,
    setType,
    location,
    setLocation,
    allTypes,
    allLocations,
    pageCount,
    pageIndex,
    setPagination,
  } = useCommunitiesTable();

  if (isLoading) return <Loading />;

  return (
    <div className="py-8 flex flex-col gap-10 lg:gap-11 ">
      <Banner />
      <CommunitiesSearchAndFilter
        search={search}
        setSearch={setSearch}
        type={type}
        setType={setType}
        location={location}
        setLocation={setLocation}
        allTypes={allTypes}
        allLocations={allLocations}
      />
      <div className="grid grid-cols-1 @[768px]/layout:grid-cols-2 @[1548px]/layout:grid-cols-3 gap-6 mt-6 w-full">
        {filteredCommunities.length > 0 ? (
          filteredCommunities.map((community: Community) => (
            <CollabCard key={community._id} item={community} />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            No communities found.
          </p>
        )}
      </div>
      {pageCount > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: Math.max(0, pageIndex - 1),
              }))
            }
            disabled={pageIndex === 0}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-2 py-2">
            Page {pageIndex + 1} of {pageCount}
          </span>
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: Math.min(pageCount - 1, pageIndex + 1),
              }))
            }
            disabled={pageIndex >= pageCount - 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
