"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";

interface WalletActionsProps {
  isWalletConnected: boolean;
  isEmailVerified: boolean;
  hasTempEmail?: boolean;
  isEmailValidForWalletOps?: boolean;
  isDisconnecting: boolean;
  isConnecting: boolean;
  onDisconnect: () => void;
  onConnect: () => void;
}

export function WalletActions({
  isWalletConnected,
  isEmailVerified,
  hasTempEmail = false,
  isEmailValidForWalletOps = false,
  isDisconnecting,
  isConnecting,
  onDisconnect,
  onConnect,
}: WalletActionsProps) {
  // Don't show any wallet actions if email is not verified
  if (!isEmailVerified) {
    return null;
  }

  return (
    <div className="flex gap-3 flex-wrap mt-6">
      {isWalletConnected ? (
        // Only show disconnect button if email is valid for wallet operations (not temp email)
        isEmailValidForWalletOps ? (
          <Button
            variant="destructive"
            className="bg-red-100 text-red-700 font-medium hover:bg-red-200 hover:text-red-800 rounded-lg w-fit"
            onClick={onDisconnect}
            disabled={isDisconnecting}
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
        ) : hasTempEmail ? (
          // Show message for temp email users
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
            <p className="font-medium">Temporary Email Detected</p>
            <p>Please update to a permanent email address to disconnect your wallet.</p>
          </div>
        ) : null
      ) : (
        // Always show connect button if email is verified (even for temp emails)
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
