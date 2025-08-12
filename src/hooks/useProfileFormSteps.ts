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

  const isEmailVerified = profile?.isVerified || false;
  const hasTemporaryEmail = profile?.email?.includes("@wallet.temp") || profile?.email?.endsWith(".temp") || false;
  const mustVerifyEmailFirst = hasTemporaryEmail || !isEmailVerified;

  // Determine initial step based on email verification status (only on first load)
  useEffect(() => {
    if (profile && isClient && !hasStartedVerification) {
      console.log("=== INITIAL STEP SETUP ===");
      console.log("mustVerifyEmailFirst:", mustVerifyEmailFirst);
      console.log("hasStartedVerification:", hasStartedVerification);

      if (mustVerifyEmailFirst) {
        console.log("Setting initial step to email");
        setCurrentStep("email");
      } else {
        console.log("Setting initial step to profile");
        setCurrentStep("profile");
      }
    }
  }, [profile, isClient, mustVerifyEmailFirst, hasStartedVerification]);

  // Debug step changes
  useEffect(() => {
    console.log("=== STEP CHANGED ===");
    console.log("New current step:", currentStep);
    console.log("hasStartedVerification:", hasStartedVerification);
  }, [currentStep, hasStartedVerification]);

  const goToNextStep = () => {
    console.log("=== GO TO NEXT STEP ===");
    console.log("Current step:", currentStep);

    // Mark that verification process has started
    setHasStartedVerification(true);

    switch (currentStep) {
      case "email":
        console.log("Moving from email to verify step");
        setCurrentStep("verify");
        break;
      case "verify":
        console.log("Moving from verify to profile step");
        setCurrentStep("profile");
        break;
      default:
        console.log("Unknown step, no action taken");
        break;
    }
    console.log("=== END GO TO NEXT STEP ===");
  };

  const goBackToEmail = () => {
    console.log("=== GO BACK TO EMAIL ===");
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
