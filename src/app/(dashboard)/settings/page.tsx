"use client";

import React, { useEffect } from "react";
import Settings from "@/components/organisms/settings";
import { useAppSelector } from "@/redux/store";
import { UnifiedAuthService } from "@/services/authService";

export default function SettingsPage() {
  const currentUser = useAppSelector(state => state.user);

  // Refresh user data when settings page loads to get latest verification status
  useEffect(() => {
    const refreshUserData = async () => {
      try {
        await UnifiedAuthService.refreshUserData();
        console.log('[SettingsPage] User data refreshed');
      } catch (error) {
        console.log('[SettingsPage] Failed to refresh user data:', error);
        // Don't clear user state on API failure - user might be offline
      }
    };

    // Only refresh if user is logged in
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
