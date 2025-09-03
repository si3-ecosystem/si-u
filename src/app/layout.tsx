import { Toaster } from "sonner";
import type { Metadata } from "next";

// Initialize console suppression for production
import "@/lib/utils/init-console-suppression";

import "./globals.css";

import ReduxProvider from "@/providers/ReduxProvider";
import WalletProvider from "@/providers/WagmiProvider";
import { TanstackClientProvider } from "@/providers/TanstackClientProvider";
import AuthV2Provider from "@/providers/AuthV2Provider";
// import AuthV2LegacyBridge from "@/providers/AuthV2LegacyBridge";
// Removed legacy AuthInitializer to avoid conflicting auth states
import AnalyticsProvider from "@/components/AnalyticsProvider";

export const metadata: Metadata = {
  title: "S|U: Web3 University",
  description: "S|U: Web3 University",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressContentEditableWarning={true}>
      <body
        className={`antialiased w-screen overflow-hidden overflow-y-scroll`}
      >
        <WalletProvider>
          <ReduxProvider>
            <AnalyticsProvider writeKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmlnaW4iOiJodHRwczovL2FwcC5zaTMuc3BhY2UvIiwicHJvamVjdF9pZCI6ImtzOEhVX0t5S29TVThPS2o5SG01QyIsImlhdCI6MTc1NTU0MjEzMH0.5Ek4-N2UM4nESbagZk9--H5Rm2iXYlqe0UFVidqK8jk'>
              <TanstackClientProvider>
                <AuthV2Provider>
                  {children}
                  <Toaster />
                </AuthV2Provider>
              </TanstackClientProvider>
              </AnalyticsProvider>
          </ReduxProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
