"use client";
import { PreviousSessionCard } from "@/components/molecules/cards/previousSessionCard";
import { SeasonSessionCard } from "@/components/molecules/cards/SeasonSessionCard";
import { Tabs } from "@/components/molecules/tabs/guideTabs";
import React, { useState } from "react";

const sessions = [
  {
    id: "1",
    title: "Impact Tracking & Measurement",
    date: "June 20th, 2025",
    image: "/fixx/Lianna.png",
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

export function Sessions() {
  const [activeTab, setActiveTab] = useState("season1");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

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
            { id: "season1", label: "Season 1 Sessions" },
            { id: "season2", label: "Season 2 Sessions" },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mt-6">
          {activeTab === "season1" ? (
            <div className="grid gap-7">
              {sessions.map((session) => (
                <SeasonSessionCard
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
