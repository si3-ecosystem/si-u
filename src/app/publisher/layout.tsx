import { Header } from "@/components/organisms/layout/Header";
import { AppSidebar } from "@/components/organisms/layout/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
