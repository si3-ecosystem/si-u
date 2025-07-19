"use client";

import { LogOut } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogContent,
} from "@/components/ui/dialog";

const LogoutButton = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirmDialog(true);
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
        setShowConfirmDialog(false);

        router.refresh();
        router.push("/login");
      } else {
        throw new Error("Logout failed");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setShowConfirmDialog(false);

      router.refresh();
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
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

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogTitle className="sr-only">Confirm Logout</DialogTitle>

        <DialogContent className="mx-auto w-full rounded-lg p-6 py-8 lg:max-w-[400px]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <LogOut className="h-8 w-8 text-red-600" />
          </div>

          <h2 className="mb-2 text-center text-xl font-bold text-gray-900">
            Confirm Logout
          </h2>

          <p className="mx-auto mb-6 text-center text-sm text-gray-600">
            Are you sure you want to logout? You will need to login again to
            access your account.
          </p>

          <DialogFooter className="flex gap-2 justify-center">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleConfirmLogout}
              disabled={isLoading}
            >
              {isLoading ? "Logging out..." : "Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoutButton;
