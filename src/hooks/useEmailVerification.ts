"use client";

import { useState } from "react";

interface UseEmailVerificationProps {
  profile: any;
}

export function useEmailVerification({ profile }: UseEmailVerificationProps) {
  const [pendingEmail, setPendingEmail] = useState<string>("");
  const [isSendingOTP, setIsSendingOTP] = useState(false);

  const sendOTPToEmail = async (email: string) => {
    setIsSendingOTP(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      const response = await fetch(`${apiUrl}/api/auth/send-verification-new-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('si3-jwt') || ''}`
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });


      try {
        const responseData = await response.json();

        if (response.ok && responseData.status === "success") {
          setPendingEmail(email);
          return { success: true, data: responseData };
        } else {

          let errorMessage = "Failed to send OTP";
          if (responseData.message) {
            errorMessage = responseData.message;
          } else if (responseData.error?.message) {
            errorMessage = responseData.error.message;
          } else if (responseData.error) {
            errorMessage = responseData.error;
          }

          return { success: false, error: errorMessage };
        }
      } catch (parseError) {
        console.error("❌ Failed to parse response as JSON:", parseError);
        const responseText = await response.text();
        console.error("Raw response:", responseText);

        // If response is ok but not JSON, still consider it success
        if (response.ok) {
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
    }
  };

  const sendOTPToCurrentEmail = async () => {
    if (!profile?.email) return { success: false, error: "No email found" };

    setIsSendingOTP(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      const response = await fetch(`${apiUrl}/api/auth/send-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('si3-jwt') || ''}`
        },
        credentials: "include",
      });

      const responseData = await response.json();

      if (response.ok && responseData.status === "success") {
        setPendingEmail(profile.email);
        return { success: true, data: responseData };
      } else {

        // Extract error message from various possible response structures
        let errorMessage = "Failed to send verification email";
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
      console.error("❌ Error sending verification email:", error);
      return { success: false, error: "Network error" };
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleEmailSubmit = async (data: { email: string }) => {

    const emailChanged = data.email !== profile?.email;

    if (emailChanged) {
      setPendingEmail(data.email);
      // Send verification to the new email
      return await sendOTPToEmail(data.email);
    } else {
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
