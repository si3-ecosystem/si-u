"use client";

import { useAuthInitializer } from '@/hooks/useAuthInitializer';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthInitializer();
  
  return <>{children}</>;
}
