"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useFormo } from "@formo/analytics";

export function AnalyticsWrapper() {
  const { address } = useAccount();
  const analytics = useFormo();

  useEffect(() => {
    if (address && analytics) {
      analytics.identify({ address });
    }
  }, [address, analytics]);

  return null;
}
