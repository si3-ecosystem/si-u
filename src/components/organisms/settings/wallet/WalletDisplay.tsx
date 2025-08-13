"use client";

import React from "react";
import { Copy } from "lucide-react";
import { WalletService, WalletInfo } from "@/services/walletService";

interface WalletDisplayProps {
  walletInfo: WalletInfo | null;
  isWalletConnected: boolean;
  onCopyAddress: () => void;
}

export function WalletDisplay({ 
  walletInfo, 
  isWalletConnected, 
  onCopyAddress 
}: WalletDisplayProps) {
  const networkInfo = walletInfo?.network
    ? WalletService.getNetworkInfo(walletInfo.network)
    : null;

  return (
    <div className="space-y-3 border border-gray-200 rounded-lg p-4">
      {/* Wallet Address */}
      <div className="flex flex-wrap gap-3 justify-between border-b pb-3">
        <label className="text-sm font-medium text-gray-700">
          Wallet Address
        </label>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">
                {isWalletConnected ? (
                  <>
                    eth:{" "}
                    <span className="text-gray-500 font-mono">
                      {WalletService.formatWalletAddress(
                        walletInfo!.address!
                      )}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">No wallet connected</span>
                )}
              </p>
              {isWalletConnected && (
                <button
                  onClick={onCopyAddress}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="Copy wallet address"
                >
                  <Copy className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Connected Wallet */}
      <div className="flex flex-wrap gap-3 justify-between border-b pb-3">
        <label className="text-sm font-medium text-gray-700">
          Connected Wallet
        </label>
        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {isWalletConnected
                ? WalletService.getWalletDisplayName(
                    walletInfo!.connectedWallet!
                  )
                : "No wallet connected"}
            </p>
          </div>
        </div>
      </div>

      {/* Network */}
      <div className="flex flex-wrap gap-3 justify-between pb-4">
        <label className="text-sm font-medium text-gray-700">Network</label>
        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {networkInfo?.name || walletInfo?.network || "Unknown"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
