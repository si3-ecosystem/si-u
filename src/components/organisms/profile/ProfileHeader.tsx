"use client";

import React from "react";

interface ProfileHeaderProps {
  name: string;
  username: string;
  website?: string;
  className?: string;
  onEditProfile?: () => void;
  onShare?: () => void;
}

export function ProfileHeader({
  name,
  username,
  website,
  className = "",
  onEditProfile = () => {},
  onShare = () => {},
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
        <p className="text-sm text-purple-600 font-roobert mb-4">{website}</p>
      )}

      <div className="flex gap-4 mt-2 w-full max-w-xs">
        <button
          onClick={onEditProfile}
          className="flex-1 py-2 px-4 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Edit Profile
        </button>
        <button
          onClick={onShare}
          className="flex-1 py-2 px-4 bg-purple-500 text-white rounded-md text-sm font-medium hover:bg-purple-600 transition-colors"
        >
          Share
        </button>
      </div>
    </div>
  );
}
