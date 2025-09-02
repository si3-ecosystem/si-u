"use client";

import { useCallback } from "react";
import { useSignMessage, useConnect } from "wagmi";
import { authApiV2 } from "@/services/authV2";
import { useRouter } from "next/navigation";

export function useWalletLogin(onAfterAuth?: () => void) {
  const { signMessageAsync } = useSignMessage();
  const { connect } = useConnect();
  const router = useRouter();

  const completeWalletLogin = useCallback(async (address: string) => {
    const sigReq = await authApiV2.wallet.requestSignature(address);
    const message = (sigReq as any)?.data?.message || (sigReq as any)?.data?.data?.message;
    if (!message) throw new Error("Failed to get signature message");
    const signature = await signMessageAsync({ message });
    const verifyRes = await authApiV2.wallet.verifySignature(address, signature);
    if (!verifyRes || (verifyRes as any).status !== "success") throw new Error("Wallet verification failed");
    onAfterAuth?.();
    router.replace("/home");
  }, [signMessageAsync, router, onAfterAuth]);

  const connectAndLogin = useCallback((connector: any, handlers: { onOpenChange: (open: boolean) => void; onWalletConnected?: (address: string, name: string) => void; setIsConnecting: (b: boolean) => void; setConnectionError: (m: string) => void; }) => {
    handlers.setConnectionError("");
    handlers.setIsConnecting(true);
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

