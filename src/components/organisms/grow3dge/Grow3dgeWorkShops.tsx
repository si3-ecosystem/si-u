"use client";

import { Tabs } from "@/components/molecules/tabs/guideTabs";
import React, { useState } from "react";
import { useGrow3dgeFixSessions } from "@/hooks/useGrow3dgeFixSessions";
import { Grow3dgeSession } from "@/types/siherguides/session";
import { PreviousGrow3dgeSessionCard } from "@/components/molecules/cards/PreviousGrow3dgeSessionCard";
import { Grow3dgeSessionCard } from "@/components/molecules/cards/Grow3dgeSessionCard";
import { RSVPErrorBoundary } from "@/components/molecules/errors/RSVPErrorBoundary";

interface Grow3dgeWorkShopsProps {
  data: Grow3dgeSession;
  selectedCategory?: string;
}

export default function Grow3dgeWorkShops({ 
  data, 
  selectedCategory
}: Grow3dgeWorkShopsProps) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Use filtered sessions if available, otherwise use all sessions
  const { upcomingSessions, previousSessions } = useGrow3dgeFixSessions(data.fixCards);

  // Apply category filter if selected
  const filteredUpcoming = selectedCategory && selectedCategory !== "all" && selectedCategory !== "" 
    ? upcomingSessions.filter(session => 
        session.category?.slug?.current?.toLowerCase() === selectedCategory.toLowerCase()
      )
    : upcomingSessions;
    
  const filteredPrevious = selectedCategory && selectedCategory !== "all" && selectedCategory !== "" 
    ? previousSessions.filter(session => 
        session.category?.slug?.current?.toLowerCase() === selectedCategory.toLowerCase()
      )
    : previousSessions;

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <>
      <div className="w-full py-11">
        <h1 className="text-2xl font-medium mb-1">{data?.title}</h1>
        <p className="text-[#454545] mb-6 leading-[140%]">
          {data?.description}
        </p>

        <Tabs
          tabs={[
            { id: "upcoming", label: "Upcoming Sessions" },
            { id: "previous", label: "Previous Sessions" },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mt-6">
          {activeTab === "upcoming" ? (
            <RSVPErrorBoundary>
              <div className="space-y-6">
                {filteredUpcoming.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {selectedCategory && selectedCategory !== "all" && selectedCategory !== "" 
                      ? `No upcoming sessions found for the selected category.`
                      : "No upcoming sessions."
                    }
                  </div>
                ) : (
                  filteredUpcoming.map((session) => (
                    <Grow3dgeSessionCard
                      key={session._id}
                      session={session}
                      openDropdownId={openDropdownId}
                      toggleDropdown={toggleDropdown}
                      setOpenDropdownId={setOpenDropdownId}
                    />
                  ))
                )}
              </div>
            </RSVPErrorBoundary>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredPrevious.length === 0 ? (
                <div className="text-center py-8 text-gray-500 w-full">
                  {selectedCategory && selectedCategory !== "all" && selectedCategory !== "" 
                    ? `No previous sessions found for the selected category.`
                    : "No previous sessions."
                  }
                </div>
              ) : (
                filteredPrevious.map((session) => (
                  <PreviousGrow3dgeSessionCard
                    key={session._id}
                    session={session}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}