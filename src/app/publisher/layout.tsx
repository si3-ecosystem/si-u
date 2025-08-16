"use client";

import { Header } from "@/components/organisms/layout/Header";
import { AppSidebar } from "@/components/organisms/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PublisherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = useAppSelector((state) => state.user);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Ensure client-side rendering to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Client-side auth guard - only run once per session
  useEffect(() => {
    if (!isClient || hasRedirected) return;

    // Only check after initialization is complete
    if (currentUser.isInitialized) {
      const isAuthenticated = !!currentUser.user?._id;

      if (!isAuthenticated) {
        console.log('[PublisherLayout] User not authenticated, redirecting to login');
        setHasRedirected(true);
        router.replace('/login');
        return;
      }
    }
  }, [isClient, currentUser.isInitialized, currentUser.user?._id, router, hasRedirected]);

  // Show loading during SSR and initial client render
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render if not authenticated (after client-side check)
  if (currentUser.isInitialized && !currentUser.user?._id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Show loading while auth is initializing
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

  return (
    <SidebarProvider className="flex w-full @container/layout">
      <AppSidebar />

      <SidebarInset className="w-full flex-1 bg-[#f6f6f6]">
        <Header />

        <div className="bg-white">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
