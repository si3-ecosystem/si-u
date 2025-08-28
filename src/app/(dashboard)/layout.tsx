"use client";

import { Header } from "@/components/organisms/layout/Header";
import { AppSidebar } from "@/components/organisms/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorBoundaryWrapper, LayoutErrorFallback } from "@/components/ErrorBoundary";
import { AuthDebugger } from "@/utils/debugAuth";
import { AnalyticsWrapper } from "@/components/AnalyticsWrapper";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = useAppSelector((state) => state.user);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || hasRedirected) return;

    // Check for redirect loop
    if (AuthDebugger.checkRedirectLoop()) {
      AuthDebugger.forceLoginRedirect();
      return;
    }

    // Simplified auth check - only redirect if user is initialized and clearly not authenticated
    if (currentUser.isInitialized) {
      const isAuthenticated = !!currentUser.user?._id;

      if (!isAuthenticated) {
        console.log('[DashboardLayout] User not authenticated, redirecting to login');
        setHasRedirected(true);
        router.replace('/login');
        return;
      }

      console.log('[DashboardLayout] User authenticated:', currentUser.user?.email);
    }
  }, [isClient, currentUser.isInitialized, currentUser.user?._id, router, hasRedirected]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (currentUser.isInitialized && !currentUser.user?._id && !currentUser.user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!currentUser.isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If initialized but no user, the useEffect will handle redirect
  // In the meantime, show the dashboard (middleware already verified the cookie)
  if (currentUser.isInitialized && !currentUser.user?._id) {
    // Don't show loading screen, let the dashboard render
    // The middleware has already verified the user has a valid cookie
    console.log('[DashboardLayout] User initialized but no _id, letting dashboard render (middleware verified cookie)');
  }

  return (
    <ErrorBoundaryWrapper fallback={LayoutErrorFallback}>
      <SidebarProvider className="flex w-full @container/layout">
        <AppSidebar />
        <AnalyticsWrapper/>
        <SidebarInset className="w-full flex-1 bg-[#f6f6f6]">
          <Header />

          <div className="flex flex-1 flex-col gap-4 h-full overflow-y-scroll no-scrollbar px-4 md:!px-20 mx-auto w-full py-10 max-w-[1920px]">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ErrorBoundaryWrapper>
  );
}
