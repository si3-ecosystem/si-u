import { AppSidebar } from "@/components/organisms/layout/app-sidebar";
import { Header } from "@/components/organisms/layout/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="flex w-full">
      <AppSidebar />
      <SidebarInset className="w-full flex-1 bg-[#f6f6f6]">
        <Header />
        <div className="flex flex-1  flex-col gap-4 pt-0 h-full overflow-y-scroll ">
          {children}
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
