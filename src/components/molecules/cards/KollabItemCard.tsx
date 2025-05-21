"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export interface KollabItemCardProps {
  title: string;
  description: string;
  imageSrc: string;
  isEvent?: boolean;
  className?: string;
  onContinue?: () => void;
}

export function KollabItemCard({
  title,
  description,
  imageSrc,
  isEvent = false,
  className = "",
  onContinue,
}: KollabItemCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onContinue?.();
  };

  return (
    <div className={`border rounded-lg overflow-hidden bg-white ${className}`}>
      <div className="h-40 relative">
        {isEvent ? (
          <div className="h-40 bg-blue-600 relative text-white p-4">
            <div className="absolute top-2 left-2 bg-green-400 text-black text-xs font-bold py-1 px-2 rounded">
              MAY 14-16, 2025
            </div>
            <div className="absolute top-2 right-2 bg-black text-white text-xs py-1 px-2 rounded flex items-center">
              <span className="mr-1">•</span> Toronto, Canada
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h4 className="text-2xl font-bold font-roobert">
                Crypto&apos;s Most
                <br />
                Influential Event
              </h4>
              <p className="text-sm mt-1 font-roobert">
                The #1 Destination for Dealflow
              </p>
            </div>
          </div>
        ) : (
          <img
            src={imageSrc}
            alt={title}
            className="object-cover h-full w-full"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold mb-1 font-roobert">{title}</h3>
        <p className="text-sm text-gray-500 mb-4 font-roobert">{description}</p>
        <Button
          className="w-full bg-black text-white hover:bg-gray-800 rounded-full mt-4"
          onClick={handleClick}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
