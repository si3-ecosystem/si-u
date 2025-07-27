"use client";

import { LogOut } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import ConfirmLogoutDialog from "./ConfirmLogoutDialog";

import { useDispatch } from "react-redux";
import { setLogoutModalOpen } from "@/redux/slice/modalSlice";

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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        dispatch(setLogoutModalOpen(false));

        router.refresh();
        router.push("/login");
      } else {
        throw new Error("Logout failed");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch(setLogoutModalOpen(false));

      router.refresh();
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
