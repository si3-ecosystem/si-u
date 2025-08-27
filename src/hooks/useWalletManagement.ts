"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { forceUpdateUser } from "@/redux/slice/userSlice";
import { useDisconnect } from "wagmi";
import { toast } from "sonner";
import { WalletService, WalletInfo } from "@/services/walletService";
import { UnifiedAuthService } from "@/services/authService";
import { TempEmailDetector } from "@/utils/tempEmailDetector";

export function useWalletManagement() {
  const currentUser = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { disconnect: disconnectWagmi } = useDisconnect();
  
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Derived state
  const isWalletConnected = WalletService.isWalletConnected(walletInfo);
  const userEmail = currentUser?.user?.email;
  const isEmailVerified = currentUser?.user?.isVerified || currentUser?.user?.isEmailVerified;

  // Check if user has a temp email - affects wallet disconnect permissions
  const hasTempEmail = userEmail ? TempEmailDetector.isTempEmail(userEmail) : false;
  const isEmailValidForWalletOps = userEmail ? TempEmailDetector.isEmailValidForWalletOperations(userEmail, isEmailVerified) : false;

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

  const disconnectWallet = async () => {
    if (!walletInfo?.address) return { success: false, error: "No wallet connected" };

    // Check if user's email is valid for wallet operations (verified and not temp)
    if (!isEmailValidForWalletOps) {
      let error: string;

      if (hasTempEmail) {
        error = "Cannot disconnect wallet with a temporary email address. Please update your email to a permanent address first.";
      } else if (!isEmailVerified) {
        error = "Please verify your email address before disconnecting your wallet. This ensures you can still access your account.";
      } else {
        error = "Please verify your email address before disconnecting your wallet.";
      }

      toast.error(error);
      return { success: false, error };
    }

    setIsDisconnecting(true);
    try {
      // Call the wallet service to disconnect wallet from database
      const response = await WalletService.disconnectWallet();

      if (response.status === "success") {
        // Clear local wallet state
        setWalletInfo(null);

        // IMPORTANT: Preserve email verification status when removing wallet
        // Create updated user object that maintains verification status
        const updatedUser = {
          ...currentUser.user,
          // Explicitly preserve critical verification fields
          isVerified: currentUser.user.isVerified || currentUser.user.isEmailVerified,
          isEmailVerified: currentUser.user.isEmailVerified || currentUser.user.isVerified,
          email: currentUser.user.email,
          username: currentUser.user.username,
          _id: currentUser.user._id,
          roles: currentUser.user.roles,
          // Remove wallet fields
          wallet_address: undefined,
          walletInfo: undefined,
        };

        // Remove undefined fields
        delete updatedUser.wallet_address;
        delete updatedUser.walletInfo;

        console.log("=== WALLET DISCONNECT DEBUG ===");
        console.log("Original user:", currentUser.user);
        console.log("Updated user (preserving verification):", updatedUser);
        console.log("=== END WALLET DISCONNECT DEBUG ===");

        dispatch(forceUpdateUser(updatedUser));

        // Also disconnect from wagmi to prevent auto-reconnection
        try {
          disconnectWagmi();
          console.log("Disconnected from wagmi");
        } catch (wagmiError) {
          console.warn("Failed to disconnect from wagmi:", wagmiError);
        }

        toast.success("Wallet disconnected successfully. Logging out for security...");

        // Check if user has a verified email address
        const hasVerifiedEmail = updatedUser.isVerified && updatedUser.email && !updatedUser.email.includes('@wallet.temp');

        if (hasVerifiedEmail) {
          console.log("User has verified email, performing logout after wallet disconnect...");
          // Import and use the auth service to properly log out
          const { UnifiedAuthService } = await import('@/services/authService');

          // Add delay to show success message, then logout
          setTimeout(async () => {
            await UnifiedAuthService.logout({ redirect: true });
          }, 1500);
        } else {
          console.log("User has no verified email, performing hard reload...");
          // For users without verified email, just reload (they can't log back in anyway)
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }

        return { success: true };
      } else {
        throw new Error("Failed to disconnect wallet");
      }
    } catch (error: any) {
      console.error("Failed to disconnect wallet:", error);

      // Still disconnect locally but warn user about server sync
      setWalletInfo(null);

      // IMPORTANT: Preserve email verification status even in error case
      const updatedUser = {
        ...currentUser.user,
        // Explicitly preserve critical verification fields
        isVerified: currentUser.user.isVerified || currentUser.user.isEmailVerified,
        isEmailVerified: currentUser.user.isEmailVerified || currentUser.user.isVerified,
        email: currentUser.user.email,
        username: currentUser.user.username,
        _id: currentUser.user._id,
        roles: currentUser.user.roles,
        // Remove wallet fields
        wallet_address: undefined,
        walletInfo: undefined,
      };

      // Remove undefined fields
      delete updatedUser.wallet_address;
      delete updatedUser.walletInfo;

      console.log("=== WALLET DISCONNECT ERROR CASE DEBUG ===");
      console.log("Original user:", currentUser.user);
      console.log("Updated user (preserving verification):", updatedUser);
      console.log("=== END WALLET DISCONNECT ERROR CASE DEBUG ===");

      dispatch(forceUpdateUser(updatedUser));

      // Also disconnect from wagmi to prevent auto-reconnection
      try {
        disconnectWagmi();
        console.log("Disconnected from wagmi (error case)");
      } catch (wagmiError) {
        console.warn("Failed to disconnect from wagmi (error case):", wagmiError);
      }

      if (error?.statusCode === 401) {
        toast.warning("Authentication error. Logging out for security...");

        // If 401 error, logout completely
        setTimeout(async () => {
          const { UnifiedAuthService } = await import('@/services/authService');
          await UnifiedAuthService.logout({ redirect: true });
        }, 1500);
      } else {
        toast.warning("Wallet disconnected locally. Server sync failed.");

        // For other errors, check if we should logout or reload
        const hasVerifiedEmail = updatedUser.isVerified && updatedUser.email && !updatedUser.email.includes('@wallet.temp');

        if (hasVerifiedEmail) {
          console.log("Error case: User has verified email, performing logout...");
          setTimeout(async () => {
            const { UnifiedAuthService } = await import('@/services/authService');
            await UnifiedAuthService.logout({ redirect: true });
          }, 1500);
        } else {
          console.log("Error case: User has no verified email, performing reload...");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }

      return { success: false, error: error.message };
    } finally {
      setIsDisconnecting(false);
    }
  };

  const connectWallet = () => {
    setIsConnecting(true);
    return { success: true };
  };

  const handleAuthSuccess = () => {
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

    // Hard reload to ensure clean UI state after wallet connection
    console.log("Performing hard reload after wallet connection...");
    setTimeout(() => {
      window.location.reload();
    }, 1000); // Small delay to show success message

    return { success: true };
  };

  const copyWalletAddress = () => {
    if (walletInfo?.address) {
      navigator.clipboard.writeText(walletInfo.address);
      toast.success("Wallet address copied to clipboard!");
      return { success: true };
    }
    return { success: false, error: "No wallet address to copy" };
  };

  return {
    // State
    walletInfo,
    isLoading,
    isDisconnecting,
    isConnecting,
    isWalletConnected,
    isEmailVerified,
    hasTempEmail,
    isEmailValidForWalletOps,

    // Actions
    disconnectWallet,
    connectWallet,
    handleAuthSuccess,
    copyWalletAddress,
    loadWalletInfo,

    // Setters for external control
    setIsConnecting,
  };
}
