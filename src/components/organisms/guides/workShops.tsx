"use client";
import { PreviousSessionCard } from "@/components/molecules/cards/previousSessionCard";
import { SessionCard } from "@/components/molecules/cards/sessionCard";
import { Tabs } from "@/components/molecules/tabs/guideTabs";
import React, { useState } from "react";

const sessions = [
  {
    id: "1",
    title: "Web3 Natives: Tokens Unlocked",
    date: "June 20th, 2025",
    time: "8:30 - 9:30 PM (UTC +4)",
    guide: "Ali Mastova",
    language: "English",
    partner: {
      name: "UNISWAP",
      logo: "/uniswap.png",
    },
  },
  {
    id: "2",
    title: "Si Her DeFi",
    date: "June 22, 2025",
    time: "8:30 - 9:30 PM (UTC +4)",
    guide: "Ngozi Owanda",
    language: "Spanish",
    partner: {
      name: "Coinbase",
      logo: "/uniswap.png",
    },
  },
];

const prevSessionsData = [
  {
    id: "1",
    title: "How to Build A Successful Team with Elena",
    description: "karalevythal X Elena",
    date: "Co-Founder & DC, Metis",
    featured: true,
  },
  {
    id: "2",
    title: "How to Build A Successful Team with Elena",
    description: "karalevythal X Elena",
    date: "Co-Founder & DC, Metis",
    featured: false,
  },
  {
    id: "3",
    title: "How to Build A Successful Team with Elena",
    description: "karalevythal X Elena",
    date: "Co-Founder & DC, Metis",
    featured: false,
  },
];

export default function WorkShops() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-11">
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
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  openDropdownId={openDropdownId}
                  toggleDropdown={toggleDropdown}
                  setOpenDropdownId={setOpenDropdownId}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-8">
              {prevSessionsData.map((session) => (
                <PreviousSessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
