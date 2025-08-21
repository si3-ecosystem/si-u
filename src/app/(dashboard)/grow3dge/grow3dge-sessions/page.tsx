"use client";
import { Banner } from "@/components/organisms/fixx/fixx-sessions/Banner";
import { Sessions } from "@/components/organisms/fixx/fixx-sessions/Sessions";
import { useFixSessions } from "@/hooks/useFixSessions";
import { useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import Loading from "@/app/loading";

export default function FixxSessionsPage() {
  const { loading, sessions } = useFixSessions();
  const [isClient, setIsClient] = useState(false);
  const currentUser = useAppSelector((state) => state.user);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if user has partner role
  const hasPartnerRole =
    isClient && (currentUser?.user?.roles?.includes("partner") || currentUser?.user?.roles?.includes("admin"));

  if (loading) return <Loading />;

  // Show access denied if user doesn't have partner role
  if (isClient && !hasPartnerRole) {
    return (
      <div className="w-full min-h-screen p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-amber-200 bg-amber-50">
            <Lock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <div className="space-y-2">
                <h3 className="font-semibold">Partner Access Required</h3>
                <p>
                  The Grow3dge Sessions are exclusively available to our partner community.
                  This space is designed for partners to access specialized content and
                  participate in partner-only sessions.
                </p>
                <p className="text-sm">
                  If you believe you should have access, please contact your account manager
                  or reach out to our support team.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full ">
      <Banner data={sessions.banner} />
      <Sessions sessions={sessions} />
    </div>
  );
}
