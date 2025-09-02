import { apiClient } from '@/services/api';

export interface AuthLoginEmailStartResponse {
  message: string;
}

export interface AuthLoginEmailVerifyResponse {
  user: any;
  token: string;
}

export interface AuthMeResponse {
  user: any;
}

export const authApiV2 = {
  // Email OTP start
  startEmailLogin: async (email: string) => {
    return apiClient.post<AuthLoginEmailStartResponse>('/auth/email/send-otp', { email });
  },

  // Email OTP verify
  verifyEmailLogin: async (email: string, otp: string) => {
    return apiClient.post<AuthLoginEmailVerifyResponse>('/auth/email/verify-otp', { email, otp });
  },

  // Current user
  me: async () => {
    return apiClient.get<AuthMeResponse>('/auth/me');
  },

  // Logout
  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  // Refresh profile/token
  refreshProfile: async () => {
    return apiClient.post<{ user: any; token?: string }>("/auth/refresh-profile");
  },

  // Wallet
  wallet: {
    info: async () => apiClient.get('/auth/wallet/info'),
    requestSignature: async (address: string) =>
      apiClient.post<{ message: string }>('/auth/wallet/request-signature', { wallet_address: address }),
    connectWithSignature: async (payload: { address: string; signature: string; connectedWallet: string; network: string }) =>
      apiClient.post('/auth/wallet/connect', {
        wallet_address: payload.address,
        signature: payload.signature,
        connectedWallet: payload.connectedWallet,
        network: payload.network,
      }),
    disconnect: async () => apiClient.delete('/auth/wallet/disconnect'),
  },
};

