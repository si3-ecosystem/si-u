"use client";

import { useAuthInitializer } from '@/hooks/useAuthInitializer';

/**
 * Component that initializes authentication state from stored JWT token
 * Should be included once at the app level (in layout or main component)
 */
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthInitializer();
  
  return <>{children}</>;
}
