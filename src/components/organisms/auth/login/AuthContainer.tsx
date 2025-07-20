

"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store";
import { setUser, setAddress, setConnected } from "@/redux/slice/userSlice";

import EtherMail from "./EtherMail";
import LoginAuthContainer from "./LoginAuthContainer";

import LoginOTP from "./email/LoginOTP";
import LoginMail from "./email/LoginMail";

import InjectedWallet from "./wallet/InjectedWallet";
import WalletSignature from "./wallet/WalletSignature";

import type { User } from "@/types/auth";

type AuthState = "initial" | "otp" | "wallet_signature";

interface WalletData {
  address: string;
  name: string;
}

interface AuthData {
  token?: string;
  user?: User;
}

const AuthContainer = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [userEmail, setUserEmail] = useState<string>("");
  const [authState, setAuthState] = useState<AuthState>("initial");
  const [walletData, setWalletData] = useState<WalletData | null>(null);

  const handleEmailSubmit = useCallback((email: string) => {
    setUserEmail(email);
    setAuthState("otp");
  }, []);

  const handleAuthSuccess = useCallback((data: AuthData) => {

    if (data.token) {

      localStorage.setItem("si3-jwt", data.token);

      const expires = new Date();
      expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
      document.cookie = `si3-jwt=${data.token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;

    } else {
      console.log('AuthContainer: No token in auth data!');
    }

    // Store user data in Redux
    if (data.user) {
      dispatch(setUser(data.user));
      dispatch(setConnected(true));

      if (data.user.wallet_address) {
        dispatch(setAddress(data.user.wallet_address));
      }

      router.push("/dashboard");
    } else {
      console.log('AuthContainer: No user data in auth response!');
    }
  }, [dispatch, router]);

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
