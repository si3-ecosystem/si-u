"use client";

import { Tabs } from "@/components/molecules/tabs/guideTabs";
import React, { useState } from "react";

import { useSiherGuidesSessions } from "@/hooks/useSiherGuidesSessions";
import { GuidesSession } from "@/types/siherguides/session";
import { PreviousGuidesSessionCard } from "@/components/molecules/cards/PreviousGuidesSession";
import { RSVPCard } from "@/components/molecules/rsvp/RSVPCard";
import { SessionWithRSVP } from "@/types/rsvp";

interface WorkShopsProps {
  guides: GuidesSession[];
}

// Helper function to convert GuidesSession to SessionWithRSVP
const convertToSessionWithRSVP = (session: GuidesSession): SessionWithRSVP => ({
  id: session._id,
  title: session.title || '',
  description: session.description || '',
  startTime: session.date ? new Date(session.date).toISOString() : new Date().toISOString(),
  endTime: session.date ? new Date(session.date).toISOString() : new Date().toISOString(), // Assuming same date for now
  location: (session as any).location || 'Online',
  maxAttendees: undefined,
  currentAttendees: 0,
  userRSVP: undefined,
  rsvpCounts: {
    attending: 0,
    not_attending: 0,
    maybe: 0,
  },
});

export default function WorkShops({ guides }: WorkShopsProps) {
  const [activeTab, setActiveTab] = useState("upcoming");

  const { upcomingSessions, previousSessions } = useSiherGuidesSessions(guides);



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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingSessions.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No upcoming sessions.
                </div>
              ) : (
                upcomingSessions.map((session) => (
                  <RSVPCard
                    key={session._id}
                    session={convertToSessionWithRSVP(session)}
                    showDetails={true}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-6">
              {previousSessions.length === 0 ? (
                <div>No previous sessions.</div>
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
