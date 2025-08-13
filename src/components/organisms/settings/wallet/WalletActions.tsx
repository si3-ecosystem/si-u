"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";

interface WalletActionsProps {
  isWalletConnected: boolean;
  isEmailVerified: boolean;
  isDisconnecting: boolean;
  isConnecting: boolean;
  onDisconnect: () => void;
  onConnect: () => void;
}

export function WalletActions({
  isWalletConnected,
  isEmailVerified,
  isDisconnecting,
  isConnecting,
  onDisconnect,
  onConnect,
}: WalletActionsProps) {
  return (
    <div className="flex gap-3 flex-wrap mt-6">
      {isWalletConnected ? (
        <Button
          variant="destructive"
          className="bg-red-100 text-red-700 font-medium hover:bg-red-200 hover:text-red-800 rounded-lg w-fit"
          onClick={onDisconnect}
          disabled={isDisconnecting || !isEmailVerified}
        >
          {isDisconnecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Disconnecting...
            </>
          ) : (
            "Disconnect Wallet"
          )}
        </Button>
      ) : (
        <Button
          variant="outline"
          className="border-blue-200 text-blue-700 font-medium hover:bg-blue-50 hover:border-blue-300 rounded-lg w-fit"
          onClick={onConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </>
          )}
        </Button>
      )}
    </div>
  );
}
