"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OTPVerificationStepProps {
  pendingEmail: string;
  otpCode: string;
  setOtpCode: (code: string) => void;
  isVerifyingOTP: boolean;
  isSendingOTP: boolean;
  onVerifyOTP: () => void;
  onResendOTP: () => void;
  onGoBack: () => void;
}

export function OTPVerificationStep({
  pendingEmail,
  otpCode,
  setOtpCode,
  isVerifyingOTP,
  isSendingOTP,
  onVerifyOTP,
  onResendOTP,
  onGoBack,
}: OTPVerificationStepProps) {
  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">
          Verification Code Sent
        </h3>
        <p className="text-blue-700 text-sm">
          We&apos;ve sent a 6-digit verification code to:{" "}
          <strong className="break-all">{pendingEmail}</strong>
        </p>
      </div>

      {/* OTP Input */}
      <div>
        <Label htmlFor="otp" className="text-brand font-medium">
          Verification Code
        </Label>
        <Input
          id="otp"
          type="text"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          placeholder="Enter 6-digit code"
          maxLength={6}
          className="mt-1"
        />
        <p className="text-gray-600 text-sm mt-1">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={onVerifyOTP}
          disabled={isVerifyingOTP || otpCode.length !== 6}
          className="w-fit"
        >
          {isVerifyingOTP ? "Verifying..." : "Verify Code"}
        </Button>
        <Button
          variant="outline"
          onClick={onResendOTP}
          disabled={isSendingOTP}
          className="w-fit"
        >
          {isSendingOTP ? "Sending..." : "Resend Code"}
        </Button>
        <Button
          variant="ghost"
          onClick={onGoBack}
          className="w-fit"
        >
          Back
        </Button>
      </div>
    </div>
  );
}
