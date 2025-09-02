"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react"; // unchanged
import WalletConnectDialog from "@/components/organisms/settings/wallet-connect/WalletConnectDialog";
import { WalletDisplay } from "./wallet/WalletDisplay";
import { WalletActions } from "./wallet/WalletActions";
import { EmailVerificationWarning } from "./wallet/EmailVerificationWarning";
import { useWalletV2 } from "@/hooks/auth/useWalletV2";
import { toast } from "sonner";

export function AccountWalletSectionV2() {
  const {
    user,
    walletInfo,
    isWalletConnected,
    isEmailVerified,
    disconnect,
    reloadFromServer,
  } = useWalletV2();

  // Ensure we sync from server on mount so existing wallet_address is reflected
  useEffect(() => {
    reloadFromServer();
  }, [reloadFromServer]);

  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const hasTempEmail = useMemo(() => {
    const email = user?.email || "";
    return !!email && /@wallet\.temp$/i.test(email);
  }, [user?.email]);

  const isEmailValidForWalletOps = isEmailVerified && !hasTempEmail;

  const copyWalletAddress = () => {
    if (walletInfo?.address) {
      navigator.clipboard.writeText(walletInfo.address);
      toast.success("Wallet address copied to clipboard!");
    }
  };

  const handleDisconnect = async () => {
    if (!walletInfo?.address) return;
    setIsDisconnecting(true);
    try {
      await disconnect();
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleConnect = () => {
    setIsConnecting(true);
    setShowAuthDialog(true);
  };

  const handleWalletAuthSuccess = async () => {
    try {
      await reloadFromServer();
    } catch {}
    setIsConnecting(false);
    setShowAuthDialog(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl font-bold">
            <Wallet className="w-5 h-5" />
            Account & Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmailVerificationWarning
            isWalletConnected={isWalletConnected}
            isEmailVerified={isEmailVerified}
          />

          <WalletDisplay
            walletInfo={
              {
                address: user?.wallet_address || walletInfo?.address,
                network: walletInfo?.network,
                connectedWallet: walletInfo?.connectedWallet,
              } as any
            }
            isWalletConnected={!!(user?.wallet_address || walletInfo?.address)}
            onCopyAddress={copyWalletAddress}
          />

          <WalletActions
            isWalletConnected={isWalletConnected}
            isEmailVerified={isEmailVerified || false}
            hasTempEmail={hasTempEmail}
            isEmailValidForWalletOps={isEmailValidForWalletOps}
            isDisconnecting={isDisconnecting}
            isConnecting={isConnecting}
            onDisconnect={handleDisconnect}
            onConnect={handleConnect}
          />
        </CardContent>
      </Card>

      <WalletConnectDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSuccess={handleWalletAuthSuccess}
      />
    </>
  );
}

export default AccountWalletSectionV2;
