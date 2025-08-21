"use client";

import React from "react";
import Image from "next/image";
import { getProfileImageUrl, getUserInitials } from "@/utils/profileImageUtils";
import { useAppSelector } from "@/redux/store";

interface ProfileHeaderProps {
  username: string;
  website?: string;
  email?: string;
  className?: string;
  onEditProfile?: () => void;
  onShare?: () => void;
}

export function ProfileHeader({
  username,
  website,
  className = "",
  email,
  onEditProfile = () => {},
  onShare = () => {},
}: ProfileHeaderProps) {
  const currentUser = useAppSelector(state => state.user.user);
  const profileImageUrl = getProfileImageUrl(currentUser);
  const userInitials = getUserInitials(currentUser);

  return (
    <div className={`flex flex-col items-center text-center mb-8 ${className}`}>
      <div className="relative w-24 h-24 mb-4">
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt={username}
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover border-2 border-purple-500"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-purple-500 flex items-center justify-center text-white text-3xl font-bold">
            {userInitials}
          </div>
        )}
      </div>
      <h1 className="text-2xl font-bold mb-1 font-clesmont">{username}</h1>
      <p className="text-gray-500 mb-2 font-roobert">{email}</p>
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
