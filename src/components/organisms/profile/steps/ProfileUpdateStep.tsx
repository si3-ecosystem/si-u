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

  const handleProfileSubmit = (data: ProfileFormData) => {
    if (data.username && data.username.length < 2) {
      return;
    }

    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(handleProfileSubmit)} className="space-y-6">
      {/* Email Field - Read Only */}
      <div>
        <Label htmlFor="email" className="flex items-center gap-2">
          Email Address
          <span className="text-xs bg-brand/10 text-brand px-2 py-1 rounded">
            ✓ Verified
          </span>
        </Label>
        <Input
          id="email"
          type="email"
          value={pendingEmail || profile?.email || ""}
          disabled
          className="mt-1 bg-gray-50 text-gray-600 cursor-not-allowed"
          placeholder="Your verified email address"
        />
        <p className="text-gray-600 text-sm mt-1">
          Your email has been verified and cannot be changed here
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
          {isUpdating ? "Updating..." : "Complete Profile"}
        </Button>
      </form>
    </div>
  );
}
