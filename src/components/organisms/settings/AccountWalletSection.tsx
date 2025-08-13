"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wallet } from "lucide-react";
import WalletConnectDialog from "@/components/organisms/settings/wallet-connect/WalletConnectDialog";

// Import our new components and hooks
import { useWalletManagement } from "@/hooks/useWalletManagement";
import { WalletDisplay } from "./wallet/WalletDisplay";
import { WalletActions } from "./wallet/WalletActions";
import { EmailVerificationWarning } from "./wallet/EmailVerificationWarning";

// Remove prop dependencies - component is now self-contained
interface AccountWalletSectionProps {
  // Optional callbacks for parent components that want to listen to events
  onDisconnectWallet?: () => void;
  onConnectWallet?: () => void;
}

export function AccountWalletSection({
  onDisconnectWallet,
  onConnectWallet,
}: AccountWalletSectionProps) {
  // Use our custom hook for all wallet management logic
  const {
    walletInfo,
    isLoading,
    isDisconnecting,
    isConnecting,
    isWalletConnected,
    isEmailVerified,
    disconnectWallet,
    connectWallet,
    handleAuthSuccess,
    copyWalletAddress,
  } = useWalletManagement();

  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Handle wallet disconnect with callback
  const handleDisconnectWallet = async () => {
    const result = await disconnectWallet();
    if (result.success) {
      onDisconnectWallet?.();
    }
  };

  // Handle wallet connect with callback
  const handleConnectWallet = () => {
    connectWallet();
    setShowAuthDialog(true);
  };

  // Handle auth success with callback
  const handleWalletAuthSuccess = () => {
    const result = handleAuthSuccess();
    setShowAuthDialog(false);
    if (result.success) {
      onConnectWallet?.();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl font-bold">
            <Wallet className="w-5 h-5" />
            Account & Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading wallet information...</span>
        </CardContent>
      </Card>
    );
  }

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
          {/* Email verification warning */}
          <EmailVerificationWarning
            isWalletConnected={isWalletConnected}
            isEmailVerified={isEmailVerified}
          />

          {/* Wallet display */}
          <WalletDisplay
            walletInfo={walletInfo}
            isWalletConnected={isWalletConnected}
            onCopyAddress={copyWalletAddress}
          />

          {/* Wallet actions */}
          <WalletActions
            isWalletConnected={isWalletConnected}
            isEmailVerified={isEmailVerified}
            isDisconnecting={isDisconnecting}
            isConnecting={isConnecting}
            onDisconnect={handleDisconnectWallet}
            onConnect={handleConnectWallet}
          />
        </CardContent>
      </Card>

      {/* Wallet Connection Dialog */}
      <WalletConnectDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSuccess={handleWalletAuthSuccess}
      />
    </>
  );
}
