"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { ProfileImageUpload } from "@/components/organisms/profile/ProfileImageUpload";

interface ProfileImageSectionProps {
  onImageUpdate?: (imageUrl: string, userData: any) => void;
  onError?: (error: string) => void;
}

export function ProfileImageSection({
  onImageUpdate,
  onError,
}: ProfileImageSectionProps) {
  const handleImageSuccess = (imageUrl: string, userData: any) => {
    console.log("Profile image updated successfully:", { imageUrl, userData });
    onImageUpdate?.(imageUrl, userData);
  };

  const handleImageError = (error: string) => {
    console.error("Profile image upload error:", error);
    onError?.(error);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg lg:text-xl font-bold">
          <User className="w-5 h-5" />
          Profile Image
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-center">
            <ProfileImageUpload
              size="xl"
              showUploadButton={true}
              showProgress={true}
              onSuccess={handleImageSuccess}
              onError={handleImageError}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
