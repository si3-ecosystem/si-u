"use client";

import { KollabItemCard } from "@/components/molecules/cards/KollabItemCard";

export interface KollabItem {
  title: string;
  description: string;
  imageSrc: string;
  isEvent?: boolean;
}

interface KollabsSectionProps {
  kollabs: KollabItem[];
  className?: string;
}

export function KollabsSection({
  kollabs,
  className = "",
}: KollabsSectionProps) {
  const handleContinue = (title: string) => {
    // Handle continue action
    console.log(`Continue with ${title}`);
  };

  return (
    <div className={`mb-12 ${className}`}>
      <h2 className="text-2xl font-bold mb-6 font-clesmont">YOUR KOLLABS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {kollabs.map((kollab, index) => (
          <KollabItemCard
            key={index}
            title={kollab.title}
            description={kollab.description}
            imageSrc={kollab.imageSrc}
            isEvent={kollab.isEvent}
            onContinue={() => handleContinue(kollab.title)}
          />
        ))}
      </div>
    </div>
  );
}
