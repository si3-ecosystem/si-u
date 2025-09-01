"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDisconnect, useSignMessage, useAccount } from "wagmi";
import { WalletService, WalletInfo, WalletType, NetworkType } from "@/services/walletService";
import { UnifiedAuthService } from "@/services/authService";

import WalletProviderList from "./components/WalletProviderList";
import NetworkSelector from "./components/NetworkSelector";
import SummaryStep from "./components/SummaryStep";

interface WalletConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function WalletConnectDialog({ open, onOpenChange, onSuccess }: WalletConnectDialogProps) {
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>("Mainnet");
  const [address, setAddress] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "summary" | "signing" | "done">("select");
  const [loading, setLoading] = useState(false);
  const { disconnect } = useDisconnect();
  const { address: wagmiAddress, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const handleProviderSelected = async (wallet: WalletType, addr: string) => {
    try {
      setSelectedWallet(wallet);
      setAddress(addr);
      setStep("summary");
    } catch (e) {
      console.error("Provider selection failed", e);
      toast.error("Failed to select wallet provider");
    }
  };

  const handleConnect = async () => {
    if (!selectedWallet || !address) return;
    setLoading(true);

    console.log('[WalletConnectDialog] Starting wallet connection process:', {
      wallet: selectedWallet,
      address,
      network: selectedNetwork
    });

    try {
      // 1) Request signature message for this address
      const messageResp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/wallet/request-signature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_address: address }),
        credentials: "include",
      });
      const messageJson = await messageResp.json();
      if (messageJson.status !== "success") throw new Error(messageJson.message || "Failed to get signature message");

      const message = messageJson.data?.message as string;
      if (!message) throw new Error("No signature message returned");

      // 2) Ask wallet to sign
      const signature = await signMessageAsync({ message });

      // 3) POST connect for existing user
      const connectResp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/wallet/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("si3-jwt") || ""}`,
        },
        body: JSON.stringify({
          wallet_address: address,
          signature,
          connectedWallet: selectedWallet,
          network: selectedNetwork,
        }),
        credentials: "include",
      });
      const connectJson = await connectResp.json();
      if (connectJson.status !== "success") throw new Error(connectJson.message || "Failed to connect wallet");

      console.log('[WalletConnectDialog] Wallet connect response:', connectJson);

      // 4) Handle wallet connection response
      if (connectJson.data?.token && connectJson.data?.user) {
        // If response includes new token and user data, apply auth update
        console.log('[WalletConnectDialog] Applying auth update with new token');
        UnifiedAuthService.applyAuthUpdate({
          user: connectJson.data.user,
          token: connectJson.data.token
        });

        // Verify the auth update was successful
        await new Promise(resolve => setTimeout(resolve, 500));
        const authState = UnifiedAuthService.getAuthState();
        console.log('[WalletConnectDialog] Auth state after update:', {
          isAuthenticated: authState.isAuthenticated,
          hasUser: !!authState.user,
          hasToken: !!authState.token
        });
      } else {
        // If no token in response, just refresh the current user data
        console.log('[WalletConnectDialog] No token in response, refreshing auth state');
        const refreshSuccess = await UnifiedAuthService.forceRefreshAuth();
        console.log('[WalletConnectDialog] Auth refresh result:', refreshSuccess);
      }

      console.log('[WalletConnectDialog] Wallet connection successful');
      toast.success("Wallet connected successfully");
      setStep("done");
      onSuccess?.();
      onOpenChange(false);
    } catch (e: any) {
      console.error('[WalletConnectDialog] Wallet connect failed:', e);
      console.error('[WalletConnectDialog] Error details:', {
        message: e?.message,
        stack: e?.stack,
        response: e?.response
      });
      toast.error(e?.message || "Wallet connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // If wagmi was auto-connected, let user decide next time; do not force disconnect here
    onOpenChange(false);
    // reset state
    setSelectedWallet(null);
    setAddress(null);
    setStep("select");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
        </DialogHeader>

        {step === "select" && (
          <div className="space-y-4">
            <WalletProviderList onSelected={handleProviderSelected} />
            <NetworkSelector value={selectedNetwork} onChange={setSelectedNetwork} />
          </div>
        )}

        {step === "summary" && (
          <SummaryStep
            wallet={selectedWallet!}
            address={address!}
            network={selectedNetwork}
            onBack={() => setStep("select")}
            onConfirm={handleConnect}
            loading={loading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

