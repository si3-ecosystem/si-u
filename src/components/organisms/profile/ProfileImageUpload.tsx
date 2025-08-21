/**
 * ProfileImageUpload Component
 * Reusable component for uploading and managing profile images
 */

"use client";

import React, { useRef } from 'react';
import { Camera, Upload, X, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useProfileImageUpload } from '@/hooks/useProfileImageUpload';
import { useAppSelector } from '@/redux/store';
import { cn } from '@/lib/utils';
import { getProfileImageUrl, getUserInitials } from '@/utils/profileImageUtils';

interface ProfileImageUploadProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showUploadButton?: boolean;
  showProgress?: boolean;
  onSuccess?: (imageUrl: string, userData: any) => void;
  onError?: (error: string) => void;
}

const sizeClasses = {
  sm: 'h-16 w-16',
  md: 'h-24 w-24',
  lg: 'h-32 w-32',
  xl: 'h-40 w-40',
};

export function ProfileImageUpload({
  className,
  size = 'lg',
  showUploadButton = true,
  showProgress = true,
  onSuccess,
  onError,
}: ProfileImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = useAppSelector(state => {
    console.log('🔄 useAppSelector called - Redux state:', {
      profileImage: state.user.user.profileImage,
      avatar: state.user.user.avatar,
      lastUpdated: state.user.lastUpdated
    });
    return state.user.user;
  });

  // Debug: Log current user state
  React.useEffect(() => {
    console.log('🖼️ ProfileImageUpload - Current user state:', {
      profileImage: currentUser?.profileImage,
      avatar: currentUser?.avatar,
      _id: currentUser?._id,
      email: currentUser?.email
    });
  }, [currentUser?.profileImage, currentUser?.avatar]);

  const {
    isUploading,
    uploadProgress,
    previewUrl,
    selectedFile,
    error,
    selectFile,
    uploadImage,
    clearSelection,
    clearError,
    formatFileSize,
  } = useProfileImageUpload({
    onSuccess: (imageUrl, userData) => {
      console.log('🎉 ProfileImageUpload - Upload success callback:', { imageUrl, userData });
      onSuccess?.(imageUrl, userData);
    },
    onError: (error) => {
      console.error('❌ ProfileImageUpload - Upload error callback:', error);
      onError?.(error);
    },
  });

  // Get current profile image URL using utility function
  const currentImageUrl = getProfileImageUrl(currentUser);

  // Get display image URL (preview takes priority)
  const displayImageUrl = previewUrl || currentImageUrl;

  // Get user initials using utility function
  const userInitials = getUserInitials(currentUser);

  // Debug: Log image URLs
  React.useEffect(() => {
    console.log('🖼️ ProfileImageUpload - Image URLs:', {
      currentImageUrl,
      displayImageUrl,
      previewUrl,
      userInitials
    });
  }, [currentImageUrl, displayImageUrl, previewUrl, userInitials]);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      selectFile(file);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  // Handle click on avatar to open file picker
  const handleAvatarClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  // Handle upload button click
  const handleUpload = () => {
    uploadImage();
  };

  // Handle cancel/clear selection
  const handleCancel = () => {
    clearSelection();
    clearError();
  };

  return (
    <Card className={cn('w-fit', className)}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Avatar with upload overlay */}
          <div className="relative group">
            <Avatar 
              className={cn(
                sizeClasses[size],
                'cursor-pointer transition-all duration-200',
                isUploading ? 'opacity-50' : 'hover:opacity-80'
              )}
              onClick={handleAvatarClick}
            >
              <AvatarImage 
                src={displayImageUrl} 
                alt="Profile"
                className="object-cover"
              />
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            
            {/* Upload overlay */}
            <div 
              className={cn(
                'absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 transition-opacity duration-200',
                !isUploading && 'group-hover:opacity-100',
                'cursor-pointer'
              )}
              onClick={handleAvatarClick}
            >
              <Camera className="h-6 w-6 text-white" />
            </div>

            {/* Loading overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
              </div>
            )}
          </div>

          {/* File info and progress */}
          {selectedFile && (
            <div className="w-full max-w-sm space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate font-medium">{selectedFile.name}</span>
                <span className="text-gray-500">{formatFileSize(selectedFile.size)}</span>
              </div>
              
              {showProgress && isUploading && (
                <div className="space-y-1">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-center text-gray-500">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-2 rounded-md">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex space-x-2">
            {!selectedFile && showUploadButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAvatarClick}
                disabled={isUploading}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Image</span>
              </Button>
            )}

            {selectedFile && !isUploading && (
              <>
                <Button
                  size="sm"
                  onClick={handleUpload}
                  className="flex items-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Upload</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
              </>
            )}
          </div>

          {/* Upload instructions */}
          <div className="text-xs text-gray-500 text-center max-w-sm">
            <p>Click the avatar or upload button to select an image.</p>
            <p>Supported formats: JPEG, PNG, WebP (max 5MB)</p>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </CardContent>
    </Card>
  );
}
