/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";
import { PreviousSessionCard } from "@/components/molecules/cards/previousSessionCard";
import React from "react";

interface SessionCard {
  _id: string;
  title?: string;
  description?: string;
  date?: string;
  pdfFile?: string;
  banner?: string;
  sessionTitle?: string;
  sessionDescription?: string;
  category?: {
    _id: string;
    title: string;
    slug: {
      current: string;
    };
  };
}

interface FilteredSessionsProps {
  title?: string;
  description?: string;
  sessions: SessionCard[];
  selectedCategory: string;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  pageIndex: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  previousPage: () => void;
  nextPage: () => void;
  gotoPage: (page: number) => void;
}

export function FilteredSessions({
  title,
  description,
  sessions,
  selectedCategory,
  globalFilter,
  setGlobalFilter,
  pageIndex,
  pageCount,
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
  gotoPage,
}: FilteredSessionsProps) {
  return (
    <div className="w-full py-11">
      <div className="flex items-center justify-between w-full mb-8">
        <div>
          <h2 className="text-black text-xl lg:text-2xl font-medium mb-2">
            {title || "Sessions"}
          </h2>
          <p className="text-brandGray text-base leading-[140%] font-normal mb-4">
            {description || "Explore our collection of sessions"}
          </p>
        </div>
        
        {/* Search Filter */}
        {/* <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search sessions..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
            {globalFilter && (
              <button
                onClick={() => setGlobalFilter("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div> */}
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-1 @[768px]/layout:grid-cols-2 @[1548px]/layout:grid-cols-3 gap-6">
          {sessions.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-lg">
                {selectedCategory !== "all" || globalFilter
                  ? "No sessions found matching your criteria."
                  : "No sessions found."}
              </div>
              {(selectedCategory !== "all" || globalFilter) && (
                <button
                  onClick={() => {
                    setGlobalFilter("");
                    window.location.reload(); // Reset category filter
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            sessions.map((session: SessionCard) => (
              <PreviousSessionCard
                key={session._id}
                session={{
                  pdfFile: session.pdfFile,
                  ...session,
                  description:
                    session.sessionDescription || session.description || "",
                  date: session.date || "",
                  title: session.title || "",
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={previousPage}
            disabled={!canPreviousPage}
            className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
              const pageNumber = i + 1;
              const isActive = pageIndex + 1 === pageNumber;
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => gotoPage(pageNumber - 1)}
                  className={`px-3 py-2 border rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-500 text-white border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={nextPage}
            disabled={!canNextPage}
            className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      
    </div>
  );
}
