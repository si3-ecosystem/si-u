"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { RootState } from "@/redux/store";
import { setLogoutModalOpen } from "@/redux/slice/modalSlice";

interface ConfirmLogoutDialogProps {
  isLoading: boolean;
  handleConfirmLogout: () => void;
}

const ConfirmLogoutDialog = ({
  isLoading,
  handleConfirmLogout,
}: ConfirmLogoutDialogProps) => {
  const dispatch = useDispatch();

  const open = useSelector(
    (state: RootState) => state.modals.isLogoutModalOpen
  );

  const setShowConfirmDialog = (show: boolean) => {
    dispatch(setLogoutModalOpen(show));
  };

  const handleCancel = () => {
    dispatch(setLogoutModalOpen(false));
  };

  return (
    <Dialog open={open} onOpenChange={setShowConfirmDialog}>
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
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>

          <Button
            disabled={isLoading}
            variant="destructive"
            onClick={handleConfirmLogout}
          >
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmLogoutDialog;
