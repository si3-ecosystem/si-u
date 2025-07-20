import { AppSidebar } from "@/components/organisms/layout/app-sidebar";
import { Header } from "@/components/organisms/layout/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import { AuthGuard } from "@/components/organisms/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard requireAuth={true} requireVerification={true}>
      <SidebarProvider className="flex w-full @container/layout">
        <AppSidebar />
        <SidebarInset className="w-full flex-1 bg-[#f6f6f6]">
          <Header />
          <div className="flex flex-1 flex-col gap-4 h-full overflow-y-scroll no-scrollbar px-4 md:!px-20 mx-auto w-full py-10 max-w-[1920px]">
            {children}
          </div>
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
