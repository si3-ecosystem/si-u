"use client";
import { SeasonSessionCard } from "@/components/molecules/cards/SeasonSessionCard";
import { PreviousSessionCard } from "@/components/molecules/cards/previousSessionCard";
import { Tabs } from "@/components/molecules/tabs/guideTabs";
import { useFixSessions } from "@/hooks/useFixSessions";
import React, { useState } from "react";

export function Sessions() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const { loading, upcoming, previous } = useFixSessions();

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  if (loading) return <div>Loading...</div>;

  const sessionsToShow = activeTab === "upcoming" ? upcoming : previous;

  return (
    <>
      <div className="container mx-auto px-4 py-11">
        <h1 className="text-2xl font-medium mb-1 text-black">Sessions</h1>
        <p className="text-[#454545] mb-6 leading-[140%] ">
          Sessions led by experts in the areas of diversity, inclusion, equity
          and accessibility.
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
          <div className="grid gap-7">
            {sessionsToShow.length === 0 ? (
              <div className="text-gray-400">No sessions found.</div>
            ) : (
              sessionsToShow.map((session) =>
                activeTab === "upcoming" ? (
                  <SeasonSessionCard
                    key={session._id}
                    session={{
                      id: session._id,
                      title: session.title,
                      date: session.date,
                      time: session.time,
                      language: session.language,
                      image:
                        session.fixImage?.asset?.url || "/card_placeholder.png",
                      guide: session.guideName,
                      partner: {
                        name: session.category?.title || "",
                        logo: null,
                      },
                    }}
                    openDropdownId={openDropdownId}
                    toggleDropdown={toggleDropdown}
                    setOpenDropdownId={setOpenDropdownId}
                  />
                ) : (
                  <PreviousSessionCard
                    key={session._id}
                    session={{
                      ...session,
                      description: session.description,
                      date: session.date,
                      title: session.title,
                    }}
                  />
                )
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
