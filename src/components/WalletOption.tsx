"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import { getConnectorFallbackIcon, getWalletFallbackIcon, sanitizeImageSrc, WALLET_OPTIONS } from "@/utils/walletConfig";

interface WalletOptionProps {
  connector?: any;
  wallet?: (typeof WALLET_OPTIONS)[number];
  onConnect: (connector?: any) => void;
  isConnecting?: boolean;
}

export function WalletOption({ connector, wallet, onConnect, isConnecting }: WalletOptionProps) {
  const [iconError, setIconError] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (connector) onConnect(connector);
  }, [connector, onConnect]);

  const handleIconError = useCallback(() => setIconError(true), []);

  const iconSrc = useMemo(() => {
    if (connector?.icon && !iconError) return sanitizeImageSrc(connector.icon) || "";
    if (connector) {
      const matchedWallet = WALLET_OPTIONS.find((w) => connector.name.toLowerCase().includes(w.id.toLowerCase()));
      return matchedWallet?.icon || getConnectorFallbackIcon(connector.id);
    }
    return "";
  }, [connector, iconError]);

  if (wallet && !connector) {
    return (
      <Link className={`flex w-full items-center gap-3 hover:bg-pink-50 rounded-lg border p-3 transition-all ${wallet.isPartner ? "border-[#9F44D3]" : "border-gray-200 hover:border-[#9F44D3]"}`} href={wallet.url} target="_blank" rel="noopener noreferrer" aria-label={`Download ${wallet.name}`}>
        <div className="flex h-6 w-6 items-center justify-center">
          {!iconError ? (
            <Image src={wallet.icon} alt="" width={24} height={24} onError={handleIconError} className="rounded" />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center text-lg">{getWalletFallbackIcon(wallet.name)}</div>
          )}
        </div>
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-gray-900">
            {wallet.name}
            {wallet.isPartner && (
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Recommended</span>
            )}
          </div>
          <div className="text-xs text-pink-600">Not installed - Click to download</div>
        </div>
        <div className="text-gray-400">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </Link>
    );
  }

  const displayName = connector?.id === "walletConnect" ? "Continue With WalletConnect" : connector?.name;
  const isPartner = WALLET_OPTIONS.some(w => connector?.name?.toLowerCase().includes(w.id));

  return (
    <button onClick={handleClick} disabled={isConnecting} className={`flex w-full items-center gap-3 hover:bg-pink-50 rounded-lg border p-3 transition-all ${isPartner ? "border-[#9F44D3]" : "border-gray-200 hover:border-[#9F44D3]"} ${isConnecting ? "opacity-50 cursor-not-allowed" : ""}`} aria-label={`Connect with ${displayName}`}>
      <div className="flex h-6 w-6 items-center justify-center">
        {iconSrc ? (
          <Image src={iconSrc} alt="" width={24} height={24} className="rounded" />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center text-lg">{getWalletFallbackIcon(displayName || 'Wallet')}</div>
        )}
      </div>
      <div className="flex-1 text-left">
        <div className="text-sm font-medium text-gray-900">{displayName}</div>
        <div className="text-xs text-gray-500">Continue with your wallet</div>
      </div>
      <div className="text-gray-400">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </button>
  );
}

