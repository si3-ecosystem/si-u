"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileFormData {
  email: string;
  username?: string;
}

interface ProfileUpdateStepProps {
  form: UseFormReturn<ProfileFormData>;
  profile: any;
  pendingEmail: string;
  isUpdating: boolean;
  onSubmit: (data: ProfileFormData) => void;
}

export function ProfileUpdateStep({
  form,
  profile,
  pendingEmail,
  isUpdating,
  onSubmit,
}: ProfileUpdateStepProps) {
  const { register, handleSubmit, formState: { errors } } = form;

  // Custom validation for profile step
  const handleProfileSubmit = (data: ProfileFormData) => {
    // Validate username if provided
    if (data.username && data.username.length < 2) {
      console.log("❌ Username too short:", data.username);
      return;
    }

    console.log("✅ Profile validation passed, submitting:", data);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleProfileSubmit)} className="space-y-6">
      {/* Success Message */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-medium text-green-800 mb-2">
          ✓ Email Verified Successfully
        </h3>
        <p className="text-green-700 text-sm">
          Your email <strong className="break-all">{pendingEmail || profile?.email}</strong> has been verified.
          You can now update your profile information.
        </p>
      </div>

      {/* Username Input */}
      <div>
        <Label htmlFor="username">Username</Label>
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
        <p className="text-gray-600 text-sm mt-1">
          Choose a unique username for your profile
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isUpdating}
        className="w-fit"
      >
        {isUpdating ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
}
