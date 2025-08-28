"use client";

import { useState } from "react";
import { UnifiedAuthService } from "@/services/authService";

export function useProfileEmailVerification() {
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

  /**
   * Verify email for existing users (profile context)
   * Uses /verify-email endpoint instead of /verify-otp
   */
  const verifyProfileEmail = async (email: string, otp: string) => {
    if (!otp) return { success: false, error: "Missing OTP" };

    setIsVerifyingOTP(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('si3-jwt') || ''}`
        },
        body: JSON.stringify({ otp, email }),
        credentials: "include",
      });

      const responseData = await response.json();

      if (response.ok && responseData.status === "success") {
        setOtpCode("");

        // For profile email verification, we update the existing user's auth state
        if (responseData.data?.token) {
          console.log('[useProfileEmailVerification] Updating token and auth state');
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

          console.log('[useProfileEmailVerification] Auth state updated successfully');

          // Small delay to ensure state propagation
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        return { success: true, data: responseData };
      } else {
        // Extract error message from various possible response structures
        let errorMessage = "Invalid OTP";
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error?.message) {
          errorMessage = responseData.error.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        }

        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("❌ [useProfileEmailVerification] Error verifying email:", error);
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
    verifyProfileEmail,
    resetOTP,
  };
}
