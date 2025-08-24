"use client";

import { Tabs } from "@/components/molecules/tabs/guideTabs";
import React, { useState } from "react";

import { useSiherGuidesSessions } from "@/hooks/useSiherGuidesSessions";
import { SiherGuidesSession } from "@/types/siherguides/session";
import { PreviousGuidesSessionCard } from "@/components/molecules/cards/PreviousGuidesSession";
import { SessionCard } from "@/components/molecules/cards/sessionCard";
import { RSVPErrorBoundary } from "@/components/molecules/errors/RSVPErrorBoundary";

interface WorkShopsProps {
  data: SiherGuidesSession;
}

export default function WorkShops({ data }: WorkShopsProps) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const { upcomingSessions, previousSessions } = useSiherGuidesSessions(data.guides);


  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <>
      <div className="w-full py-11">
        <h1 className="text-2xl font-medium mb-1 ">{data?.title}</h1>
        <p className="text-[#454545] mb-6 leading-[140%] ">
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
                {upcomingSessions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No upcoming sessions.
                  </div>
                ) : (
                  upcomingSessions.map((session) => (
                    <SessionCard
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
              {previousSessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 w-full">No previous sessions.</div>
              ) : (
                previousSessions.map((session) => (
                  <PreviousGuidesSessionCard
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
