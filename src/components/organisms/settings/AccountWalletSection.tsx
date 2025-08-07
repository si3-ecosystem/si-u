"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/redux/store';
import { Wallet, Copy, Loader2, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { WalletService, WalletInfo } from '@/services/walletService';

interface AccountWalletSectionProps {
  onDisconnectWallet?: () => void;
}

export function AccountWalletSection({ onDisconnectWallet }: AccountWalletSectionProps) {
  const currentUser = useAppSelector(state => state.user);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWalletInfo();
  }, []);

  useEffect(() => {
    if (currentUser?.user?.walletInfo) {
      setWalletInfo(currentUser.user.walletInfo);
      setIsLoading(false);
    } else if (currentUser?.user?.wallet_address) {
      setWalletInfo({
        address: currentUser.user.wallet_address,
        connectedWallet: 'Other',
        network: 'Mainnet'
      });
      setIsLoading(false);
    } else if (currentUser?.user) {
      setWalletInfo(null);
      setIsLoading(false);
    }
  }, [currentUser?.user?.walletInfo, currentUser?.user?.wallet_address, currentUser?.user]);

  const loadWalletInfo = async () => {
    if (currentUser?.user?.walletInfo || currentUser?.user?.wallet_address) {
      console.log('Using existing wallet data from user profile');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      try {
        const response = await WalletService.getWalletInfo();
        if (response.status === 'success') {
          setWalletInfo(response.data.walletInfo);
          return;
        }
      } catch (apiError: any) {
        console.log('Wallet API endpoint failed:', apiError);

        // Don't show error if we have local data
        if (currentUser?.user?.walletInfo || currentUser?.user?.wallet_address) {
          return;
        }

        // Only show error if we have no wallet data at all
        if (apiError?.statusCode === 401) {
          setError('Please verify your email to access wallet information');
        } else {
          setError('Failed to load wallet information');
        }
      }

    } catch (error: any) {
      console.error('Failed to load wallet info:', error);
      if (!currentUser?.user?.walletInfo && !currentUser?.user?.wallet_address) {
        setError('Failed to load wallet information');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectWallet = async () => {
    if (!walletInfo?.address) return;

    setIsDisconnecting(true);
    try {
      const response = await WalletService.disconnectWallet();
      if (response.status === 'success') {
        setWalletInfo(null);
        toast.success('Wallet disconnected successfully');
        onDisconnectWallet?.();
      } else {
        throw new Error('Failed to disconnect wallet');
      }
    } catch (error: any) {
      console.error('Failed to disconnect wallet:', error);

      setWalletInfo(null);

      if (error?.statusCode === 401) {
        toast.warning('Wallet disconnected locally. Please verify your email to sync with server.');
      } else {
        toast.warning('Wallet disconnected locally. Server sync failed.');
      }

      onDisconnectWallet?.();
    } finally {
      setIsDisconnecting(false);
    }
  };

  const copyWalletAddress = () => {
    if (walletInfo?.address) {
      navigator.clipboard.writeText(walletInfo.address);
      toast.success('Wallet address copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Account & Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading wallet information...</span>
        </CardContent>
      </Card>
    );
  }

  const networkInfo = walletInfo?.network ? WalletService.getNetworkInfo(walletInfo.network) : null;
  const isWalletConnected = WalletService.isWalletConnected(walletInfo);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Account & Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        )}

        {/* Wallet Address */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Wallet Address</label>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">
                  {isWalletConnected ? (
                    <>
                      eth: <span className="text-gray-500 font-mono">
                        {WalletService.formatWalletAddress(walletInfo!.address!)}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500">No wallet connected</span>
                  )}
                </p>
                {isWalletConnected && (
                  <>
                    <button
                      onClick={copyWalletAddress}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                      title="Copy wallet address"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <a
                      href={`https://etherscan.io/address/${walletInfo!.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                      title="View on Etherscan"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {WalletService.getConnectionStatusText(walletInfo)}
              </p>
            </div>
          </div>
        </div>

        {/* Connected Wallet */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Connected Wallet</label>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {isWalletConnected ?
                  WalletService.getWalletDisplayName(walletInfo!.connectedWallet!) :
                  'No wallet connected'
                }
              </p>
              {isWalletConnected && (
                <Badge variant="secondary" className="text-xs">
                  Connected
                </Badge>
              )}
            </div>
            {walletInfo?.connectedAt && (
              <p className="text-xs text-gray-500 mt-1">
                Connected {WalletService.getTimeSinceActivity(walletInfo.connectedAt)}
              </p>
            )}
          </div>
        </div>

        {/* Network */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Network</label>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {networkInfo?.name || walletInfo?.network || 'Unknown'}
              </p>
              {networkInfo && (
                <Badge className={networkInfo.color}>
                  {walletInfo?.network}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2 overflow-hidden">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {currentUser?.user?.email || 'No email set'}
              </p>
              {currentUser?.user?.isVerified ? (
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-brand" />
                  <span className="text-xs text-brand">Verified</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-orange-600">Not verified</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Username</label>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium">
              {currentUser?.user?.username || currentUser?.user?.name || 'No username set'}
            </p>
          </div>
        </div>

        {/* Disconnect Wallet Button */}
        {isWalletConnected && (
          <Button
            variant="destructive"
            className="w-full bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800"
            onClick={handleDisconnectWallet}
            disabled={isDisconnecting}
          >
            {isDisconnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Disconnecting...
              </>
            ) : (
              'Disconnect Wallet'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
