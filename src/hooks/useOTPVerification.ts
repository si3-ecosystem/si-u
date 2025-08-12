"use client";

import { useState } from "react";

export function useOTPVerification() {
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

  const verifyOTP = async (email: string, otp: string) => {
    if (!otp) return { success: false, error: "Missing OTP" };

    setIsVerifyingOTP(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      console.log("=== VERIFY EMAIL DEBUG ===");
      console.log("Verifying OTP:", otp);
      console.log("New email:", email);
      console.log("Request URL:", `${apiUrl}/api/auth/verify-email`);

      const response = await fetch(`${apiUrl}/api/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ otp, email }),
        credentials: "include",
      });

      const responseData = await response.json();
      console.log("Verify email response:", responseData);

      if (response.ok && responseData.status === "success") {
        console.log("✅ Email verified successfully");
        setOtpCode("");

        // Update token if provided
        if (responseData.data?.token) {
          localStorage.setItem('token', responseData.data.token);
          console.log("✅ Updated JWT token");
        }

        return { success: true, data: responseData };
      } else {
        console.error("❌ Email verification failed");
        console.error("Response:", responseData);
        return { success: false, error: responseData.message || "Invalid OTP" };
      }
    } catch (error) {
      console.error("❌ Error verifying OTP:", error);
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
