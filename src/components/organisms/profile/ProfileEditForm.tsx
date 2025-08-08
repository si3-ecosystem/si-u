"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { UpdateProfileRequest } from "@/services/profileService";
import {  Send } from "lucide-react";

// Validation schema - essential fields only
const profileSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .optional(),
  // Commented out fields as requested
  // name: z.string().min(2, 'Name must be at least 2 characters'),
  // phone: z.string().optional(),
  // bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  // companyName: z.string().optional(),
  // companyAffiliation: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileEditForm() {
  const { profile, isTemporaryEmail, updateProfile, isUpdating } = useProfile();

  const [isClient, setIsClient] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string>("");
  const [otpCode, setOtpCode] = useState("");
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [emailVerificationOTP, setEmailVerificationOTP] = useState("");
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isSendingEmailVerification, setIsSendingEmailVerification] =
    useState(false);

  const isEmailVerified = profile?.isVerified || false;

  const stableProfileData = React.useMemo(
    () => ({
      email: profile?.email || "",
      username: profile?.username || "",
    }),
    [profile?.email, profile?.username]
  );

  const canUpdateEmail = React.useMemo(() => {
    if (!profile?.email) return true;
    return (
      profile.email.includes("@wallet.temp") || profile.email.endsWith(".temp")
    );
  }, [profile?.email]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: stableProfileData,
  });

  useEffect(() => {
    if (stableProfileData.email || stableProfileData.username) {
      reset(stableProfileData);
    }
  }, [stableProfileData, reset]);

  const onSubmit = (data: ProfileFormData) => {
    const emailChanged = data.email !== profile?.email;
    const isNewEmailReal =
      !data.email.includes("@wallet.temp") && !data.email.endsWith(".temp");

    if (emailChanged && isNewEmailReal && !showOTPField) {
      setPendingEmail(data.email);
      sendOTPToEmail(data.email);
      return;
    }

    const updateData: UpdateProfileRequest = {
      email: data.email,
      username: data.username,
      name: profile?.name,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      phone: profile?.phone,
      bio: profile?.bio,
      companyName: profile?.companyName,
      companyAffiliation: profile?.companyAffiliation,
      interests: profile?.interests,
      personalValues: profile?.personalValues,
      newsletter: profile?.newsletter,
      isVerified: profile?.isVerified,
      digitalLinks: profile?.digitalLinks,
    };

    updateProfile(updateData);
  };

  const sendOTPToEmail = async (email: string) => {
    setIsSendingOTP(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      if (response.ok) {
        setShowOTPField(true);
      } else {
        console.error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const verifyOTPAndUpdate = async () => {
    if (!otpCode || !pendingEmail) return;

    setIsVerifyingOTP(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, otp: otpCode }),
        credentials: "include",
      });

      if (response.ok) {
        const updateData: UpdateProfileRequest = {
          email: pendingEmail,
          username: profile?.username,
          name: profile?.name,
          firstName: profile?.firstName,
          lastName: profile?.lastName,
          phone: profile?.phone,
          bio: profile?.bio,
          companyName: profile?.companyName,
          companyAffiliation: profile?.companyAffiliation,
          interests: profile?.interests,
          personalValues: profile?.personalValues,
          newsletter: profile?.newsletter,
          isVerified: true,
          digitalLinks: profile?.digitalLinks,
        };

        updateProfile(updateData);

        setShowOTPField(false);
        setOtpCode("");
        setPendingEmail("");
      } else {
        console.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const sendEmailVerification = async () => {
    if (!profile?.email) return;

    setIsSendingEmailVerification(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/auth/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email }),
        credentials: "include",
      });

      if (response.ok) {
        setShowEmailVerification(true);
      } else {
        console.error("Failed to send verification email");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
    } finally {
      setIsSendingEmailVerification(false);
    }
  };

  const verifyCurrentEmail = async () => {
    if (!emailVerificationOTP || !profile?.email) return;

    setIsVerifyingEmail(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          otp: emailVerificationOTP,
        }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          updateProfile({ isVerified: true });
          setShowEmailVerification(false);
          setEmailVerificationOTP("");
        }
      } else {
        console.error("Invalid verification OTP");
      }
    } catch (error) {
      console.error("Error verifying email:", error);
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Please log in to view your profile.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl font-bold">
            Edit Profile
          </CardTitle>
          <p className="text-gray-600">Update your personal information</p>
        </CardHeader>

        <CardContent>
         <div className="border border-gray-200 rounded-lg p-4">
           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  Email Address *
                </Label>
                {isClient && isTemporaryEmail && (
                  <Badge variant="destructive" className="text-xs">
                    Temporary
                  </Badge>
                )}
              </div>
              <Input
                id="email"
                type="email"
                {...register("email")}
                disabled={!canUpdateEmail}
                className={`mt-1 ${
                  isTemporaryEmail
                    ? "border-amber-300 bg-amber-50"
                    : !canUpdateEmail
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                placeholder={
                  canUpdateEmail
                    ? "Enter your email address"
                    : "Email address (verified)"
                }
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
              {isClient && isTemporaryEmail && canUpdateEmail && (
                <p className="text-amber-600 text-sm mt-1">
                  Your current email is temporary. Please update to a real email
                  address.
                </p>
              )}

              {isClient && !canUpdateEmail && isEmailVerified && (
                <p className="text-brand text-sm mt-1">
                  ✓ Your email address is verified and cannot be changed.
                </p>
              )}

              {isClient && !canUpdateEmail && !isEmailVerified && (
                <div className="mt-2">
                  <p className="text-amber-600 text-sm mb-2">
                    ⚠️ Your email address is not verified. Please verify to
                    access all features.
                  </p>
                  <Button
                    type="button"
                    onClick={sendEmailVerification}
                    disabled={isSendingEmailVerification}
                    variant="outline"
                    size="sm"
                    className="text-brand border-brand/20 hover:bg-brand/10"
                  >
                    {isSendingEmailVerification ? "Sending..." : "Verify Email"}
                  </Button>
                </div>
              )}

              {/* Email verification for existing email */}
              {isClient && showEmailVerification && (
                <div className="mt-4 p-4 bg-brand/5 border border-brand/20 rounded-lg">
                  <div className="mb-2">
                    <Label
                      htmlFor="emailVerificationOTP"
                      className="text-brand font-medium"
                    >
                      Email Verification Code
                    </Label>
                    <p className="text-sm text-brand/80 mt-1">
                      We&apos;ve sent a verification code to:{" "}
                      <strong>{profile?.email}</strong>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="emailVerificationOTP"
                      type="text"
                      value={emailVerificationOTP}
                      onChange={(e) => setEmailVerificationOTP(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={verifyCurrentEmail}
                      disabled={
                        isVerifyingEmail || emailVerificationOTP.length !== 6
                      }
                      className="px-6"
                    >
                      {isVerifyingEmail ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={sendEmailVerification}
                      disabled={isSendingEmailVerification}
                      className="text-brand"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      {isSendingEmailVerification
                        ? "Sending..."
                        : "Resend Code"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowEmailVerification(false);
                        setEmailVerificationOTP("");
                      }}
                      className="text-gray-600"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* OTP field for email updates */}
              {isClient && showOTPField && (
                <div className="mt-4 p-4 bg-brand/5 border border-brand/20 rounded-lg">
                  <div className="mb-2">
                    <Label htmlFor="otp" className="text-brand font-medium">
                      Email Update Verification Code
                    </Label>
                    <p className="text-sm text-brand/80 mt-1">
                      We&apos;ve sent a verification code to:{" "}
                      <strong>{pendingEmail}</strong>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="otp"
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={verifyOTPAndUpdate}
                      disabled={isVerifyingOTP || otpCode.length !== 6}
                      className="px-6"
                    >
                      {isVerifyingOTP ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => sendOTPToEmail(pendingEmail)}
                      disabled={isSendingOTP}
                      className="text-brand border border-brand"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      {isSendingOTP ? "Sending..." : "Resend Code"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowOTPField(false);
                        setOtpCode("");
                        setPendingEmail("");
                      }}
                      className="text-gray-600"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                Username
              </Label>
              <Input
                id="username"
                {...register("username")}
                className="mt-1"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={
                  isUpdating ||
                  !isDirty ||
                  showOTPField ||
                  showEmailVerification
                }
                className="w-fit"
              >
                {isUpdating
                  ? "Updating..."
                  : isSendingOTP
                  ? "Sending Verification..."
                  : showOTPField
                  ? "Verify Email Above"
                  : showEmailVerification
                  ? "Complete Email Verification Above"
                  : "Update Profile"}
              </Button>

              
            </div>
          </form>
         </div>
        </CardContent>
      </Card>
    </div>
  );
}
