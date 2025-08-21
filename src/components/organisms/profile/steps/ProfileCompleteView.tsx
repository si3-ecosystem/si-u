"use client";

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Edit2, Save, X } from "lucide-react";

interface ProfileFormData {
  email: string;
  username?: string;
}

interface ProfileCompleteViewProps {
  form: UseFormReturn<ProfileFormData>;
  profile: any;
  isUpdating: boolean;
  onSubmit: (data: ProfileFormData) => void;
}

export function ProfileCompleteView({
  form,
  profile,
  isUpdating,
  onSubmit,
}: ProfileCompleteViewProps) {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const currentUsername = watch("username") || profile?.username || "";
  console.log("currentUsername", currentUsername);

  const handleUsernameEdit = () => {
    setIsEditingUsername(true);
    setValue("username", profile?.username || "");
  };

  const handleUsernameCancel = () => {
    setIsEditingUsername(false);
    setValue("username", profile?.username || "");
  };

  const handleUsernameSubmit = (data: ProfileFormData) => {
    if (data.username && data.username.length >= 2) {
      onSubmit(data);
      setIsEditingUsername(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(handleUsernameSubmit)} className="space-y-6">
        {/* Email Field - Read Only */}
        <div>
          <Label htmlFor="email" className="flex items-center gap-2">
            Email Address
            <span className="text-xs bg-brand/20 text-brand px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Verified
            </span>
          </Label>
          <Input
            id="email"
            type="email"
            value={profile?.email || ""}
            disabled
            className="mt-1 bg-gray-50 text-gray-600 cursor-not-allowed"
            placeholder="Your verified email address"
          />
          <p className="text-gray-500 text-sm mt-1">
            Your email has been verified and cannot be changed here
          </p>
        </div>

        {/* Username Field - Editable */}
        <div>
          <Label htmlFor="username" className="flex items-center gap-2">
            Username
          </Label>

          {isEditingUsername ? (
            <div className="space-y-2">
              <Input
                id="username"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 2,
                    message: "Username must be at least 2 characters",
                  },
                })}
                className="mt-1"
                placeholder="Enter your username"
                autoFocus
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isUpdating}
                  className="flex items-center gap-1"
                >
                  <Save className="h-3 w-3" />
                  {isUpdating ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUsernameCancel}
                  disabled={isUpdating}
                  className="flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  value={profile?.username || "No username set"}
                  disabled
                  className="mt-1 bg-gray-50 text-gray-900 cursor-not-allowed flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUsernameEdit}
                  className="flex items-center gap-1 mt-1"
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
