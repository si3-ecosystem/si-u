"use client";

import React from "react";

interface ProfileHeaderProps {
  name: string;
  username: string;
  website?: string;
  className?: string;
}

export function ProfileHeader({
  name,
  username,
  website,
  className = "",
}: ProfileHeaderProps) {
  return (
    <div className={`flex flex-col items-center text-center mb-8 ${className}`}>
      <div className="relative w-24 h-24 mb-4">
        <div className="w-24 h-24 rounded-full bg-purple-500 flex items-center justify-center text-white text-3xl font-bold">
          {name.charAt(0)}
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-1 font-clesmont">{name}</h1>
      <p className="text-gray-500 mb-2 font-roobert">{username}</p>
      {website && (
        <p className="text-sm text-purple-600 font-roobert">{website}</p>
      )}
    </div>
  );
}
