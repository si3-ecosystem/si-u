"use client";

import React, { useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { UnifiedAuthService } from "@/services/authService";

interface LoginMailProps {
  onSubmit: (email: string) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoadingSpinner = ({ className }: { className?: string }) => (
  <div
    className={`border-2 border-gray-600 border-t-transparent rounded-full animate-spin ${className}`}
  />
);

const LoginMail: React.FC<LoginMailProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = useCallback((email: string): boolean => {
    return EMAIL_REGEX.test(email);
  }, []);

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      if (error) setError("");
    },
    [error]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const trimmedEmail = email.trim();

      if (!trimmedEmail) {
        setError("Please enter your email address");
        return;
      }

      if (!validateEmail(trimmedEmail)) {
        setError("Please enter a valid email address");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        await UnifiedAuthService.sendEmailOTP(trimmedEmail);
        onSubmit(trimmedEmail);
      } catch (error: any) {
        setError(
          error.message || "Failed to send verification code. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [email, validateEmail, onSubmit]
  );

  const isDisabled = isLoading || !email.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <label
        htmlFor="email"
        className="md:text-md sr-only block text-sm font-medium"
      >
        Email Address
      </label>

      <div className="relative mt-2 border">
        <input
          id="email"
          type="email"
          value={email}
          disabled={isLoading}
          placeholder="youremail@si3.space"
          onChange={handleEmailChange}
          className={cn(
            "md:text-md w-full rounded-lg p-2 text-lg md:p-3 md:text-sm transition-colors",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200",
            "focus:outline-none focus:ring-2"
          )}
          autoComplete="email"
          aria-describedby={error ? "email-error" : undefined}
        />
      </div>

      {error && (
        <p
          id="email-error"
          className="text-red-500 text-xs md:text-sm font-medium"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isDisabled}
        className={cn(
          "flex w-full items-center justify-center gap-1.5 rounded-lg py-3.5 text-center text-lg font-medium md:text-2xl transition-colors",
          !isDisabled
            ? "bg-[#E7E7E7] hover:bg-[#D7D7D7] cursor-pointer"
            : "bg-gray-200 cursor-not-allowed opacity-60"
        )}
        aria-label="Send verification code to email"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner className="w-4 h-4" />
            Sending...
          </div>
        ) : (
          <>
            Continue <ArrowRight className="w-4" />
          </>
        )}
      </button>

      <p className="text-center text-xs font-medium text-[#00000082]">
        Welcome onboard as we set sail towards a brighter new economy and
        future.
      </p>
    </form>
  );
};

export default LoginMail;
