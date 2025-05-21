"use client";

import React from "react";
import { KollaboardCard } from "@/components/molecules/cards/KollaboardCard";

export interface KollaboardItem {
  title: string;
  organization: string;
  buttonText: string;
  buttonVariant?: "primary" | "outline";
  imageSrc?: string;
}

interface SuggestedKollaboardsProps {
  kollaboards: KollaboardItem[];
  className?: string;
}

export function SuggestedKollaboards({
  kollaboards,
  className = "",
}: SuggestedKollaboardsProps) {
  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-6 font-clesmont">
        SUGGESTED KOLLABOARDS
      </h2>
      <div className="space-y-4">
        {kollaboards.map((kollaboard, index) => (
          <KollaboardCard
            key={index}
            title={kollaboard.title}
            organization={kollaboard.organization}
            buttonText={kollaboard.buttonText}
            buttonVariant={kollaboard.buttonVariant}
            imageSrc={kollaboard.imageSrc || `/frame${11 + index}.png`}
          />
        ))}
      </div>
    </div>
  );
}
