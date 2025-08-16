"use client";

import React, { useEffect, useRef, useState } from "react";
import Settings from "@/components/organisms/settings";
import { useAppSelector } from "@/redux/store";
import { UnifiedAuthService } from "@/services/authService";

export default function SettingsPage() {
  const currentUser = useAppSelector(state => state.user);
  const hasInitializedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run once when component mounts
    if (hasInitializedRef.current) {
      console.log('[SettingsPage] Already initialized, skipping refresh...');
      return;
    }

    const refreshUserData = async () => {
      try {
        console.log('[SettingsPage] One-time user data refresh on settings page load...');

        // Simple refresh without clearing state - just ensure we have fresh data
        await UnifiedAuthService.forceRefreshUserData();
        console.log('[SettingsPage] User data refreshed successfully');

        hasInitializedRef.current = true;
        setIsLoading(false);
      } catch (error) {
        console.log('[SettingsPage] Error during data refresh:', error);
        hasInitializedRef.current = true; // Still mark as initialized to prevent loops
        setIsLoading(false);
      }
    };

    // Only refresh if user is logged in
    if (currentUser.isLoggedIn) {
      refreshUserData();
    } else {
      hasInitializedRef.current = true; // Mark as initialized even if not logged in
      setIsLoading(false);
    }
  }, []); // Empty dependency array - only run once on mount

  if (isLoading) {
    return (
      <div className="w-full bg-white min-h-[calc(100vh-9rem)] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-[calc(100vh-9rem)]">
      <Settings />
    </div>
  );
}
