"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { UpdateProfileRequest } from "@/services/profileService";
import { toast } from "sonner";

import { StepperProgress } from "./components/StepperProgress";
import { EmailVerificationStep } from "./steps/EmailVerificationStep";
import { OTPVerificationStep } from "./steps/OTPVerificationStep";
import { ProfileUpdateStep } from "./steps/ProfileUpdateStep";
import { ProfileCompleteView } from "./steps/ProfileCompleteView";

import { useEmailVerification } from "@/hooks/useEmailVerification";
import { useOTPVerification } from "@/hooks/useOTPVerification";
import { useProfileFormSteps } from "@/hooks/useProfileFormSteps";

const profileSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileEditForm() {
  const { profile, updateProfile, isUpdating } = useProfile();
  const [isClient, setIsClient] = useState(false);

  const stepManager = useProfileFormSteps({ profile, isClient });
  const emailVerification = useEmailVerification({ profile });
  const otpVerification = useOTPVerification();

  // Check if profile is complete
  const isProfileComplete = React.useMemo(() => {
    if (!profile || !isClient) return false;

    const isEmailVerified = profile?.isVerified || profile?.isEmailVerified || false;
    const hasUsername = profile?.username && profile.username.length >= 2;
    const hasRealEmail = profile?.email && !profile.email.includes("@wallet.temp") && !profile.email.endsWith(".temp");

    return isEmailVerified && hasUsername && hasRealEmail;
  }, [profile, isClient]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const stableProfileData = React.useMemo(
    () => ({
      email: profile?.email || "",
      username: profile?.username || "",
    }),
    [profile?.email, profile?.username]
  );

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: stableProfileData,
  });

  const { reset } = form;

  useEffect(() => {
    if (stableProfileData.email || stableProfileData.username) {
      reset(stableProfileData);
    }
  }, [stableProfileData, reset]);

  useEffect(() => {
    form.trigger();
  }, [stepManager.currentStep, form]);

  // Handler functions
  const handleEmailSubmit = async (data: ProfileFormData) => {
    const result = await emailVerification.handleEmailSubmit(data);

    if (result.success) {
      stepManager.goToNextStep();
    } else {
      // Show user-friendly error message in toast
      if (result.error?.includes("already in use") || result.error?.includes("already exists")) {
        toast.error("This email address is already in use by another account");
      } else {
        toast.error(result.error || "Failed to send verification email");
      }
    }
  };

  const handleProfileSubmit = (data: ProfileFormData) => {
    // Only include fields that should be updated
    // Don't include email since it was already updated during verification
    const updateData: UpdateProfileRequest = {
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
      isVerified: true,
      digitalLinks: profile?.digitalLinks,
    };

    updateProfile(updateData);
  };

  const onSubmit = (data: ProfileFormData) => {
    if (stepManager.currentStep === "email") {
      handleEmailSubmit(data);
    } else if (stepManager.currentStep === "profile") {
      handleProfileSubmit(data);
    }
  };

  // OTP and verification handlers
  const handleVerifyOTP = async () => {
    const result = await otpVerification.verifyOTP(
      emailVerification.pendingEmail,
      otpVerification.otpCode
    );

    if (result.success) {
      stepManager.goToNextStep();
    } else {
      console.log("❌ OTP verification failed:", result.error);
      toast.error(result.error || "Failed to verify OTP code");
    }
  };

  const handleResendOTP = () => {
    emailVerification.sendOTPToEmail(emailVerification.pendingEmail);
  };


  // Show loading state while profile is loading or user data is not available
  if (!profile || !isClient) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl font-bold">
              Edit Profile
            </CardTitle>
            <p className="text-gray-600">Loading your profile information...</p>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading profile data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl font-bold">
            {isProfileComplete
              ? "Profile Settings"
              : stepManager.currentStep === "profile"
              ? "Complete Your Profile"
              : "Edit Profile"}
          </CardTitle>
          <p className="text-gray-600">
            {isProfileComplete
              ? "Manage your profile information"
              : stepManager.currentStep === "profile"
              ? "Finalize your profile with a username"
              : "Update your personal information"}
          </p>
        </CardHeader>

        <CardContent>
          <div className="border border-gray-200 rounded-lg p-4">
            {/* Show ProfileCompleteView if profile is complete */}
            {isProfileComplete ? (
              <ProfileCompleteView
                form={form}
                profile={profile}
                isUpdating={isUpdating}
                onSubmit={handleProfileSubmit}
              />
            ) : (
              <>
                {stepManager.currentStep !== "profile" && (
                  <StepperProgress currentStep={stepManager.currentStep} />
                )}

                {/* Step 1: Email */}
                {stepManager.currentStep === "email" && (
                  <EmailVerificationStep
                    form={form}
                    profile={profile}
                    hasTemporaryEmail={stepManager.hasTemporaryEmail}
                    isEmailVerified={stepManager.isEmailVerified}
                    isSendingOTP={emailVerification.isSendingOTP}
                    onSubmit={onSubmit}
                  />
                )}

                {/* Step 2: Verify OTP */}
                {stepManager.currentStep === "verify" && (
                  <OTPVerificationStep
                    pendingEmail={emailVerification.pendingEmail}
                    otpCode={otpVerification.otpCode}
                    setOtpCode={otpVerification.setOtpCode}
                    isVerifyingOTP={otpVerification.isVerifyingOTP}
                    isSendingOTP={emailVerification.isSendingOTP}
                    onVerifyOTP={handleVerifyOTP}
                    onResendOTP={handleResendOTP}
                    onGoBack={stepManager.goBackToEmail}
                  />
                )}

                {/* Step 3: Profile Update */}
                {stepManager.currentStep === "profile" && (
                  <ProfileUpdateStep
                    form={form}
                    profile={profile}
                    pendingEmail={emailVerification.pendingEmail}
                    isUpdating={isUpdating}
                    onSubmit={onSubmit}
                  />
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
