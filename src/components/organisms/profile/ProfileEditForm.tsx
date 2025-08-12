"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { UpdateProfileRequest } from "@/services/profileService";

// Components
import { DebugPanel } from "./components/DebugPanel";
import { StepperProgress } from "./components/StepperProgress";
import { EmailVerificationStep } from "./steps/EmailVerificationStep";
import { OTPVerificationStep } from "./steps/OTPVerificationStep";
import { ProfileUpdateStep } from "./steps/ProfileUpdateStep";

// Hooks
import { useEmailVerification } from "@/hooks/useEmailVerification";
import { useOTPVerification } from "@/hooks/useOTPVerification";
import { useProfileFormSteps } from "@/hooks/useProfileFormSteps";


// Simple validation schema - only validate what's required
const profileSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: z.string().optional(), // Always optional, validate in component if needed
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileEditForm() {
  const { profile, updateProfile, isUpdating } = useProfile();
  const [isClient, setIsClient] = useState(false);
  const [showDebug, setShowDebug] = useState(true);

  // Initialize hooks
  const stepManager = useProfileFormSteps({ profile, isClient });
  const emailVerification = useEmailVerification({ profile });
  const otpVerification = useOTPVerification();

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

  const { formState: { errors, isDirty, isValid, isSubmitting }, reset, watch, getValues } = form;

  // Watch form values for debugging
  const watchedEmail = watch("email");

  useEffect(() => {
    if (stableProfileData.email || stableProfileData.username) {
      reset(stableProfileData);
    }
  }, [stableProfileData, reset]);

  // Update form validation when step changes
  useEffect(() => {
    // Trigger re-validation when step changes
    form.trigger();
  }, [stepManager.currentStep, form]);

  // Handler functions
  const handleEmailSubmit = async (data: ProfileFormData) => {
    console.log("=== HANDLE EMAIL SUBMIT ===");
    console.log("Calling emailVerification.handleEmailSubmit with:", data);

    const result = await emailVerification.handleEmailSubmit(data);
    console.log("Email verification result:", result);

    if (result.success) {
      console.log("✅ Email verification successful, advancing to next step");
      console.log("Current step before:", stepManager.currentStep);
      stepManager.goToNextStep();
      console.log("Current step after:", stepManager.currentStep);
    } else {
      console.log("❌ Email verification failed:", result.error);
    }
    console.log("=== END HANDLE EMAIL SUBMIT ===");
  };

  const handleProfileSubmit = (data: ProfileFormData) => {
    const updateData: UpdateProfileRequest = {
      email: emailVerification.pendingEmail || profile?.email,
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
    console.log("=== FORM SUBMIT DEBUG ===");
    console.log("onSubmit called with currentStep:", stepManager.currentStep);
    console.log("Form data:", data);
    console.log("Form is valid:", isValid);
    console.log("Form errors:", errors);

    if (stepManager.currentStep === "email") {
      console.log("📧 Calling handleEmailSubmit");
      handleEmailSubmit(data);
    } else if (stepManager.currentStep === "profile") {
      console.log("👤 Calling handleProfileSubmit");
      handleProfileSubmit(data);
    } else {
      console.log("❌ Unknown step:", stepManager.currentStep);
    }
    console.log("=== END FORM SUBMIT DEBUG ===");
  };

  // OTP and verification handlers
  const handleVerifyOTP = async () => {
    console.log("=== HANDLE VERIFY OTP ===");
    console.log("Pending email:", emailVerification.pendingEmail);
    console.log("OTP code:", otpVerification.otpCode);

    const result = await otpVerification.verifyOTP(emailVerification.pendingEmail, otpVerification.otpCode);
    console.log("OTP verification result:", result);

    if (result.success) {
      console.log("✅ OTP verification successful, advancing to profile step");

      // If we have new user data from the response, we might want to refresh the user state
      if (result.data?.data?.user) {
        console.log("✅ Updated user data received:", result.data.data.user);
        // You might want to dispatch an action to update the Redux store here
      }

      stepManager.goToNextStep();
    } else {
      console.log("❌ OTP verification failed:", result.error);
    }
    console.log("=== END HANDLE VERIFY OTP ===");
  };

  const handleResendOTP = () => {
    emailVerification.sendOTPToEmail(emailVerification.pendingEmail);
  };

  const handleDebugSend = () => {
    const formData = getValues();
    console.log("=== MANUAL TEST DEBUG ===");
    console.log("Manual test with form data:", formData);
    handleEmailSubmit(formData);
  };

  // Debug data for the debug panel
  const debugData = {
    currentStep: stepManager.currentStep,
    isValid,
    isDirty,
    isSubmitting,
    isSendingOTP: emailVerification.isSendingOTP,
    profileEmail: profile?.email || "",
    watchedEmail: watchedEmail || "",
    pendingEmail: emailVerification.pendingEmail || "",
    hasTemporaryEmail: stepManager.hasTemporaryEmail,
    isEmailVerified: stepManager.isEmailVerified,
    errors,
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
      {/* Debug Panel */}
      <DebugPanel
        showDebug={showDebug}
        onToggleDebug={() => setShowDebug(!showDebug)}
        debugData={debugData}
      />

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
            {/* Stepper Progress */}
            <StepperProgress currentStep={stepManager.currentStep} />

            {/* Step 1: Email */}
            {stepManager.currentStep === "email" && (
              <EmailVerificationStep
                form={form}
                profile={profile}
                hasTemporaryEmail={stepManager.hasTemporaryEmail}
                isEmailVerified={stepManager.isEmailVerified}
                isSendingOTP={emailVerification.isSendingOTP}
                onSubmit={onSubmit}
                onDebugSend={handleDebugSend}
                onToggleDebug={() => setShowDebug(!showDebug)}
                showDebug={showDebug}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
