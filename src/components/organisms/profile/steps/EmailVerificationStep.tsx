"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ProfileFormData {
  email: string;
  username?: string;
}

interface EmailVerificationStepProps {
  form: UseFormReturn<ProfileFormData>;
  profile: any;
  hasTemporaryEmail: boolean;
  isEmailVerified: boolean;
  isSendingOTP: boolean;
  onSubmit: (data: ProfileFormData) => void;
  onDebugSend: () => void;
  onToggleDebug: () => void;
  showDebug: boolean;
}

export function EmailVerificationStep({
  form,
  profile,
  hasTemporaryEmail,
  isEmailVerified,
  isSendingOTP,
  onSubmit,
  onDebugSend,
  onToggleDebug,
  showDebug,
}: EmailVerificationStepProps) {
  const { register, handleSubmit, formState: { errors }, getValues } = form;

  // Custom submit handler that only validates email
  const handleEmailSubmit = (data: ProfileFormData) => {
    // Only validate email field for this step
    if (!data.email || !data.email.includes('@')) {
      console.log("❌ Invalid email:", data.email);
      return;
    }

    console.log("✅ Email validation passed, submitting:", data.email);
    onSubmit({ email: data.email }); // Only submit email
  };

  return (
    <form onSubmit={handleSubmit(handleEmailSubmit)} className="space-y-6">
      {/* Warning Message */}
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-amber-600 mt-0.5 flex-shrink-0">⚠️</div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-amber-800 mb-1">
              Email Verification Required
            </h3>
            <p className="text-amber-700 text-sm mb-3">
              {hasTemporaryEmail
                ? "You have a temporary email address. Please update to a real email and verify it."
                : "Please verify your email address to continue."
              }
            </p>
            {hasTemporaryEmail && (
              <div className="text-amber-600 text-xs">
                <span className="block mb-1">Current email:</span>
                <code className="bg-amber-100 px-2 py-1 rounded text-xs break-all block w-full overflow-hidden">
                  {profile?.email}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Input */}
      <div>
        <Label htmlFor="email" className="flex items-center gap-2">
          Email Address *
          {hasTemporaryEmail && (
            <Badge variant="destructive" className="text-xs">
              Temporary
            </Badge>
          )}
          {!isEmailVerified && !hasTemporaryEmail && (
            <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
              Unverified
            </Badge>
          )}
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className="mt-1"
          placeholder={hasTemporaryEmail ? "Enter a real email address" : "Your email address"}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
        <p className="text-gray-600 text-sm mt-1">
          {hasTemporaryEmail
            ? "Enter a real email address to receive verification code"
            : "Click 'Send Verification' to verify your current email"
          }
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          type="submit"
          className="w-fit"
          disabled={isSendingOTP}
          onClick={() => {
            console.log("=== BUTTON CLICK DEBUG ===");
            console.log("Button clicked, form will submit");
            console.log("isSendingOTP:", isSendingOTP);
            console.log("Form values:", getValues());
            console.log("Form errors:", errors);
            console.log("=== END BUTTON CLICK DEBUG ===");
          }}
        >
          {isSendingOTP ? "Sending..." : "Send Verification Code"}
        </Button>
        
        {/* Debug button for manual testing */}
        <Button
          type="button"
          variant="outline"
          className="w-fit"
          onClick={() => {
            const formData = getValues();
            console.log("=== MANUAL DEBUG SEND ===");
            console.log("Form data:", formData);
            handleEmailSubmit(formData);
          }}
        >
          🔧 Debug Send
        </Button>
        
        {/* Debug toggle button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-fit"
          onClick={onToggleDebug}
        >
          {showDebug ? "Hide Debug" : "Show Debug"}
        </Button>
      </div>
    </form>
  );
}
