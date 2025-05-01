"use client";
import { PreviousSessionCard } from "@/components/molecules/cards/previousSessionCard";
import { SessionCard } from "@/components/molecules/cards/sessionCard";
import { Tabs } from "@/components/molecules/tabs/guideTabs";
import React, { useState } from "react";

import { useSiherGuidesSessions } from "@/hooks/useSiherGuidesSessions";
import { GuidesSession } from "@/types/siherguides/session";

interface WorkShopsProps {
  guides: GuidesSession[];
}

export default function WorkShops({ guides }: WorkShopsProps) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const { upcomingSessions, previousSessions } = useSiherGuidesSessions(guides);

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <>
      <div className="w-full py-11">
        <h1 className="text-2xl font-medium mb-1 ">Sessions</h1>
        <p className="text-[#454545] mb-6 leading-[140%] ">
          Presentations and workshops from leading organizations.
        </p>

        <Tabs
          tabs={[
            { id: "upcoming", label: "Upcoming Session" },
            { id: "previous", label: "Previous Sessions" },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mt-6">
          {activeTab === "upcoming" ? (
            <div className="grid gap-7">
              {upcomingSessions.length === 0 ? (
                <div>No upcoming sessions.</div>
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
          ) : (
            <div className="flex flex-wrap gap-8">
              {previousSessions.length === 0 ? (
                <div>No previous sessions.</div>
              ) : (
                previousSessions.map((session) => (
                  <PreviousSessionCard key={session._id} session={session} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
