"use client";

import React from "react";
import Settings from "@/components/organisms/settings";
import { useCurrentUserV2 } from "@/hooks/auth/useCurrentUserV2";

export default function SettingsPage() {
  const { isLoading } = useCurrentUserV2();

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
