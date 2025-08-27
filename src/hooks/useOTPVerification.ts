"use client";

import { useState } from "react";
import { UnifiedAuthService } from "@/services/authService";

export function useOTPVerification() {
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

  const verifyOTP = async (email: string, otp: string) => {
    if (!otp) return { success: false, error: "Missing OTP" };

    setIsVerifyingOTP(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/auth/email/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, email }),
        credentials: "include",
      });

      const responseData = await response.json();

      if (response.ok && responseData.status === "success") {
        setOtpCode("");

        // Store token and update auth state
        if (responseData.data?.token) {
          console.log('[useOTPVerification] Storing token and updating auth state');
          localStorage.setItem('si3-jwt', responseData.data.token);
          
          // Also set cookie for middleware
          const expires = new Date();
          expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
          document.cookie = `si3-jwt=${encodeURIComponent(responseData.data.token)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
          
          // Normalize user data
          const normalizedUser = {
            ...responseData.data.user,
            _id: responseData.data.user._id || responseData.data.user.id
          };
          
          // Apply auth update using the unified method
          UnifiedAuthService.applyAuthUpdate({ 
            user: normalizedUser, 
            token: responseData.data.token 
          });
          
          console.log('[useOTPVerification] Auth state updated successfully');
        }

        return { success: true, data: responseData };
      } else {
        return { success: false, error: responseData.message || "Invalid OTP" };
      }
    } catch (error) {
      console.error("❌ [useOTPVerification] Error verifying OTP:", error);
      return { success: false, error: "Network error" };
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const resetOTP = () => {
    setOtpCode("");
  };

  return {
    otpCode,
    setOtpCode,
    isVerifyingOTP,
    verifyOTP,
    resetOTP,
  };
}
