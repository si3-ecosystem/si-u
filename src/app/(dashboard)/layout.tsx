"use client";

import { Header } from "@/components/organisms/layout/Header";
import { AppSidebar } from "@/components/organisms/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { ErrorBoundaryWrapper, LayoutErrorFallback } from "@/components/ErrorBoundary";
import { AnalyticsWrapper } from "@/components/AnalyticsWrapper";
import AuthGateV2 from "@/components/authv2/AuthGateV2";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <ErrorBoundaryWrapper fallback={LayoutErrorFallback}>
      <SidebarProvider className="flex w-full @container/layout">
        <AppSidebar />
        <AnalyticsWrapper/>
        <SidebarInset className="w-full flex-1 bg-[#f6f6f6]">
          <Header />

          <AuthGateV2>
            <div className="flex flex-1 flex-col gap-4 h-full overflow-y-scroll no-scrollbar px-4 md:!px-20 mx-auto w-full py-10 max-w-[1920px]">
              {children}
            </div>
          </AuthGateV2>
        </SidebarInset>
      </SidebarProvider>
    </ErrorBoundaryWrapper>
  );
}
