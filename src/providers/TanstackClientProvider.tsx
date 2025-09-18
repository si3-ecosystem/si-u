"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { store } from "@/redux/store";
import { setUnauthenticated } from "@/redux/slice/authSliceV2";

// Helper function to check if 401 error is from main API (not external services)
const isMainApi401Error = (error: any) => {
  if (!error) return false;
  
  // Check if it's a 401 error
  const is401 = error?.status === 401 || error?.statusCode === 401;
  if (!is401) return false;
  
  // Check if the error is from our main API (not Sanity, etc.)
  const errorUrl = error?.url || error?.config?.url || '';
  const isMainApi = errorUrl.includes('/api/') || errorUrl.includes('api.si3.space');
  
  return is401 && isMainApi;
};

// Create auth-aware query client
const createAuthAwareQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error: any) => {
          // Only handle 401 errors from main API, not external services like Sanity
          if (isMainApi401Error(error)) {
            try { store.dispatch(setUnauthenticated()); } catch {}
            return false;
          }
          
          // For Sanity/external 401 errors, just don't retry but don't logout
          if (error?.status === 401 || error?.statusCode === 401) {
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
          // Only handle 401 errors from main API
          if (isMainApi401Error(error)) {
            try { store.dispatch(setUnauthenticated()); } catch {}
            return false;
          }
          
          // For external 401 errors, just don't retry
          if (error?.status === 401 || error?.statusCode === 401) {
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
