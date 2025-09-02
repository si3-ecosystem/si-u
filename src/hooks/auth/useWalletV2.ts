"use client";

import { useCallback, useMemo } from 'react';
import { authApiV2 } from '@/services/authV2';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { mergeUser } from '@/redux/slice/authSliceV2';
import { toast } from 'sonner';

export function useWalletV2() {
  const dispatch = useAppDispatch();
  const user = (useAppSelector((s) => (s as any).authV2.user));

  const walletInfo = useMemo(() => user?.walletInfo || (user?.wallet_address ? { address: user.wallet_address } : null), [user]);
  const isWalletConnected = !!walletInfo?.address;
  const isEmailVerified = !!(user?.isVerified || user?.isEmailVerified);

  const reloadFromServer = useCallback(async () => {
    try {
      const info = await authApiV2.wallet.info();
      const data = (info as any).data?.walletInfo ?? (info as any).data?.data?.walletInfo ?? null;
      dispatch(mergeUser({ walletInfo: data, wallet_address: data?.address }));
    } catch {}
  }, [dispatch]);

  const connect = useCallback(async (payload: { address: string; connectedWallet: string; network: string }) => {
    const res = await authApiV2.wallet.connect(payload);
    const data = (res as any).data?.walletInfo ?? (res as any).data?.data?.walletInfo;
    dispatch(mergeUser({ walletInfo: data, wallet_address: data?.address }));
    toast.success('Wallet connected');
    await reloadFromServer();
  }, [dispatch, reloadFromServer]);

  const disconnect = useCallback(async () => {
    await authApiV2.wallet.disconnect();
    dispatch(mergeUser({ walletInfo: undefined, wallet_address: undefined }));
    toast.success('Wallet disconnected');
    await reloadFromServer();
  }, [dispatch, reloadFromServer]);

  return { user, walletInfo, isWalletConnected, isEmailVerified, connect, disconnect, reloadFromServer };
}

