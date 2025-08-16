"use client";

import { useAuthInitializer } from '@/hooks/useAuthInitializer';
import { useEffect, useState } from 'react';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useAuthInitializer();

  // Ensure client-side rendering to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // During SSR, render children immediately to prevent hydration mismatch
  if (!isClient) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
