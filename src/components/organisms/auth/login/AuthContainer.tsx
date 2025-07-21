"use client";

import React, { useState, useCallback } from "react";

import EtherMail from "./EtherMail";
import LoginAuthContainer from "./LoginAuthContainer";

import LoginOTP from "./email/LoginOTP";
import LoginMail from "./email/LoginMail";

import InjectedWallet from "./wallet/InjectedWallet";
import WalletSignature from "./wallet/WalletSignature";

type AuthState = "initial" | "otp" | "wallet_signature";

interface WalletData {
  address: string;
  name: string;
}

interface AuthData {
  token?: string;
  user?: any;
}

const AuthContainer = () => {
  const [userEmail, setUserEmail] = useState<string>("");
  const [authState, setAuthState] = useState<AuthState>("initial");
  const [walletData, setWalletData] = useState<WalletData | null>(null);

  const handleEmailSubmit = useCallback((email: string) => {
    setUserEmail(email);
    setAuthState("otp");
  }, []);

  const handleAuthSuccess = useCallback((data: AuthData) => {
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem("si3-jwt", data.token);
    }
  }, []);

  const handleWalletConnected = useCallback((address: string, name: string) => {
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
        <EtherMail />
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
