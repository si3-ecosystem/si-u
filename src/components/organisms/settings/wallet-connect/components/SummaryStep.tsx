"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { WalletService, WalletType, NetworkType } from "@/services/walletService";

interface Props {
  wallet: WalletType;
  address: string;
  network: NetworkType;
  onBack: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function SummaryStep({ wallet, address, network, onBack, onConfirm, loading }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm text-gray-600">Wallet</div>
        <div className="font-medium">{WalletService.getWalletDisplayName(wallet)}</div>
      </div>
      <div>
        <div className="text-sm text-gray-600">Address</div>
        <div className="font-mono text-gray-800">{WalletService.formatWalletAddress(address)}</div>
      </div>
      <div>
        <div className="text-sm text-gray-600">Network</div>
        <div className="font-medium">{network}</div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button onClick={onConfirm} disabled={loading}>
          {loading ? "Connecting..." : "Connect"}
        </Button>
      </div>
    </div>
  );
}

