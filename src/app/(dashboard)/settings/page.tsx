"use client";

import React, { useEffect } from "react";
import Settings from "@/components/organisms/settings";
import { useAppSelector } from "@/redux/store";
import { UnifiedAuthService } from "@/services/authService";

export default function SettingsPage() {
  const currentUser = useAppSelector(state => state.user);

  useEffect(() => {
    const refreshUserData = async () => {
      try {
        await UnifiedAuthService.refreshUserData();
      } catch (error) {
        console.log('[SettingsPage] Failed to refresh user data:', error);
      }
    };

    if (currentUser.isLoggedIn) {
      refreshUserData();
    }
  }, [currentUser.isLoggedIn]);

  return (
    <div className="w-full bg-white min-h-[calc(100vh-9rem)]">
      <Settings />
    </div>
  );
}
