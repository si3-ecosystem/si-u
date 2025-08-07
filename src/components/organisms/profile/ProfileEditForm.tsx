"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/hooks/useProfile';
import { UpdateProfileRequest } from '@/services/profileService';
import { Mail, User, AlertTriangle, CheckCircle, Send } from 'lucide-react';

// Validation schema - essential fields only
const profileSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(2, 'Username must be at least 2 characters').optional(),
  // Commented out fields as requested
  // name: z.string().min(2, 'Name must be at least 2 characters'),
  // phone: z.string().optional(),
  // bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  // companyName: z.string().optional(),
  // companyAffiliation: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileEditForm() {
  const {
    profile,
    isTemporaryEmail,
    isProfileComplete,
    profileCompletion,
    updateProfile,
    isUpdating
  } = useProfile();

  // Client-side rendering guard to prevent hydration mismatches
  const [isClient, setIsClient] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Email verification state for existing email
  const [emailVerificationOTP, setEmailVerificationOTP] = useState('');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isSendingEmailVerification, setIsSendingEmailVerification] = useState(false);

  // Check if email is actually verified (from backend perspective)
  const isEmailVerified = profile?.isVerified || false;

  // Memoize profile data to prevent infinite loops
  const stableProfileData = React.useMemo(() => ({
    email: profile?.email || '',
    username: profile?.username || '',
  }), [profile?.email, profile?.username]);



  // Check if user can update email (only if current email is temporary)
  const canUpdateEmail = React.useMemo(() => {
    if (!profile?.email) return true;
    return profile.email.includes('@wallet.temp') || profile.email.endsWith('.temp');
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

  // Reset form when profile data loads
  React.useEffect(() => {
    if (stableProfileData.email || stableProfileData.username) {
      reset(stableProfileData);
    }
  }, [stableProfileData, reset]);

  const onSubmit = (data: ProfileFormData) => {
    // Check if email is being changed and is not a temp email
    const emailChanged = data.email !== profile?.email;
    const isNewEmailReal = !data.email.includes('@wallet.temp') && !data.email.endsWith('.temp');

    if (emailChanged && isNewEmailReal && !showOTPField) {
      // Email is being changed to a real email - need OTP verification
      setPendingEmail(data.email);
      sendOTPToEmail(data.email);
      return;
    }

    const updateData: UpdateProfileRequest = {
      email: data.email,
      username: data.username,
      // Preserve ALL existing profile data to prevent data loss
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
      // CRITICAL: Preserve verification status and wallet data
      isVerified: profile?.isVerified,
      digitalLinks: profile?.digitalLinks,
    };

    updateProfile(updateData);
  };

  const sendOTPToEmail = async (email: string) => {
    setIsSendingOTP(true);
    try {
      // Call API to send OTP to email
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      if (response.ok) {
        setShowOTPField(true);
        // Show success message
      } else {
        // Show error message
        console.error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const verifyOTPAndUpdate = async () => {
    if (!otpCode || !pendingEmail) return;

    setIsVerifyingOTP(true);
    try {
      // Call API to verify OTP
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, otp: otpCode }),
        credentials: 'include',
      });

      if (response.ok) {
        // OTP verified, now update profile with verified email
        const updateData: UpdateProfileRequest = {
          email: pendingEmail,
          // Preserve ALL existing profile data to prevent data loss
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
          // CRITICAL: Preserve verification status and wallet data
          isVerified: true, // Email just verified
          digitalLinks: profile?.digitalLinks,
        };

        updateProfile(updateData);

        // Reset OTP state
        setShowOTPField(false);
        setOtpCode('');
        setPendingEmail('');
      } else {
        // Show error message
        console.error('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  // Send verification OTP to current email
  const sendEmailVerification = async () => {
    if (!profile?.email) return;

    setIsSendingEmailVerification(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/auth/send-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email }),
        credentials: 'include',
      });

      if (response.ok) {
        setShowEmailVerification(true);
        // Show success message
      } else {
        console.error('Failed to send verification email');
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
    } finally {
      setIsSendingEmailVerification(false);
    }
  };

  // Verify current email with OTP
  const verifyCurrentEmail = async () => {
    if (!emailVerificationOTP || !profile?.email) return;

    setIsVerifyingEmail(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email, otp: emailVerificationOTP }),
        credentials: 'include',
      });

      if (response.ok) {
        // Email verified successfully
        const data = await response.json();
        if (data.status === 'success') {
          // Update profile with verified status
          updateProfile({ isVerified: true });
          setShowEmailVerification(false);
          setEmailVerificationOTP('');
        }
      } else {
        console.error('Invalid verification OTP');
      }
    } catch (error) {
      console.error('Error verifying email:', error);
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
          <CardTitle>Edit Profile</CardTitle>
          <p className="text-gray-600">Update your personal information</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
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
                {...register('email')}
                disabled={!canUpdateEmail}
                className={`mt-1 ${
                  isTemporaryEmail ? 'border-amber-300 bg-amber-50' :
                  !canUpdateEmail ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder={canUpdateEmail ? "Enter your email address" : "Email address (verified)"}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
              {isClient && isTemporaryEmail && canUpdateEmail && (
                <p className="text-amber-600 text-sm mt-1">
                  Your current email is temporary. Please update to a real email address.
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
                    ⚠️ Your email address is not verified. Please verify to access all features.
                  </p>
                  <Button
                    type="button"
                    onClick={sendEmailVerification}
                    disabled={isSendingEmailVerification}
                    variant="outline"
                    size="sm"
                    className="text-brand border-brand/20 hover:bg-brand/10"
                  >
                    {isSendingEmailVerification ? 'Sending...' : 'Verify Email'}
                  </Button>
                </div>
              )}

              {/* Email verification for existing email */}
              {isClient && showEmailVerification && (
                <div className="mt-4 p-4 bg-brand/5 border border-brand/20 rounded-lg">
                  <div className="mb-2">
                    <Label htmlFor="emailVerificationOTP" className="text-brand font-medium">
                      Email Verification Code
                    </Label>
                    <p className="text-sm text-brand/80 mt-1">
                      We&apos;ve sent a verification code to: <strong>{profile?.email}</strong>
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
                      disabled={isVerifyingEmail || emailVerificationOTP.length !== 6}
                      className="px-6"
                    >
                      {isVerifyingEmail ? 'Verifying...' : 'Verify'}
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
                      {isSendingEmailVerification ? 'Sending...' : 'Resend Code'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowEmailVerification(false);
                        setEmailVerificationOTP('');
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
                      We&apos;ve sent a verification code to: <strong>{pendingEmail}</strong>
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
                      {isVerifyingOTP ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => sendOTPToEmail(pendingEmail)}
                      disabled={isSendingOTP}
                      className="text-brand"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      {isSendingOTP ? 'Sending...' : 'Resend Code'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowOTPField(false);
                        setOtpCode('');
                        setPendingEmail('');
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
            <div>
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </Label>
              <Input
                id="username"
                {...register('username')}
                className="mt-1"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Commented out fields as requested - keeping for future use */}
            {/*
            <div>
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                {...register('name')}
                className="mt-1"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                className="mt-1"
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                rows={4}
                className="mt-1"
                placeholder="Tell us about yourself..."
              />
              {errors.bio && (
                <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  {...register('companyName')}
                  className="mt-1"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <Label htmlFor="companyAffiliation">Company Affiliation</Label>
                <Input
                  id="companyAffiliation"
                  {...register('companyAffiliation')}
                  className="mt-1"
                  placeholder="Your role or department"
                />
              </div>
            </div>
            */}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isUpdating || !isDirty || showOTPField || showEmailVerification}
                className="flex-1"
              >
                {isUpdating ? 'Updating...' :
                 isSendingOTP ? 'Sending Verification...' :
                 showOTPField ? 'Verify Email Above' :
                 showEmailVerification ? 'Complete Email Verification Above' :
                 'Update Profile'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={isUpdating || !isDirty}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
