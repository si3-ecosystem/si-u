"use client";
import React from "react";
import { Tabs } from "@/components/molecules/tabs/guideTabs";
import { HighlightCard } from "@/components/molecules/cards/highlightCard";
import { urlForImage } from "@/lib/sanity/image";

interface HighlightsProps {
  title: string;
  description: string;
  categories: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pageRows: any[];
  pageCount: number;
  pageIndex: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  previousPage: () => void;
  nextPage: () => void;
}

function CategorySessions({ sessions }: { sessions: any[] }) {
  console.log("sessions", sessions);
  return (
    <div className="flex flex-wrap gap-8">
      {sessions.map((session) => (
        <HighlightCard
          key={session._id}
          category={session.category?.title || ""}
          title={session.title}
          description={session.description}
          ctaText="Read More"
          ctaLink={`/scholars/ideas-lab/${session._id}`}
          imageUrl={
            urlForImage(session.ideaLabImage)?.src || "/card_placeholder.png"
          }
        />
      ))}
    </div>
  );
}

export function Highlights({
  title,
  description,
  categories,
  activeTab,
  setActiveTab,
  pageRows,
  pageCount,
  pageIndex,
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
}: HighlightsProps) {
  return (
    <div className="w-full py-11">
      <h1 className="text-2xl font-medium mb-1">{title}</h1>
      <p className="text-[#454545] mb-6 leading-[140%]">{description}</p>
      <Tabs
        tabs={categories.map((cat) => ({ id: cat, label: cat }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="mt-6">
        <CategorySessions
          sessions={pageRows.map((row) => row.original || row)}
        />
      </div>
      {pageCount > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={previousPage}
            disabled={!canPreviousPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4">
            Page {pageIndex + 1} of {pageCount}
          </span>
          <button
            onClick={nextPage}
            disabled={!canNextPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
