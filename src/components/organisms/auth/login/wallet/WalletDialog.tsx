"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useConnect } from "wagmi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWalletLogin } from "@/hooks/useWalletLogin";
import { WalletLists } from "@/components/WalletLists";

export interface WalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWalletConnected?: (address: string, name: string) => void;
}

export function WalletDialog({ open, onOpenChange, onWalletConnected }: WalletDialogProps) {
  const { connectors } = useConnect();
  const { connectAndLogin } = useWalletLogin(() => onOpenChange(false));

  const [isMounted, setIsMounted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string>("");
  console.warn('connectors:', connectionError);

  useEffect(() => setIsMounted(true), []);

  // Clear WalletConnect cached sessions on mount; do not force injected disconnects (Zerion compatibility)
  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;
    try {
      // Clear WalletConnect v2 caches to avoid phantom "already connected" states
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("wc@2:") || key.includes("walletconnect") || key.includes("wagmi")) {
          localStorage.removeItem(key);
        }
      });
      // Also clear sessionStorage for connectors that may store ephemeral state
      sessionStorage.clear();
    } catch {
      // ignore
    }
  }, [isMounted]);

  const handleConnect = useCallback(
    (selectedConnector: any) => {
      connectAndLogin(selectedConnector, {
        onOpenChange,
        onWalletConnected,
        setIsConnecting,
        setConnectionError,
      });
    },
    [connectAndLogin, onOpenChange, onWalletConnected]
  );

  if (!isMounted) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-auto w-full max-w-sm rounded-xl p-6 sm:max-w-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold text-center text-gray-900">
            Connect Wallet
          </DialogTitle>
          <p className="text-sm text-gray-600 text-center">Choose a wallet to continue</p>
        </DialogHeader>

        {/* {connectionError && (
          <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{connectionError}</div>
        )} */}

        <WalletLists connectors={connectors} isConnecting={isConnecting} onConnect={handleConnect} />
      </DialogContent>
    </Dialog>
  );
}
