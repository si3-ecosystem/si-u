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

        <div className="flex flex-1 flex-col gap-4 h-full overflow-y-scroll no-scrollbar px-4 md:!px-20 mx-auto w-full py-10 max-w-[1920px]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
