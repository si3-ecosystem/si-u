"use client";

import { useState } from "react";

interface UseEmailVerificationProps {
  profile: any;
}

export function useEmailVerification({ profile }: UseEmailVerificationProps) {
  const [pendingEmail, setPendingEmail] = useState<string>("");
  const [isSendingOTP, setIsSendingOTP] = useState(false);

  const sendOTPToEmail = async (email: string) => {
    console.log("=== SEND VERIFICATION TO NEW EMAIL DEBUG ===");
    console.log("Attempting to send verification to new email:", email);
    setIsSendingOTP(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      console.log("API URL:", apiUrl);
      console.log("Request URL:", `${apiUrl}/api/auth/send-verification-new-email`);
      console.log("Request body:", { email });

      const response = await fetch(`${apiUrl}/api/auth/send-verification-new-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      try {
        const responseData = await response.json();
        console.log("Response data:", responseData);

        if (response.ok && responseData.status === "success") {
          console.log("✅ OTP sent successfully, setting pending email:", email);
          setPendingEmail(email);
          return { success: true, data: responseData };
        } else {
          console.error("❌ Failed to send OTP - Response not ok or status not success");
          console.error("Status:", response.status);
          console.error("Response:", responseData);
          return { success: false, error: responseData.message || "Failed to send OTP" };
        }
      } catch (parseError) {
        console.error("❌ Failed to parse response as JSON:", parseError);
        const responseText = await response.text();
        console.error("Raw response:", responseText);

        // If response is ok but not JSON, still consider it success
        if (response.ok) {
          console.log("✅ OTP sent successfully (non-JSON response), setting pending email:", email);
          setPendingEmail(email);
          return { success: true };
        }

        return { success: false, error: "Failed to parse response" };
      }
    } catch (error) {
      console.error("❌ Error sending OTP:", error);
      return { success: false, error: "Network error" };
    } finally {
      setIsSendingOTP(false);
      console.log("=== END SEND OTP DEBUG ===");
    }
  };

  const sendOTPToCurrentEmail = async () => {
    if (!profile?.email) return { success: false, error: "No email found" };

    setIsSendingOTP(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      console.log("=== SEND VERIFICATION TO CURRENT EMAIL ===");
      console.log("Current email:", profile.email);
      console.log("Request URL:", `${apiUrl}/api/auth/send-verification`);

      const response = await fetch(`${apiUrl}/api/auth/send-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
        },
        credentials: "include",
      });

      const responseData = await response.json();
      console.log("Send verification response:", responseData);

      if (response.ok && responseData.status === "success") {
        console.log("✅ Verification sent to current email");
        setPendingEmail(profile.email);
        return { success: true, data: responseData };
      } else {
        console.error("❌ Failed to send verification email");
        console.error("Response:", responseData);
        return { success: false, error: responseData.message || "Failed to send verification email" };
      }
    } catch (error) {
      console.error("❌ Error sending verification email:", error);
      return { success: false, error: "Network error" };
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleEmailSubmit = async (data: { email: string }) => {
    console.log("=== EMAIL SUBMIT DEBUG ===");
    console.log("handleEmailSubmit called with:", data);
    console.log("Current profile email:", profile?.email);
    console.log("Form email value:", data.email);

    const hasTemporaryEmail = profile?.email?.includes("@wallet.temp") || profile?.email?.endsWith(".temp") || false;
    const isEmailVerified = profile?.isVerified || false;

    console.log("hasTemporaryEmail:", hasTemporaryEmail);
    console.log("isEmailVerified:", isEmailVerified);

    const emailChanged = data.email !== profile?.email;

    console.log("emailChanged:", emailChanged);

    // Store the new email for later verification
    if (emailChanged) {
      console.log("✅ Email changed, sending verification to new email:", data.email);
      setPendingEmail(data.email);
      // Send verification to the new email
      return await sendOTPToEmail(data.email);
    } else {
      console.log("✅ Email unchanged, sending verification to current email:", profile?.email);
      setPendingEmail(profile?.email || "");
      // Send verification to current email
      return await sendOTPToCurrentEmail();
    }
  };

  return {
    pendingEmail,
    setPendingEmail,
    isSendingOTP,
    sendOTPToEmail,
    sendOTPToCurrentEmail,
    handleEmailSubmit,
  };
}
