"use client";

import React, { useState, useCallback, useEffect } from "react";

import EtherMail from "./EtherMail";
import LoginAuthContainer from "./LoginAuthContainer";

import LoginOTP from "./email/LoginOTP";
import LoginMail from "./email/LoginMail";

import InjectedWallet from "./wallet/InjectedWallet";
import WalletSignature from "./wallet/WalletSignature";
import { AuthDebugger } from "@/utils/debugAuth";

type AuthState = "initial" | "otp" | "wallet_signature";

interface WalletData {
  address: string;
  name: string;
}


const AuthContainer = () => {
  const [userEmail, setUserEmail] = useState<string>("");
  const [authState, setAuthState] = useState<AuthState>("initial");
  const [walletData, setWalletData] = useState<WalletData | null>(null);

  // Handle forced login state and clear redirect loop flags
  useEffect(() => {
    if (AuthDebugger.isForcedLogin()) {
      console.log('[AuthContainer] Forced login detected, clearing flags');
      AuthDebugger.clearForcedLogin();
      AuthDebugger.logAllCookies();
    }
  }, []);

  const handleEmailSubmit = useCallback((email: string) => {
    setUserEmail(email);
    setAuthState("otp");
  }, []);

  const handleAuthSuccess = useCallback(() => {
    // Auth update is already handled by the individual auth methods
    // No need to call applyAuthUpdate again here as it would overwrite the normalized data
    console.log('[AuthContainer] Auth success callback - auth already applied by service');
  }, []);

  const handleWalletConnected = useCallback((address: string, name: string) => {
    console.log('[AuthContainer] Wallet connected:', {
      address,
      name,
      addressType: typeof address,
      addressLength: address?.length
    });
    setWalletData({ address, name });
    setAuthState("wallet_signature");
  }, []);

  const handleBackToInitial = useCallback(() => {
    setAuthState("initial");
    setUserEmail("");
    setWalletData(null);
  }, []);

  // Wallet signature state
  if (authState === "wallet_signature" && walletData) {
    return (
      <LoginAuthContainer
        title="Sign Message"
        description="Complete your wallet authentication"
        description2="Sign the message to verify wallet ownership"
      >
        <div className="max-w-md mx-auto w-full">
          <WalletSignature
            walletAddress={walletData.address}
            walletName={walletData.name}
            onBack={handleBackToInitial}
            onSuccess={handleAuthSuccess}
          />
        </div>
      </LoginAuthContainer>
    );
  }

  // OTP verification state
  if (authState === "otp") {
    return (
      <LoginAuthContainer
        title="Verify Your Email"
        description="Complete your journey to SI University"
        description2="We've sent a verification code to your email"
      >
        <div className="max-w-md mx-auto w-full">
          <LoginOTP
            email={userEmail}
            onBack={handleBackToInitial}
            onSuccess={handleAuthSuccess}
          />
        </div>
      </LoginAuthContainer>
    );
  }

  // Initial login state
  return (
    <LoginAuthContainer
      title="Welcome to SI University"
      description="Onboarding emerging tech organizations, explorers and guides"
      description2="It's so nice to SI you"
    >
      <div className="space-y-3 md:space-y-4">
        <InjectedWallet onWalletConnected={handleWalletConnected} />
        {/* <EtherMail /> */}
      </div>

      <div className="my-5 flex items-center md:my-5">
        <hr className="flex-grow border-gray-300" />
        <span className="md:text-md px-2 text-xs text-gray-500 md:px-3">
          OR
        </span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <LoginMail onSubmit={handleEmailSubmit} />
    </LoginAuthContainer>
  );
};

export default AuthContainer;
