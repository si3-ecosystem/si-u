"use client";
import React, { useState } from "react";
import { Tabs } from "@/components/molecules/tabs/guideTabs";
import { HighlightCard } from "@/components/molecules/cards/highlightCard"; // Import the new component

interface Session {
  id: string;
  category: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

interface CategorySessionsProps {
  sessions: Session[];
}

const allSessions = [
  {
    id: "1",
    category: "Funding",
    title: "Si Her Granting Pathways",
    description:
      "We are opening up the new month reflecting on the successes our last month, which kicked off with our last Granting Access virtual event on August 1st.",
    ctaText: "Read Highlights",
    ctaLink: "/guides/ideas-lab/test",
    imageUrl: "/card_placeholder.png",
  },
  {
    id: "2",
    category: "Media & Marketing",
    title: "Granting Access",
    description:
      "We are opening up the new month reflecting on the successes in our last month, which kicked off with our last Granting Access virtual event on August 1st.",
    ctaText: "Download Takeaways",
    ctaLink: "#",
    imageUrl: "/card_placeholder.png",
  },
  {
    id: "3",
    category: "Founders",
    title: "Smart Business Structures",
    description:
      "We are opening up the new month reflecting on the successes in our last month, which kicked off with our last Granting Access virtual event on August 1st.",
    ctaText: "Take Challenge",
    ctaLink: "#",
    imageUrl: "/card_placeholder.png",
  },
  {
    id: "p1",
    category: "Personal Development",
    title: "Personal Growth in Tech",
    description: "Skills for the future in technology.",
    ctaText: "Explore Now",
    ctaLink: "#",
    imageUrl: "/card_placeholder.png",
  },
];

const leadershipSessions = [
  {
    id: "l1",
    category: "Leadership",
    title: "Leadership in Web3",
    description: "Building effective teams in the Web3 space.",
    ctaText: "Learn More",
    ctaLink: "#",
    imageUrl: "/card_placeholder.png",
  },
];

const personalDevSessions = [
  {
    id: "p1",
    category: "Personal Development",
    title: "Personal Growth in Tech",
    description: "Skills for the future in technology.",
    ctaText: "Explore Now",
    ctaLink: "#",
    imageUrl: "/card_placeholder.png",
  },
];

const fundingSessions = [
  {
    id: "f1",
    category: "Funding",
    title: "Si Her Granting Pathways",
    description:
      "We are opening up the new month reflecting on the successes our last month, which kicked off with our last Granting Access virtual event on August 1st.",
    ctaText: "Read Highlights",
    ctaLink: "#",
    imageUrl: "/card_placeholder.png",
  },
];

const mediaMarketingSessions = [
  {
    id: "m1",
    category: "Media & Marketing",
    title: "Granting Access",
    description:
      "We are opening up the new month reflecting on the successes in our last month, which kicked off with our last Granting Access virtual event on August 1st.",
    ctaText: "Download Takeaways",
    ctaLink: "#",
    imageUrl: "/card_placeholder.png",
  },
];

const foundersSessions = [
  {
    id: "fo1",
    category: "Founders",
    title: "Smart Business Structures",
    description:
      "We are opening up the new month reflecting on the successes in our last month, which kicked off with our last Granting Access virtual event on August 1st.",
    ctaText: "Take Challenge",
    ctaLink: "#",
    imageUrl: "/card_placeholder.png",
  },
];

function CategorySessions({ sessions }: CategorySessionsProps) {
  return (
    <div className="flex flex-wrap gap-8">
      {sessions.map((session) => (
        <HighlightCard
          key={session.id}
          category={session.category}
          title={session.title}
          description={session.description}
          ctaText={session.ctaText}
          ctaLink={session.ctaLink}
          imageUrl={session.imageUrl}
        />
      ))}
    </div>
  );
}

export function Highlights() {
  const [activeTab, setActiveTab] = useState("all");

  const renderContent = () => {
    switch (activeTab) {
      case "all":
        return <CategorySessions sessions={allSessions} />;
      case "leadership":
        return <CategorySessions sessions={leadershipSessions} />;
      case "personal_development":
        return <CategorySessions sessions={personalDevSessions} />;
      case "funding":
        return <CategorySessions sessions={fundingSessions} />;
      case "media_marketing":
        return <CategorySessions sessions={mediaMarketingSessions} />;
      case "founders":
        return <CategorySessions sessions={foundersSessions} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-11">
      <h1 className="text-2xl font-medium mb-1">Sessions</h1>
      <p className="text-[#454545] mb-6 leading-[140%]">
        Presentations and workshops from leading organizations.
      </p>

      <Tabs
        tabs={[
          { id: "all", label: "View All" },
          { id: "leadership", label: "Leadership" },
          { id: "personal_development", label: "Personal Development" },
          { id: "funding", label: "Funding" },
          { id: "media_marketing", label: "Media & Marketing" },
          { id: "founders", label: "Founders" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mt-6">{renderContent()}</div>
    </div>
  );
}
