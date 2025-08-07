/**
 * Wallet Management Service
 * Handles wallet connection and management API operations
 */

import { apiClient } from './api';
import { ApiResponse } from '@/types/rsvp';

export type WalletType = 'Zerion' | 'MetaMask' | 'WalletConnect' | 'Other';
export type NetworkType = 'Mainnet' | 'Polygon' | 'Arbitrum' | 'Base' | 'Optimism';

export interface WalletInfo {
  address?: string;
  connectedWallet?: WalletType;
  network?: NetworkType;
  connectedAt?: string;
  lastUsed?: string;
}

export interface WalletInfoResponse extends ApiResponse {
  data: {
    walletInfo: WalletInfo | null;
    isConnected: boolean;
  };
}

export interface ConnectWalletRequest {
  address: string;
  connectedWallet: WalletType;
  network: NetworkType;
}

export interface ConnectWalletResponse extends ApiResponse {
  data: {
    walletInfo: WalletInfo;
    message: string;
  };
}

export interface WalletHistoryResponse extends ApiResponse {
  data: {
    history: Array<{
      action: 'connect' | 'disconnect' | 'activity';
      timestamp: string;
      walletInfo?: WalletInfo;
    }>;
  };
}

export class WalletService {
  /**
   * Get current wallet information
   */
  static async getWalletInfo(): Promise<WalletInfoResponse> {
    const response = await apiClient.get('/user/wallet/info');
    return response.data;
  }

  /**
   * Connect a wallet
   */
  static async connectWallet(walletData: ConnectWalletRequest): Promise<ConnectWalletResponse> {
    const response = await apiClient.post('/user/wallet/connect', walletData);
    return response.data;
  }

  /**
   * Disconnect current wallet
   */
  static async disconnectWallet(): Promise<ApiResponse> {
    const response = await apiClient.delete('/user/wallet/disconnect');
    return response.data;
  }

  /**
   * Update wallet activity (mark as last used)
   */
  static async updateWalletActivity(): Promise<ApiResponse> {
    const response = await apiClient.patch('/user/wallet/activity');
    return response.data;
  }

  /**
   * Get wallet connection history
   */
  static async getWalletHistory(): Promise<WalletHistoryResponse> {
    const response = await apiClient.get('/user/wallet/history');
    return response.data;
  }

  /**
   * Validate Ethereum address format
   */
  static isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Format wallet address for display (0x1234...abcd)
   */
  static formatWalletAddress(address: string, startChars = 6, endChars = 4): string {
    if (!address || address.length < startChars + endChars) {
      return address;
    }
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  }

  /**
   * Get wallet type display name
   */
  static getWalletDisplayName(walletType: WalletType): string {
    const displayNames: Record<WalletType, string> = {
      Zerion: 'Zerion',
      MetaMask: 'MetaMask',
      WalletConnect: 'WalletConnect',
      Other: 'Other Wallet',
    };
    return displayNames[walletType] || walletType;
  }

  /**
   * Get network display name and color
   */
  static getNetworkInfo(network: NetworkType): { name: string; color: string; chainId: number } {
    const networkInfo: Record<NetworkType, { name: string; color: string; chainId: number }> = {
      Mainnet: { name: 'Ethereum Mainnet', color: 'bg-brand/10 text-brand', chainId: 1 },
      Polygon: { name: 'Polygon', color: 'bg-brand/10 text-brand', chainId: 137 },
      Arbitrum: { name: 'Arbitrum One', color: 'bg-brand/10 text-brand', chainId: 42161 },
      Base: { name: 'Base', color: 'bg-brand/10 text-brand', chainId: 8453 },
      Optimism: { name: 'Optimism', color: 'bg-brand/10 text-brand', chainId: 10 },
    };
    return networkInfo[network] || { name: network, color: 'bg-gray-100 text-gray-800', chainId: 0 };
  }

  /**
   * Get supported wallet types
   */
  static getSupportedWallets(): WalletType[] {
    return ['Zerion', 'MetaMask', 'WalletConnect', 'Other'];
  }

  /**
   * Get supported networks
   */
  static getSupportedNetworks(): NetworkType[] {
    return ['Mainnet', 'Polygon', 'Arbitrum', 'Base', 'Optimism'];
  }

  /**
   * Validate wallet connection request
   */
  static validateConnectRequest(request: ConnectWalletRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.address) {
      errors.push('Wallet address is required');
    } else if (!this.isValidEthereumAddress(request.address)) {
      errors.push('Invalid Ethereum address format');
    }

    if (!request.connectedWallet) {
      errors.push('Wallet type is required');
    } else if (!this.getSupportedWallets().includes(request.connectedWallet)) {
      errors.push('Unsupported wallet type');
    }

    if (!request.network) {
      errors.push('Network is required');
    } else if (!this.getSupportedNetworks().includes(request.network)) {
      errors.push('Unsupported network');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get wallet connection status text
   */
  static getConnectionStatusText(walletInfo: WalletInfo | null): string {
    if (!walletInfo?.address) {
      return 'No wallet connected';
    }
    return `Connected to ${this.getWalletDisplayName(walletInfo.connectedWallet || 'Other')}`;
  }

  /**
   * Check if wallet is connected
   */
  static isWalletConnected(walletInfo: WalletInfo | null): boolean {
    return !!(walletInfo?.address);
  }

  /**
   * Get time since last connection/activity
   */
  static getTimeSinceActivity(timestamp: string): string {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now.getTime() - activityTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Recently';
    }
  }
}
