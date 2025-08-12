"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/store";
import { Copy, Loader2, Wallet, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { WalletService, WalletInfo } from "@/services/walletService";
import WalletConnectDialog from "@/components/organisms/settings/wallet-connect/WalletConnectDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useAppDispatch } from "@/redux/store";
import { setAddress, forceUpdateUser } from "@/redux/slice/userSlice";
import { UnifiedAuthService } from "@/services/authService";
import { useDisconnect } from "wagmi";

interface AccountWalletSectionProps {
  onDisconnectWallet?: () => void;
  onConnectWallet?: () => void;
}

export function AccountWalletSection({
  onDisconnectWallet,
  onConnectWallet,
}: AccountWalletSectionProps) {
  const currentUser = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { disconnect: disconnectWagmi } = useDisconnect();
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    loadWalletInfo();
  }, []);

  useEffect(() => {
    // Check if user has valid wallet info with address
    if (currentUser?.user?.walletInfo?.address) {
      setWalletInfo(currentUser.user.walletInfo);
      setIsLoading(false);
    } else if (currentUser?.user?.wallet_address) {
      setWalletInfo({
        address: currentUser.user.wallet_address,
        connectedWallet: "Other",
        network: "Mainnet",
      });
      setIsLoading(false);
    } else if (currentUser?.user) {
      // User exists but no valid wallet data - clear wallet info
      setWalletInfo(null);
      setIsLoading(false);
    }
  }, [
    currentUser?.user?.walletInfo?.address,
    currentUser?.user?.wallet_address,
    currentUser?.user,
  ]);

  const loadWalletInfo = async () => {
    // Only use existing data if it has a valid address
    if (currentUser?.user?.walletInfo?.address || currentUser?.user?.wallet_address) {
      console.log("Using existing wallet data from user profile");
      return;
    }

    try {
      setIsLoading(true);

      try {
        const response = await WalletService.getWalletInfo();
        if (response.status === "success" && (response as any).data) {
          setWalletInfo((response as any).data.walletInfo ?? null);
          return;
        }
      } catch (apiError: any) {
        console.log("Wallet API endpoint failed:", apiError);

        // Don't show error if we have local data with valid address
        if (
          currentUser?.user?.walletInfo?.address ||
          currentUser?.user?.wallet_address
        ) {
          return;
        }
      }
    } catch (error: any) {
      console.error("Failed to load wallet info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectWallet = async () => {
    if (!walletInfo?.address) return;

    // Check if user's email is verified before allowing wallet disconnect
    const isEmailVerified = currentUser?.user?.isVerified || currentUser?.user?.isEmailVerified;

    if (!isEmailVerified) {
      toast.error(
        "Please verify your email address before disconnecting your wallet. This ensures you can still access your account."
      );
      return;
    }

    setIsDisconnecting(true);
    try {
      // Call the wallet service to disconnect wallet from database
      const response = await WalletService.disconnectWallet();

      if (response.status === "success") {
        // Clear local wallet state
        setWalletInfo(null);

        // Update Redux store to completely remove wallet information
        // Use forceUpdateUser to bypass all field preservation
        const updatedUser = { ...currentUser.user };
        delete updatedUser.wallet_address;
        delete updatedUser.walletInfo;

        dispatch(forceUpdateUser(updatedUser));

        // Also disconnect from wagmi to prevent auto-reconnection
        try {
          disconnectWagmi();
          console.log("Disconnected from wagmi");
        } catch (wagmiError) {
          console.warn("Failed to disconnect from wagmi:", wagmiError);
        }

        // Refresh JWT token to reflect the wallet disconnect
        try {
          await UnifiedAuthService.refreshToken();
          console.log("JWT token refreshed after wallet disconnect");
        } catch (refreshError) {
          console.warn("Failed to refresh JWT token after wallet disconnect:", refreshError);
          // Fallback to force refresh user data
          try {
            await UnifiedAuthService.forceRefreshUserData();
          } catch (fallbackError) {
            console.warn("Fallback refresh also failed:", fallbackError);
          }
        }

        // Force a re-render by updating the loading state
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 100);

        toast.success("Wallet disconnected successfully. You can reconnect a wallet anytime.");
        onDisconnectWallet?.();
      } else {
        throw new Error("Failed to disconnect wallet");
      }
    } catch (error: any) {
      console.error("Failed to disconnect wallet:", error);

      // Still disconnect locally but warn user about server sync
      setWalletInfo(null);

      // Update local state even if server call failed
      // Use forceUpdateUser to bypass all field preservation
      const updatedUser = { ...currentUser.user };
      delete updatedUser.wallet_address;
      delete updatedUser.walletInfo;

      dispatch(forceUpdateUser(updatedUser));

      // Also disconnect from wagmi to prevent auto-reconnection
      try {
        disconnectWagmi();
        console.log("Disconnected from wagmi (error case)");
      } catch (wagmiError) {
        console.warn("Failed to disconnect from wagmi (error case):", wagmiError);
      }

      if (error?.statusCode === 401) {
        toast.warning(
          "Wallet disconnected locally. Please verify your email to sync with server."
        );
      } else {
        toast.warning("Wallet disconnected locally. Server sync failed.");
      }

      onDisconnectWallet?.();
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleConnectWallet = () => {
    setShowAuthDialog(true);
  };

  const handleAuthSuccess = () => {
    // The AuthContainer will handle the wallet connection and user state updates
    // We just need to close the dialog and update our local state
    setShowAuthDialog(false);
    setIsConnecting(false);

    // Refresh our local wallet info from the updated user state
    setTimeout(() => {
      if (currentUser?.user?.walletInfo?.address) {
        setWalletInfo(currentUser.user.walletInfo);
      } else if (currentUser?.user?.wallet_address) {
        setWalletInfo({
          address: currentUser.user.wallet_address,
          connectedWallet: "Other",
          network: "Mainnet",
        });
      }
    }, 100);

    toast.success("Wallet connected successfully!");
    onConnectWallet?.();
  };

  const copyWalletAddress = () => {
    if (walletInfo?.address) {
      navigator.clipboard.writeText(walletInfo.address);
      toast.success("Wallet address copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl font-bold">
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

  const networkInfo = walletInfo?.network
    ? WalletService.getNetworkInfo(walletInfo.network)
    : null;
  const isWalletConnected = WalletService.isWalletConnected(walletInfo);
  const isEmailVerified = currentUser?.user?.isVerified || currentUser?.user?.isEmailVerified;

  // Debug logging to help troubleshoot
  console.log('AccountWalletSection Debug:', {
    walletInfo,
    isWalletConnected,
    userWalletInfo: currentUser?.user?.walletInfo,
    userWalletAddress: currentUser?.user?.wallet_address,
  });

  return (
    <>
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl font-bold">
            <Wallet className="w-5 h-5" />
            Account & Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          {/* Email verification warning for wallet disconnect */}
          {isWalletConnected && !isEmailVerified && (
            <Alert className="mb-4 border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Please verify your email address to enable wallet management features.
                This ensures you can still access your account if you disconnect your wallet.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3 border border-gray-200 rounded-lg p-4">
          <div className="flex flex-wrap gap-3 justify-between border-b pb-3">
            <label className="text-sm font-medium text-gray-700">
              Wallet Address
            </label>
            <div className="flex items-center justify-between ">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">
                    {isWalletConnected ? (
                      <>
                        eth:{" "}
                        <span className="text-gray-500 font-mono">
                          {WalletService.formatWalletAddress(
                            walletInfo!.address!
                          )}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-500">No wallet connected</span>
                    )}
                  </p>
                  {isWalletConnected && (
                    <>
                      <button
                        onClick={copyWalletAddress}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        title="Copy wallet address"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-between border-b pb-3">
            <label className="text-sm font-medium text-gray-700">
              Connected Wallet
            </label>
            <div className="">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {isWalletConnected
                    ? WalletService.getWalletDisplayName(
                        walletInfo!.connectedWallet!
                      )
                    : "No wallet connected"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-between pb-4">
            <label className="text-sm font-medium text-gray-700">Network</label>
            <div className="">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {networkInfo?.name || walletInfo?.network || "Unknown"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {isWalletConnected ? (
              <Button
                variant="destructive"
                className="bg-red-100 text-red-700 font-medium hover:bg-red-200 hover:text-red-800 rounded-lg w-fit"
                onClick={handleDisconnectWallet}
                disabled={isDisconnecting || !isEmailVerified}
              >
                {isDisconnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Disconnecting...
                  </>
                ) : (
                  "Disconnect Wallet"
                )}
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-blue-200 text-blue-700 font-medium hover:bg-blue-50 hover:border-blue-300 rounded-lg w-fit"
                onClick={handleConnectWallet}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Wallet Connection Dialog */}
    <WalletConnectDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} onSuccess={handleAuthSuccess} />
  </>
  );
}
