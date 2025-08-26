"use client";

import { useAccount } from "wagmi";
import React, { useState, useEffect, useCallback } from "react";

import { WalletDialog } from "./WalletDialog";

import { Button } from "@/components/ui/button";

interface InjectedWalletProps {
  onWalletConnected?: (address: string, name: string) => void;
}

const WalletIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M21 18V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 10H17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function InjectedWallet({ onWalletConnected }: InjectedWalletProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isConnected, address, connector } = useAccount();

  const handleWalletConnected = useCallback(
    (address: string, name: string) => {
      onWalletConnected?.(address, name);
    },
    [onWalletConnected]
  );

  const handleOpenDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback((open: boolean) => {
    setIsDialogOpen(open);
  }, []);

  const buttonText = "Connect Your Wallet";

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        className="flex w-full cursor-pointer items-center gap-4 rounded-lg border bg-white p-4 py-3 text-gray-900 hover:bg-gray-50"
        variant="outline"
        aria-label={buttonText}
      >
        <div className="flex h-6 w-6 items-center justify-center">
          <WalletIcon />
        </div>
        <span className="text-base font-semibold">{buttonText}</span>
      </Button>

      <WalletDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        onWalletConnected={handleWalletConnected}
      />
    </>
  );
}

export default InjectedWallet;
