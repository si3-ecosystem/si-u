"use client";
import { LogOut } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ConfirmLogoutDialog from "./ConfirmLogoutDialog";
import { useDispatch } from "react-redux";
import { setLogoutModalOpen } from "@/redux/slice/modalSlice";
import { UnifiedAuthService } from "@/services/authService";

const LogoutButton = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogoutClick = () => {
    dispatch(setLogoutModalOpen(true));
  };

  const handleConfirmLogout = async () => {
    try {
      setIsLoading(true);

      console.log("[LogoutButton] Starting logout process...");

      // Use UnifiedAuthService for proper logout
      await UnifiedAuthService.logout();

      dispatch(setLogoutModalOpen(false));

      console.log("[LogoutButton] Logout complete, forcing redirect...");

      // Force immediate redirect with page reload to ensure clean state
      if (typeof window !== "undefined") {
        // Clear any remaining cookies manually as backup
        document.cookie =
          "si3-jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Force redirect with replace to prevent back navigation
        window.location.replace("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(setLogoutModalOpen(false));

      // Force redirect even on error
      if (typeof window !== "undefined") {
        console.log("[LogoutButton] Redirecting to login page (error case)");
        // Clear cookies manually
        document.cookie =
          "si3-jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.replace("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        className="w-full justify-start h-11 text-red-500 !px-2.5"
        onClick={handleLogoutClick}
      >
        <LogOut className="mr-2 h-6 w-6" />
        Logout
      </Button>

      <ConfirmLogoutDialog
        isLoading={isLoading}
        handleConfirmLogout={handleConfirmLogout}
      />
    </>
  );
};

export default LogoutButton;
