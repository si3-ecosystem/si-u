"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export function Tabs({
  tabs,
  activeTab: initialActiveTab,
  onTabChange,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(initialActiveTab || tabs[0].id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="border-b border-gray-200">
      <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide md:overflow-x-visible no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "py-2.5 px-2.5 text-base font-medium relative inline-block",
              activeTab === tab.id
                ? "text-brand"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
