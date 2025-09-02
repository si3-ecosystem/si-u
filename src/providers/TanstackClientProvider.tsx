"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { store } from "@/redux/store";
import { setUnauthenticated } from "@/redux/slice/authSliceV2";

// Create auth-aware query client
const createAuthAwareQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error: any) => {
          // Don't retry on 401 errors - handle auth failure
          if (error?.status === 401 || error?.statusCode === 401) {
            console.log('[QueryClient] 401 error detected, marking unauthenticated');
            try { store.dispatch(setUnauthenticated()); } catch {}
            return false;
          }
          // Retry other errors up to 3 times
          return failureCount < 3;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      },
      mutations: {
        retry: (failureCount, error: any) => {
          // Don't retry on 401 errors
          if (error?.status === 401 || error?.statusCode === 401) {
            console.log('[QueryClient] 401 error in mutation, marking unauthenticated');
            try { store.dispatch(setUnauthenticated()); } catch {}
            return false;
          }
          // Don't retry mutations by default
          return false;
        },
      },
    },
  });
};

const queryClient = createAuthAwareQueryClient();

// Make query client globally accessible for auth service
if (typeof window !== 'undefined') {
  (window as any).__REACT_QUERY_CLIENT__ = queryClient;
}

export function TanstackClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Clear cache when unauthenticated
    const unsubscribe = store.subscribe(() => {
      const state: any = store.getState();
      if (state?.authV2?.status === 'unauthenticated') {
        console.log('[TanstackClientProvider] Clearing cache on unauthenticated');
        queryClient.clear();
      }
    });

    cleanupRef.current = unsubscribe;

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
