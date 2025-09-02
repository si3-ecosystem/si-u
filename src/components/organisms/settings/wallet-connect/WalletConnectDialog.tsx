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
      // 1) Request signature message using the auth service (server provides nonce)
      const messageResponse = await UnifiedAuthService.requestWalletSignature(address);
      if (!messageResponse?.data?.message) {
        throw new Error("Failed to get signature message from server");
      }
      const message = messageResponse.data.message;

      // 2) Ask wallet to sign
      const signature = await signMessageAsync({ message });

      // 3) Connect wallet to EXISTING user (protected route). Do NOT use verify-signature here.
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
      if (connectJson.status !== 'success') {
        throw new Error(connectJson.message || 'Failed to connect wallet');
      }

      // 4) Apply auth update from returned token/user
      if (connectJson?.data?.token && connectJson?.data?.user) {
        console.log('[WalletConnectDialog] Applying auth update with new token');
        
        // Apply the auth update
        UnifiedAuthService.applyAuthUpdate({
          user: connectJson.data.user,
          token: connectJson.data.token,
        });
        
        // Wait a bit for token storage to complete
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Verify the auth update was successful
        const authState = UnifiedAuthService.getAuthState();
        console.log('[WalletConnectDialog] Auth state after update:', {
          isAuthenticated: authState.isAuthenticated,
          hasUser: !!authState.user,
          hasToken: !!authState.token,
          tokenStored: !!localStorage.getItem('si3-jwt')
        });
        
        // Double-check that we're properly authenticated
        if (!authState.isAuthenticated || !authState.token) {
          console.warn('[WalletConnectDialog] Auth state not properly updated, forcing refresh');
          await UnifiedAuthService.forceRefreshAuth();
        }
      } else {
        // Fallback: refresh auth if payload shape differs
        console.log('[WalletConnectDialog] No token/user in response, refreshing auth state');
        await UnifiedAuthService.forceRefreshAuth();
      }

      console.log('[WalletConnectDialog] Wallet connection successful');
      toast.success("Wallet connected successfully");
      setStep("done");

      // Notify parent and close dialog shortly after
      onSuccess?.();
      setTimeout(() => {
        onOpenChange(false);
        setSelectedWallet(null);
        setAddress(null);
        setStep("select");
      }, 800);
    } catch (e: any) {
      console.error('[WalletConnectDialog] Wallet connect failed:', e);
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

        {step === "done" && (
          <div className="text-center space-y-4">
            <div className="text-green-600 font-semibold">
              ✓ Wallet connected successfully!
            </div>
            <p className="text-sm text-gray-600">
              Your wallet has been connected and your account has been updated.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

