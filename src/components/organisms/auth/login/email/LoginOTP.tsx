"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import React, { useState, useRef, useEffect, useCallback } from "react";

import { cn } from "@/lib/utils";
import { UnifiedAuthService } from "@/services/authService";

interface LoginOTPProps {
  email: string;
  onBack: () => void;
  onSuccess?: (userData: any) => void;
}

const OTP_LENGTH = 6;

const LoadingSpinner = ({ className }: { className?: string }) => (
  <div
    className={`border-2 border-gray-600 border-t-transparent rounded-full animate-spin ${className}`}
  />
);

const LoginOTP: React.FC<LoginOTPProps> = ({ email, onBack, onSuccess }) => {
  const router = useRouter();

  const [error, setError] = useState<string>("");

  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendMessage, setResendMessage] = useState<string>("");

  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const clearMessages = useCallback(() => {
    setError("");
    setResendMessage("");
  }, []);

  const resetOtp = useCallback(() => {
    setOtp(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  }, []);

  // Auto-verify when OTP is complete
  const autoVerify = useCallback(
    async (otpString: string) => {
      if (otpString.length !== OTP_LENGTH || isVerifying) return;

      setIsVerifying(true);
      clearMessages();

      try {
        const response = await UnifiedAuthService.verifyEmailOTP(email, otpString);

        onSuccess?.(response.data);

        setIsRedirecting(true);

        // Wait a bit longer to ensure Redux state is fully updated
        // before redirecting to prevent middleware/client state mismatch
        setTimeout(() => {
          console.log('[LoginOTP] Redirecting to dashboard after successful OTP verification');
          router.push("/home");
        }, 1500);
      } catch (error: any) {
        setError(
          error.message || "Invalid verification code. Please try again."
        );
        resetOtp();
      } finally {
        setIsVerifying(false);
      }
    },
    [email, onSuccess, router, clearMessages, resetOtp, isVerifying]
  );

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (value.length > 1) return;

      const newOtp = [...otp];
      newOtp[index] = value;

      setOtp(newOtp);
      clearMessages();

      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Check if OTP is complete and auto-verify
      const otpString = newOtp.join("");
      if (otpString.length === OTP_LENGTH) {
        // Small delay to ensure UI updates before verification
        setTimeout(() => autoVerify(otpString), 100);
      }
    },
    [otp, clearMessages, autoVerify]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();

      const pastedData = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
      const newOtp = [...otp];

      for (let i = 0; i < pastedData.length; i++) {
        if (i < OTP_LENGTH && /^\d$/.test(pastedData[i])) {
          newOtp[i] = pastedData[i];
        }
      }

      setOtp(newOtp);
      clearMessages();

      const nextIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();

      // Auto-verify if pasted OTP is complete
      const otpString = newOtp.join("");
      if (otpString.length === OTP_LENGTH) {
        // Small delay to ensure UI updates before verification
        setTimeout(() => autoVerify(otpString), 100);
      }
    },
    [otp, clearMessages, autoVerify]
  );

  const handleSubmit = useCallback(async () => {
    const otpString = otp.join("");

    if (otpString.length !== OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits`);
      return;
    }

    await autoVerify(otpString);
  }, [otp, autoVerify]);

  const handleResendOTP = useCallback(async () => {
    setIsResending(true);
    clearMessages();

    try {
      await UnifiedAuthService.sendEmailOTP(email);
      setResendMessage("New verification code sent to your email");

      resetOtp();

      setTimeout(() => setResendMessage(""), 3000);
    } catch (error: any) {
      setError(error.message || "Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  }, [email, clearMessages, resetOtp]);

  const isComplete = otp.every((digit) => digit !== "");
  const isDisabled = isVerifying || isResending || isRedirecting;

  const getSubmitButtonContent = () => {
    if (isVerifying) {
      return (
        <div className="flex items-center gap-2">
          <LoadingSpinner className="w-4 h-4" />
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
        Verify <ArrowRight className="w-4" />
      </>
    );
  };

  return (
    <div className="space-y-3.5">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-medium md:text-2xl">
          Enter Verification Code
        </h2>

        <p className="text-xs font-medium text-[#00000082] md:text-sm">
          We sent a {OTP_LENGTH}-digit code to {email}
        </p>
      </div>

      <div className="flex justify-center gap-2 md:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            inputMode="numeric"
            onPaste={handlePaste}
            disabled={isDisabled}
            aria-label={`Digit ${index + 1}`}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(el: HTMLInputElement | null) => {
              inputRefs.current[index] = el;
            }}
            onChange={(e) =>
              handleChange(index, e.target.value.replace(/\D/g, ""))
            }
            className={cn(
              "w-12 h-12 md:w-14 md:h-14 text-center text-lg md:text-xl font-medium rounded-lg border-2 transition-colors",
              digit ? "border-gray-400 bg-gray-50" : "border-gray-300",
              error ? "border-red-300" : "",
              isRedirecting ? "border-green-300" : "",
              "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            )}
          />
        ))}
      </div>

      {error && (
        <p
          className="text-red-500 text-xs md:text-sm font-medium text-center"
          role="alert"
        >
          {error}
        </p>
      )}

      {resendMessage && (
        <p
          className="text-green-600 text-xs md:text-sm font-medium text-center"
          role="status"
        >
          {resendMessage}
        </p>
      )}

      {/* Auto-verification indicator */}
      {isComplete && !isVerifying && !error && (
        <p className="text-blue-600 text-xs md:text-sm font-medium text-center">
          Code entered - verifying automatically...
        </p>
      )}

      <div className="space-y-3">
        <button
          onClick={handleSubmit}
          disabled={!isComplete || isDisabled}
          className={cn(
            "flex w-full items-center justify-center gap-1.5 rounded-lg py-3.5 text-center text-lg font-medium md:text-2xl transition-colors",
            isComplete && !isDisabled
              ? "bg-[#E7E7E7] hover:bg-[#D7D7D7] cursor-pointer"
              : "bg-gray-200 cursor-not-allowed opacity-60"
          )}
          aria-label="Verify OTP code"
        >
          {getSubmitButtonContent()}
        </button>

        <button
          onClick={onBack}
          disabled={isDisabled}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 py-3.5 text-center text-lg font-medium md:text-2xl hover:bg-gray-50 transition-colors disabled:opacity-60"
          aria-label="Go back to email input"
        >
          <ArrowLeft className="w-4" />
          Back to Email
        </button>
      </div>

      <div className="text-center space-y-2">
        <p className="text-xs font-medium text-[#00000082]">
          Didn&apos;t receive the code?{" "}
          <button
            onClick={handleResendOTP}
            disabled={isDisabled}
            className="text-blue-600 hover:text-blue-800 underline disabled:opacity-60"
            aria-label="Resend verification code"
          >
            {isResending ? "Sending..." : "Resend"}
          </button>
        </p>

        <p className="text-center text-xs font-medium text-[#00000082]">
          Your journey to SI University continues with secure verification.
        </p>
      </div>
    </div>
  );
};

export default LoginOTP;
