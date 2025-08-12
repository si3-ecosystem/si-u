"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Bug } from "lucide-react";

interface DebugPanelProps {
  showDebug: boolean;
  onToggleDebug: () => void;
  debugData: {
    currentStep: string;
    isValid: boolean;
    isDirty: boolean;
    isSubmitting: boolean;
    isSendingOTP: boolean;
    profileEmail: string;
    watchedEmail: string;
    pendingEmail: string;
    hasTemporaryEmail: boolean;
    isEmailVerified: boolean;
    errors: any;
  };
}

export function DebugPanel({ showDebug, onToggleDebug, debugData }: DebugPanelProps) {
  if (!showDebug) return null;

  const {
    currentStep,
    isValid,
    isDirty,
    isSubmitting,
    isSendingOTP,
    profileEmail,
    watchedEmail,
    pendingEmail,
    hasTemporaryEmail,
    isEmailVerified,
    errors,
  } = debugData;

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-orange-800 flex items-center gap-2">
            <Bug className="w-4 h-4" />
            Debug Information
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDebug}
            className="h-6 w-6 p-0 text-orange-600 hover:text-orange-800"
          >
            {showDebug ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <h4 className="font-medium text-orange-800">Form State:</h4>
            <div className="space-y-1 font-mono text-orange-700">
              <div>Current Step: <span className="font-bold">{currentStep}</span></div>
              <div>Form Valid: <span className="font-bold">{isValid ? "✅" : "❌"}</span></div>
              <div>Form Dirty: <span className="font-bold">{isDirty ? "✅" : "❌"}</span></div>
              <div>Submitting: <span className="font-bold">{isSubmitting ? "✅" : "❌"}</span></div>
              <div>Sending OTP: <span className="font-bold">{isSendingOTP ? "✅" : "❌"}</span></div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-orange-800">Email State:</h4>
            <div className="space-y-1 font-mono text-orange-700">
              <div>Profile Email: <span className="font-bold break-all">{profileEmail || "N/A"}</span></div>
              <div>Watched Email: <span className="font-bold break-all">{watchedEmail || "N/A"}</span></div>
              <div>Pending Email: <span className="font-bold break-all">{pendingEmail || "N/A"}</span></div>
              <div>Has Temp Email: <span className="font-bold">{hasTemporaryEmail ? "✅" : "❌"}</span></div>
              <div>Email Verified: <span className="font-bold">{isEmailVerified ? "✅" : "❌"}</span></div>
            </div>
          </div>
        </div>
        {errors.email && (
          <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-red-700 text-xs">
            <strong>Email Error:</strong> {errors.email.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
