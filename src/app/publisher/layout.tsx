"use client";

import { Header } from "@/components/organisms/layout/Header";
import { AppSidebar } from "@/components/organisms/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import AuthGateV2 from "@/components/authv2/AuthGateV2";

export default function PublisherLayout({
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
    <SidebarProvider className="flex w-full @container/layout">
      <AppSidebar />

      <SidebarInset className="w-full flex-1 bg-[#f6f6f6]">
        <Header />

        <AuthGateV2>
          <div className="bg-white">
            {children}
          </div>
        </AuthGateV2>
      </SidebarInset>
    </SidebarProvider>
  );
}
