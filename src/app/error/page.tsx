"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, Shield, Users, Building } from "lucide-react";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const role = searchParams.get("role");

  const getErrorContent = () => {
    if (reason === "unauthorized") {
      const roleInfo = {
        admin: {
          icon: Shield,
          title: "Admin Access Required",
          description: "This page is restricted to administrators only.",
          color: "text-red-600",
        },
        guide: {
          icon: Users,
          title: "Guide Access Required", 
          description: "This page is restricted to guides and administrators only.",
          color: "text-orange-600",
        },
        partner: {
          icon: Building,
          title: "Partner Access Required",
          description: "This page is restricted to partners and administrators only.",
          color: "text-blue-600",
        },
      };

      const info = roleInfo[role as keyof typeof roleInfo] || {
        icon: AlertTriangle,
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        color: "text-red-600",
      };

      return {
        icon: info.icon,
        title: info.title,
        description: info.description,
        color: info.color,
        statusCode: "403",
        statusText: "Forbidden",
      };
    }

    // Default error
    return {
      icon: AlertTriangle,
      title: "Something went wrong",
      description: "An unexpected error occurred.",
      color: "text-red-600",
      statusCode: "Error",
      statusText: "Unknown Error",
    };
  };

  const errorContent = getErrorContent();
  const IconComponent = errorContent.icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <IconComponent className={`h-16 w-16 ${errorContent.color}`} />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {errorContent.statusCode} - {errorContent.statusText}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {errorContent.title}
          </h2>
          <p className="text-gray-600">
            {errorContent.description}
          </p>
          
          {reason === "unauthorized" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p>
                If you believe you should have access to this page, please contact your administrator.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-4">
            <Button asChild>
              <Link href="/home" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Go to Dashboard</span>
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
