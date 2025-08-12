"use client";
import React from "react";
import { WalletService, NetworkType } from "@/services/walletService";

interface Props {
  value: NetworkType;
  onChange: (v: NetworkType) => void;
}

export default function NetworkSelector({ value, onChange }: Props) {
  const networks = WalletService.getSupportedNetworks();
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">Select Network</label>
      <select
        className="w-full rounded border px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value as NetworkType)}
      >
        {networks.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>
  );
}

