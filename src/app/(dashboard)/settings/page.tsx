"use client";

import React, { useEffect, useRef, useState } from "react";
import Settings from "@/components/organisms/settings";
import { useAppSelector } from "@/redux/store";
import { UnifiedAuthService } from "@/services/authService";

export default function SettingsPage() {
  const currentUser = useAppSelector((state) => state.user);
  const hasInitializedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

    const refreshUserData = async () => {
      try {
        await UnifiedAuthService.forceRefreshUserData();

        hasInitializedRef.current = true;
        setIsLoading(false);
      } catch (error) {
        console.log("[SettingsPage] Error during data refresh:", error);
        hasInitializedRef.current = true;
        setIsLoading(false);
      }
    };

    if (currentUser.isLoggedIn) {
      refreshUserData();
    } else {
      hasInitializedRef.current = true;
      setIsLoading(false);
    }
  }, []);

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
