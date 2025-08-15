"use client";

import { LogOut } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import ConfirmLogoutDialog from "./ConfirmLogoutDialog";

import { useDispatch } from "react-redux";
import { setLogoutModalOpen } from "@/redux/slice/modalSlice";
import { UnifiedAuthService } from "@/services/authService";

const LogoutButton = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogoutClick = () => {
    dispatch(setLogoutModalOpen(true));
  };

  const handleConfirmLogout = async () => {
    try {
      setIsLoading(true);

      // Use UnifiedAuthService for proper logout
      await UnifiedAuthService.logout();

      dispatch(setLogoutModalOpen(false));
      router.push("/login");

    } catch (error) {
      console.error('Logout error:', error);
      dispatch(setLogoutModalOpen(false));
      router.push("/login");
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
