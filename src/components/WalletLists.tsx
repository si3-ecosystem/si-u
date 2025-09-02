"use client";

import { WALLET_OPTIONS } from "@/utils/walletConfig";
import React, { useMemo } from "react";
import { WalletOption } from "./WalletOption";

export function WalletLists({ connectors, isConnecting, onConnect }: { connectors: ReadonlyArray<any>; isConnecting: boolean; onConnect: (connector: any) => void; }) {
  const injected = useMemo(() => connectors.filter((c) => c.type === "injected"), [connectors]);
  const nonInjected = useMemo(() => connectors.filter((c) => c.type !== "injected" && c.id !== "safe"), [connectors]);

  const installedRequiredWallets = useMemo(() => WALLET_OPTIONS.map((wallet) => {
    const connector = injected.find((c) => c.name.toLowerCase().includes(wallet.id));
    return { wallet, connector };
  }), [injected]);

  const installedWallets = installedRequiredWallets.filter((i) => i.connector);
  const uninstalledWallets = installedRequiredWallets.filter((i) => !i.connector);
  const filteredInjected = injected.filter((c) => c.id !== "injected" && !WALLET_OPTIONS.some((w) => c.name.toLowerCase().includes(w.id)));

  return (
    <div className="space-y-4">
      {installedWallets.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-500">Recommended wallets</div>
          <div className="grid grid-cols-1 gap-2">
            {installedWallets.map(({connector }) => (
              <WalletOption key={connector.id} connector={connector} onConnect={onConnect} isConnecting={isConnecting} />
            ))}
          </div>
        </div>
      )}

      {filteredInjected.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-500">Other wallets</div>
          <div className="grid grid-cols-1 gap-2">
            {filteredInjected.map((connector) => (
              <WalletOption key={connector.id} connector={connector} onConnect={onConnect} isConnecting={isConnecting} />
            ))}
          </div>
        </div>
      )}

      {nonInjected.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-500">WalletConnect</div>
          <div className="grid grid-cols-1 gap-2">
            {nonInjected.map((connector) => (
              <WalletOption key={connector.id} connector={connector} onConnect={onConnect} isConnecting={isConnecting} />
            ))}
          </div>
        </div>
      )}

      {uninstalledWallets.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-500">Don’t have a wallet?</div>
          <div className="grid grid-cols-1 gap-2">
            {uninstalledWallets.map(({ wallet }) => (
              <WalletOption key={wallet.id} wallet={wallet} onConnect={() => {}} isConnecting={isConnecting} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

