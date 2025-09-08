"use client";

import { useCallback, useMemo } from 'react';
import { authApiV2 } from '@/services/authV2';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { mergeUser } from '@/redux/slice/authSliceV2';
import { setAllContent } from '@/redux/slice/contentSlice';
import { toast } from 'sonner';

// Helper function to process webcontent data
const processWebContent = (user: any, dispatch: any) => {
  if (user?.webcontent) {
    console.log('[useWalletV2] Processing webcontent data');
    
    const webcontent = user.webcontent;
    const contentData = {
      landing: webcontent.landing,
      slider: webcontent.slider,
      value: webcontent.value,
      live: webcontent.live,
      organizations: webcontent.organizations,
      timeline: webcontent.timeline,
      available: webcontent.available,
      socialChannels: webcontent.socialChannels,
      isNewWebpage: webcontent.isNewWebpage,
      domain: webcontent.domain
    };

    console.log('[useWalletV2] Updating content slice with webcontent data');
    dispatch(setAllContent(contentData));
  }
};

export function useWalletV2() {
  const dispatch = useAppDispatch();
  const authV2User = useAppSelector((s) => s.authV2.user);
  const legacyUser = useAppSelector((s) => s.user.user);
  const user = authV2User && (authV2User._id || authV2User.id) ? authV2User : legacyUser;

  // Normalize wallet info: prefer wallet_address as source of truth for address
  const walletInfo = useMemo(() => {
    const address = user?.wallet_address || user?.walletInfo?.address || null;
    const network = user?.walletInfo?.network || null;
    const connectedWallet = user?.walletInfo?.connectedWallet || null;
    return address ? { address, network, connectedWallet } : null;
  }, [user]);

  const isWalletConnected = !!(user?.wallet_address || user?.walletInfo?.address);
  const isEmailVerified = !!(user?.isVerified || user?.isEmailVerified);

  const reloadFromServer = useCallback(async () => {
    try {
      // Fetch canonical user and merge
      const me = await authApiV2.me();
      const res: any = me as any;
      const serverUser = res?.data?.user || res?.data?.data?.user || res?.data || null;
      if (serverUser) {
        const mergedWallet = serverUser.wallet_address || serverUser.walletInfo?.address
          ? { address: serverUser.wallet_address || serverUser.walletInfo?.address, network: serverUser.walletInfo?.network, connectedWallet: serverUser.walletInfo?.connectedWallet }
          : undefined;
        dispatch(mergeUser({ ...serverUser, _id: serverUser._id || serverUser.id, walletInfo: mergedWallet, wallet_address: mergedWallet?.address }));
        processWebContent(serverUser, dispatch);
      }
    } catch {}
  }, [dispatch]);

  const connect = useCallback(async (payload: { address: string; connectedWallet: string; network: string }) => {
    // Step 1: request signature message
    const nonceRes = await authApiV2.wallet.requestSignature(payload.address);
    const message = (nonceRes as any).data?.message || (nonceRes as any).data?.data?.message;
    if (!message) throw new Error('Failed to get signature message from server');
    // Step 2: caller should sign message outside; here we assume signature is provided separately in another UI flow
    // For settings dialog we still sign via wagmi component, which calls connectWithSignature directly
  }, []);

  const disconnect = useCallback(async () => {
    await authApiV2.wallet.disconnect();
    dispatch(mergeUser({ walletInfo: undefined, wallet_address: undefined }));
    toast.success('Wallet disconnected');
    await reloadFromServer();
  }, [dispatch, reloadFromServer]);

  return { user, walletInfo, isWalletConnected, isEmailVerified, connect, disconnect, reloadFromServer };
}

