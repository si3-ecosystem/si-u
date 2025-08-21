"use client";

import React from "react";
// import { Button } from "@/components/ui/button";
import { ProfileEditForm } from "@/components/organisms/profile/ProfileEditForm";
import { AccountWalletSection } from "./AccountWalletSection";
import { SupportSection } from "./SupportSection";
import { NotificationSection } from "./NotificationSection";
import { ProfileImageSection } from "./ProfileImageSection";
// import { LogOut } from "lucide-react";

export default function Settings() {
  // const handleLogout = () => {
  //   console.log("Logout clicked");
  // };

  const handleDisconnectWallet = () => {
    console.log("Wallet disconnected");
  };

  const handleConnectWallet = () => {
    console.log("Wallet connected");
  };

  const handleImageUpdate = (imageUrl: string, userData: any) => {
    console.log("Profile image updated:", { imageUrl, userData });
  };

  const handleImageError = (error: string) => {
    console.error("Profile image error:", error);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your wallet, preference, and connected accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 overflow-hidden">
          <div className=" space-y-6">
            <ProfileImageSection
              onImageUpdate={handleImageUpdate}
              onError={handleImageError}
            />
            <AccountWalletSection
              onDisconnectWallet={handleDisconnectWallet}
              onConnectWallet={handleConnectWallet}
            />
            <SupportSection />

            {/* <Button
              variant="destructive"
              className=" bg-red-100 text-red-700 font-medium hover:bg-red-200 hover:text-red-800 rounded-lg w-fit"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button> */}
          </div>
          <div className=" space-y-6">
            <NotificationSection />
            <ProfileEditForm />

          </div>
        </div>
      </div>
    </div>
  );
}
