"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, AlertCircle, RefreshCw, LogOut } from 'lucide-react';
import { useAppSelector } from '@/redux/store';
import { AuthFix } from '@/utils/authFix';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = useAppSelector(state => state.user);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const userEmail = currentUser?.user?.email;
  const isVerified = currentUser?.user?.isVerified;

  // If user is already verified, redirect to dashboard
  useEffect(() => {
    if (isVerified) {
      router.push('/home');
    }
  }, [isVerified, router]);

  // Handle email verification from URL token
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // TODO: Call verification API with token
      console.log('Verification token:', token);
    }
  }, [searchParams]);

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendMessage('');

    try {
      // TODO: Call resend verification API
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setResendMessage('Verification email sent! Please check your inbox.');
      } else {
        setResendMessage('Failed to send verification email. Please try again.');
      }
    } catch {
      setResendMessage('An error occurred. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSkipForNow = () => {
    // Allow user to continue to dashboard without verification
    router.push('/home');
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  const handleClearAuthAndRelogin = () => {
    AuthFix.clearAuthAndRedirect();
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Email Already Verified
            </h2>
            <p className="text-gray-600 mb-4">
              Your email is already verified. Redirecting to dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Verify Your Email
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              We&apos;ve sent a verification email to:
            </p>
            <p className="font-semibold text-gray-900 break-all">
              {userEmail || 'your email address'}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Email verification required</p>
                <p>
                  Please check your email and click the verification link to access all features.
                </p>
              </div>
            </div>
          </div>

          {resendMessage && (
            <div className={`p-4 rounded-lg ${
              resendMessage.includes('sent') 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {resendMessage}
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full"
              variant="outline"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Verification Email
                </>
              )}
            </Button>

            <Button
              onClick={handleSkipForNow}
              variant="secondary"
              className="w-full"
            >
              Continue to Dashboard
            </Button>

            <Button
              onClick={handleBackToLogin}
              variant="ghost"
              className="w-full"
            >
              Back to Login
            </Button>

            <div className="border-t pt-3">
              <Button
                onClick={handleClearAuthAndRelogin}
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Clear Auth & Re-login with Wallet
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>
              Didn&apos;t receive the email? Check your spam folder or try resending.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
