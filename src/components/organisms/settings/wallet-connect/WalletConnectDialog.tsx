"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSignMessage } from "wagmi";
import { WalletType, NetworkType } from "@/services/walletService";
import { authApiV2 } from "@/services/authV2";
// UnifiedAuthService removed in V2 flow

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
      // 1) Request signature message (server provides nonce)
      // Request signature message via authV2 API wrapper
      const nonceRes = await authApiV2.wallet.requestSignature(address);
      const message = (nonceRes as any).data?.message || (nonceRes as any).data?.data?.message;
      if (!message) throw new Error('Failed to get signature message from server');

      // 2) Ask wallet to sign
      const signature = await signMessageAsync({ message });

      // 3) Connect wallet to EXISTING user (protected route). Do NOT use verify-signature here.
      // Connect with signature via authV2 API wrapper
      const connectRes = await authApiV2.wallet.connectWithSignature({ address, signature, connectedWallet: selectedWallet, network: selectedNetwork });
      const ok = (connectRes as any).status === 'success';
      if (!ok) {
        throw new Error((connectRes as any)?.error?.message || 'Failed to connect wallet');
      }
      // 4) No logout; refresh user/wallet state via onSuccess hook


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
            <div className="text-brand text-xl font-semibold text-center">
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

