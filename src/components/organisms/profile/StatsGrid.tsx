"use client";

import React from "react";

interface StatItem {
  label: string;
  value: number | string;
}

interface StatsGridProps {
  stats: StatItem[];
  className?: string;
}

export function StatsGrid({ stats, className = "" }: StatsGridProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8 ${className}`}
    >
      {stats.map((stat, index) => (
        <div key={index} className="border rounded-lg p-6 text-center bg-white">
          <h3 className="text-sm text-gray-500 mb-2 font-roobert">
            {stat.label}
          </h3>
          <p className="text-3xl font-bold font-roobert">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
