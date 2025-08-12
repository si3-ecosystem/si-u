"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { WalletService, WalletType } from "@/services/walletService";
import { useConnect, useAccount } from "wagmi";

interface Props {
  onSelected: (wallet: WalletType, address: string) => void;
}

export default function WalletProviderList({ onSelected }: Props) {
  const { connectors, connectAsync } = useConnect();
  const providers: { id: WalletType; label: string }[] = [
    { id: "MetaMask", label: "MetaMask" },
    { id: "Zerion", label: "Zerion" },
    { id: "WalletConnect", label: "WalletConnect" },
    { id: "Other", label: "Other" },
  ];

  const handleClick = async (wallet: WalletType) => {
    // Attempt to connect via wagmi connector matching wallet where possible
    try {
      const target = connectors.find((c) => {
        const name = c.name.toLowerCase();
        if (wallet === "MetaMask") return name.includes("meta");
        if (wallet === "Zerion") return name.includes("zerion");
        if (wallet === "WalletConnect") return name.includes("walletconnect");
        return false;
      });

      let address: string | undefined;
      if (target) {
        const res = await connectAsync({ connector: target });
        address = res.accounts?.[0];
      }

      if (!address) {
        // Fallback: request accounts via window.ethereum
        const eth = (window as any).ethereum;
        if (!eth) throw new Error("No wallet provider found");
        const accounts: string[] = await eth.request({ method: "eth_requestAccounts" });
        address = accounts[0];
      }

      if (!address) throw new Error("Failed to obtain wallet address");

      onSelected(wallet, address);
    } catch (e: any) {
      console.error("Wallet provider connect failed", e);
      throw e;
    }
  };

  return (
    <div className="space-y-2">
      {providers.map((p) => (
        <Button key={p.id} className="w-full justify-start" variant="outline" onClick={() => handleClick(p.id)}>
          {p.label}
        </Button>
      ))}
    </div>
  );
}

