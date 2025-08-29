"use client";
import { LogOut } from "lucide-react";
import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import ConfirmLogoutDialog from "./ConfirmLogoutDialog";
import { useDispatch } from "react-redux";
import { setLogoutModalOpen } from "@/redux/slice/modalSlice";
import { UnifiedAuthService } from "@/services/authService";

const LogoutButton = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleLogoutClick = () => {
    if (isMobile) {
      // Direct logout on mobile
      handleConfirmLogout();
    } else {
      // Show modal on desktop
      dispatch(setLogoutModalOpen(true));
    }
  };

  const handleConfirmLogout = async () => {
    try {
      setIsLoading(true);

      console.log("[LogoutButton] Starting logout process...");

      // Close modal first
      dispatch(setLogoutModalOpen(false));

      // Use UnifiedAuthService for comprehensive logout with redirect
      // The service now handles all cleanup and redirect internally
      await UnifiedAuthService.logout({ redirect: true });

      console.log("[LogoutButton] Logout process initiated successfully");
    } catch (error) {
      console.error("[LogoutButton] Logout error:", error);
      dispatch(setLogoutModalOpen(false));

      // Enhanced error handling - try emergency cleanup
      try {
        console.log("[LogoutButton] Attempting emergency cleanup...");

        // Force clear all storage
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();

          // Clear all cookies
          document.cookie.split(";").forEach((cookie) => {
            const eqPos = cookie.indexOf("=");
            const name =
              eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            if (name) {
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            }
          });
        }

        console.log("[LogoutButton] Emergency cleanup completed");
      } catch (cleanupError) {
        console.error("[LogoutButton] Emergency cleanup failed:", cleanupError);
      }

      // Force redirect even on error as ultimate fallback
      if (typeof window !== "undefined") {
        console.log("[LogoutButton] Force redirecting due to error...");

        // The auth service should have handled cleanup, but ensure redirect happens
        setTimeout(() => {
          window.location.replace("/login");
        }, 500);
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
