"use client";

import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";

import { config } from "@/config/wagmiConfig";

interface WalletProviderProps {
  children: ReactNode;
}

const WalletProvider = ({ children }: WalletProviderProps) => {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
};

export default WalletProvider;
