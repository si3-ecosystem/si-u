"use client";

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface EmailVerificationWarningProps {
  isWalletConnected: boolean;
  isEmailVerified: boolean;
}

export function EmailVerificationWarning({
  isWalletConnected,
  isEmailVerified,
}: EmailVerificationWarningProps) {
  if (!isWalletConnected || isEmailVerified) {
    return null;
  }

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        Please verify your email address to enable wallet management features.
        This ensures you can still access your account if you disconnect your wallet.
      </AlertDescription>
    </Alert>
  );
}
