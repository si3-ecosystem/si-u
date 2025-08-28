"use client";

import { useSignMessage } from "wagmi";
import { useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

import { UnifiedAuthService } from "@/services/authService";

interface WalletSignatureProps {
  walletName: string;
  walletAddress: string;
  onBack: () => void;
  onSuccess?: (userData: any) => void;
}

const formatAddress = (address: string): string =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

const WalletSignature: React.FC<WalletSignatureProps> = ({
  walletAddress,
  walletName,
  onBack,
  onSuccess,
}) => {
  const router = useRouter();
  const { signMessage } = useSignMessage();

  // Debug logging
  console.log('[WalletSignature] Component props:', {
    walletAddress,
    walletName,
    addressType: typeof walletAddress,
    addressLength: walletAddress?.length
  });

  const [error, setError] = useState<string>("");
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const handleSignMessage = useCallback(async () => {
    setIsSigning(true);
    setError("");

    try {
      // Validate wallet address before proceeding
      if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.trim() === '') {
        throw new Error('Invalid wallet address. Please reconnect your wallet.');
      }

      console.log('[WalletSignature] Requesting signature for address:', walletAddress);

      // Request signature message from backend
      const signatureResponse = await UnifiedAuthService.requestWalletSignature(
        walletAddress
      );
      const messageToSign = signatureResponse.data.message;

      setIsSigning(false);
      setIsVerifying(true);

      // Sign the message
      const signature = await new Promise<string>((resolve, reject) => {
        signMessage(
          { message: messageToSign },
          {
            onSuccess: resolve,
            onError: reject,
          }
        );
      });

      // Verify signature with backend
      const verifyResponse = await UnifiedAuthService.verifyWalletSignature(
        walletAddress,
        signature
      );

      console.log('[WalletSignature] Wallet verification successful:', verifyResponse.data);

      // Handle successful authentication
      onSuccess?.(verifyResponse.data);

      setIsRedirecting(true);

      // Verify token persistence before redirecting
      const verifyTokenPersistence = async () => {
        let attempts = 0;
        const maxAttempts = 15;
        const checkInterval = 300;

        while (attempts < maxAttempts) {
          const storedToken = localStorage.getItem('si3-jwt');
          const cookieToken = document.cookie
            .split(';')
            .find(cookie => cookie.trim().startsWith('si3-jwt='))
            ?.split('=')[1];

          console.log('[WalletSignature] Token persistence check:', {
            attempt: attempts + 1,
            hasLocalStorage: !!storedToken,
            hasCookie: !!cookieToken,
            localStorageMatches: storedToken === verifyResponse.data.token,
            cookieMatches: decodeURIComponent(cookieToken || '') === verifyResponse.data.token,
            expectedToken: verifyResponse.data.token.substring(0, 20) + '...'
          });

          // Check if both storage methods have the correct token
          const localStorageValid = storedToken === verifyResponse.data.token;
          const cookieValid = cookieToken && decodeURIComponent(cookieToken) === verifyResponse.data.token;

          if (localStorageValid && cookieValid) {
            console.log('[WalletSignature] Token persistence verified successfully!');

            // Add a small delay to ensure auth state is fully updated
            await new Promise(resolve => setTimeout(resolve, 500));

            // Clear any redirect loop flags before navigating
            sessionStorage.removeItem('redirect-history');
            sessionStorage.removeItem('force-login');

            console.log('[WalletSignature] Redirecting to dashboard...');
            router.replace("/dashboard");
            return;
          }

          attempts++;
          await new Promise(resolve => setTimeout(resolve, checkInterval));
        }

        console.warn('[WalletSignature] Token persistence verification failed after', maxAttempts, 'attempts');
        console.warn('[WalletSignature] Final state:', {
          localStorage: !!localStorage.getItem('si3-jwt'),
          cookie: !!document.cookie.includes('si3-jwt=')
        });

        // Still redirect, but log the issue
        router.replace("/dashboard");
      };

      // Start token persistence verification
      verifyTokenPersistence();
    } catch (error: any) {
      setError(
        error.message || "Failed to authenticate wallet. Please try again."
      );
    } finally {
      setIsSigning(false);
      setIsVerifying(false);
    }
  }, [walletAddress, signMessage, onSuccess, router]);

  const isDisabled = isSigning || isVerifying || isRedirecting;
  const formattedAddress = formatAddress(walletAddress);

  const getButtonContent = () => {
    if (isSigning) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
          Requesting Signature...
        </div>
      );
    }

    if (isVerifying) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
          Verifying...
        </div>
      );
    }

    if (isRedirecting) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          Redirecting...
        </div>
      );
    }

    return (
      <>
        Sign Message <ArrowRight className="w-4" />
      </>
    );
  };

  return (
    <div className="space-y-3.5">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-medium md:text-2xl">Sign Message</h2>
        <p className="text-xs font-medium text-[#00000082] md:text-sm">
          Sign the message to authenticate with your wallet
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">{walletName}</p>
            <p className="text-xs text-gray-500">{formattedAddress}</p>
          </div>
          <div
            className="w-3 h-3 bg-green-500 rounded-full"
            aria-label="Connected"
          />
        </div>
      </div>

      {error && (
        <p
          className="text-red-500 text-xs md:text-sm font-medium text-center"
          role="alert"
        >
          {error}
        </p>
      )}

      {isRedirecting && (
        <p
          className="text-green-600 text-xs md:text-sm font-medium text-center"
          role="status"
        >
          Authentication successful! Redirecting...
        </p>
      )}

      <div className="space-y-3">
        <button
          onClick={handleSignMessage}
          disabled={isDisabled}
          className={cn(
            "flex w-full items-center justify-center gap-1.5 rounded-lg py-3.5 text-center text-lg font-medium md:text-2xl transition-colors",
            !isDisabled
              ? "bg-[#E7E7E7] hover:bg-[#D7D7D7] cursor-pointer"
              : "bg-gray-200 cursor-not-allowed opacity-60"
          )}
          aria-label="Sign message to authenticate"
        >
          {getButtonContent()}
        </button>

        <button
          onClick={onBack}
          disabled={isDisabled}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 py-3.5 text-center text-lg font-medium md:text-2xl hover:bg-gray-50 transition-colors disabled:opacity-60"
          aria-label="Go back to wallet selection"
        >
          <ArrowLeft className="w-4" />
          Back to Wallets
        </button>
      </div>

      <div className="text-center">
        <p className="text-xs font-medium text-[#00000082]">
          Your wallet will prompt you to sign a message to verify ownership.
        </p>
      </div>
    </div>
  );
};

export default WalletSignature;
