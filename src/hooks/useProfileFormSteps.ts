"use client";

import { useState, useEffect } from "react";

type Step = "email" | "verify" | "profile";

interface UseProfileFormStepsProps {
  profile: any;
  isClient: boolean;
}

export function useProfileFormSteps({ profile, isClient }: UseProfileFormStepsProps) {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [hasStartedVerification, setHasStartedVerification] = useState(false);

  const isEmailVerified = profile?.isVerified || profile?.isEmailVerified || false;
  const hasTemporaryEmail = profile?.email?.includes("@wallet.temp") || profile?.email?.endsWith(".temp") || false;
  const hasRealEmail = profile?.email && !hasTemporaryEmail;

  // User must verify email ONLY if they have a temporary email OR (no real email AND not verified)
  // If user has real email and is verified, they should skip to profile step
  const mustVerifyEmailFirst = hasTemporaryEmail || (!hasRealEmail && !isEmailVerified);

  // Determine initial step based on email verification status (only on first load)
  useEffect(() => {
    if (profile && isClient && !hasStartedVerification) {
      if (mustVerifyEmailFirst) {
        setCurrentStep("email");
      } else {
        setCurrentStep("profile");
      }
    }
  }, [profile, isClient, mustVerifyEmailFirst, hasStartedVerification, isEmailVerified, hasTemporaryEmail, hasRealEmail]);

  const goToNextStep = () => {
    // Mark that verification process has started
    setHasStartedVerification(true);

    switch (currentStep) {
      case "email":
        setCurrentStep("verify");
        break;
      case "verify":
        setCurrentStep("profile");
        break;
      default:
        break;
    }
  };

  const goBackToEmail = () => {
    setCurrentStep("email");
    // Keep hasStartedVerification true so we don't reset automatically
  };

  return {
    currentStep,
    setCurrentStep,
    isEmailVerified,
    hasTemporaryEmail,
    mustVerifyEmailFirst,
    goToNextStep,
    goBackToEmail,
  };
}
