"use client";

import React, { useCallback, useState } from 'react';
import LoginAuthContainer from '@/components/organisms/auth/login/LoginAuthContainer';
import InjectedWallet from '@/components/organisms/auth/login/wallet/InjectedWallet';
import LoginEmailV2 from './LoginEmailV2';
import LoginOTPV2 from './LoginOTPV2';

type AuthState = 'initial' | 'otp';

export default function AuthContainerV2() {
  const [authState, setAuthState] = useState<AuthState>('initial');
  const [email, setEmail] = useState('');

  const handleEmailSubmit = useCallback((e: string) => {
    setEmail(e);
    setAuthState('otp');
  }, []);

  const handleBack = useCallback(() => {
    setAuthState('initial');
    setEmail('');
  }, []);

  if (authState === 'otp') {
    return (
      <LoginAuthContainer title="Verify Your Email" description="Complete your journey to SI University" description2="We've sent a verification code to your email">
        <div className="max-w-md mx-auto w-full">
          <LoginOTPV2 email={email} onBack={handleBack} />
        </div>
      </LoginAuthContainer>
    );
  }

  return (
    <LoginAuthContainer title="Welcome to SI University" description="Onboarding emerging tech organizations, explorers and guides" description2="It's so nice to SI you">
      <div className="space-y-3 md:space-y-4">
        <InjectedWallet />
      </div>

      <div className="my-5 flex items-center md:my-5">
        <hr className="flex-grow border-gray-300" />
        <span className="md:text-md px-2 text-xs text-gray-500 md:px-3">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <LoginEmailV2 onSubmit={handleEmailSubmit} />
    </LoginAuthContainer>
  );
}

