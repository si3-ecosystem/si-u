"use client";

import { useCallback } from "react";
import { useSignMessage, useConnect, useDisconnect } from "wagmi";
import { useAppDispatch } from "@/redux/store";
import { setAuthenticated } from "@/redux/slice/authSliceV2";
import { authApiV2 } from "@/services/authV2";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function useWalletLogin(onAfterAuth?: () => void) {
  const { signMessageAsync } = useSignMessage();
  const { connect } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const completeWalletLogin = useCallback(async (address: string) => {
    const sigReq = await authApiV2.wallet.requestSignature(address);
    const message = (sigReq as any)?.data?.message || (sigReq as any)?.data?.data?.message;
    if (!message) throw new Error("Failed to get signature message");
    const signature = await signMessageAsync({ message });
    const verifyRes = await authApiV2.wallet.verifySignature(address, signature);
    if (!verifyRes || (verifyRes as any).status !== "success") throw new Error("Wallet verification failed");

    // Ensure client auth state has the latest user before navigating
    try {
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      const fresh = await queryClient.fetchQuery({ queryKey: ['auth', 'me'], queryFn: authApiV2.me, retry: false });
      const user = (fresh as any)?.data?.user || (fresh as any)?.data?.data?.user || (fresh as any)?.data || null;
      if (user?._id || user?.id) {
        dispatch(setAuthenticated({ ...user, _id: user._id || user.id }));
      }
    } catch {}

    onAfterAuth?.();
    router.replace("/home");
  }, [signMessageAsync, router, onAfterAuth, queryClient, dispatch]);

  const connectAndLogin = useCallback((connector: any, handlers: { onOpenChange: (open: boolean) => void; onWalletConnected?: (address: string, name: string) => void; setIsConnecting: (b: boolean) => void; setConnectionError: (m: string) => void; }) => {
    handlers.setConnectionError("");
    handlers.setIsConnecting(true);
    // Ensure no existing connector session persists
    (async () => { try { await disconnectAsync(); } catch {} })();
    connect({ connector }, {
      onSuccess: async (data) => {
        const first = data.accounts[0];
        try {
          await completeWalletLogin(first);
        } finally {
          try { handlers.onWalletConnected?.(first, connector.name); } catch {}
          handlers.setIsConnecting(false);
          handlers.onOpenChange(false);
        }
      },
      onError: (error) => {
        handlers.setIsConnecting(false);
        handlers.setConnectionError(error.message || "Failed to connect wallet. Please try again.");
      }
    });
  }, [connect, completeWalletLogin]);

  return { connectAndLogin };
}

