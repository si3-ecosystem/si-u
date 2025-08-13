/**
 * Unified Authentication Service
 * Centralized authentication management with Redux integration
 */

import { store } from '@/redux/store';
import { initializeUser, setUser, updateUserProfile, resetUser, forceUpdateUser, UserData } from '@/redux/slice/userSlice';
import { apiClient } from './api';

export interface LoginResponse {
  user: UserData;
  token: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
}

export class UnifiedAuthService {
  private static readonly TOKEN_KEY = 'si3-jwt';
  
  /**
   * Initialize authentication from stored token
   */
  static async initialize(): Promise<boolean> {
    try {
      const token = this.getStoredToken();
      if (!token) {
        console.log('[AuthService] No stored token found');
        return false;
      }

      // Validate token format
      if (!this.isValidTokenFormat(token)) {
        console.log('[AuthService] Invalid token format, clearing');
        this.clearToken();
        return false;
      }

      // Decode and validate token
      const payload = this.decodeToken(token);
      if (!payload) {
        console.log('[AuthService] Failed to decode token, clearing');
        this.clearToken();
        return false;
      }

      // Check if token is expired
      if (this.isTokenExpired(payload)) {
        console.log('[AuthService] Token expired, clearing');
        this.clearToken();
        return false;
      }

      // Initialize basic user state from token first
      const basicUserData: UserData = {
        _id: payload._id,
        email: payload.email,
        username: payload.username,
        roles: payload.roles || [],
        isVerified: payload.isVerified || false,
        wallet_address: payload.wallet_address,
        createdAt: payload.createdAt,
        updatedAt: payload.updatedAt,
      };

      console.log('[AuthService] Initializing user from token:', basicUserData);
      store.dispatch(initializeUser(basicUserData));

      // Fetch full user profile to get complete data
      try {
        console.log('[AuthService] Fetching complete user profile...');
        await this.refreshUserData();
      } catch (error) {
        console.warn('[AuthService] Failed to fetch complete profile, using token data:', error);
      }

      return true;
    } catch (error) {
      console.error('[AuthService] Error during initialization:', error);
      this.clearToken();
      return false;
    }
  }

  /**
   * Login with email and password
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      if (response.status === 'success' && response.data) {
        await this.handleAuthSuccess(response.data);
        return response.data;
      }

      throw new Error('Login failed');
    } catch (error) {
      console.error('[AuthService] Login error:', error);
      throw error;
    }
  }

  /**
   * Login with wallet signature
   */
  static async loginWithWallet(address: string, signature: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/wallet-login', {
        address,
        signature,
      });

      if (response.status === 'success' && response.data) {
        await this.handleAuthSuccess(response.data);
        return response.data;
      }

      throw new Error('Wallet login failed');
    } catch (error) {
      console.error('[AuthService] Wallet login error:', error);
      throw error;
    }
  }

  /**
   * Refresh user data from server
   */
  static async refreshUserData(): Promise<UserData> {
    try {
      const response = await apiClient.get<UserData>('/auth/me');

      if (response.status === 'success' && response.data) {
        store.dispatch(updateUserProfile(response.data));
        return response.data;
      }

      throw new Error('Failed to refresh user data');
    } catch (error) {
      console.error('[AuthService] Refresh error:', error);
      throw error;
    }
  }

  /**
   * Force refresh user data from server without field preservation
   * Use this when you want to completely replace user data (e.g., after wallet disconnect)
   */
  static async forceRefreshUserData(): Promise<UserData> {
    try {
      const response = await apiClient.get<UserData>('/auth/me');

      if (response.status === 'success' && response.data) {

        const userData = {
          ...response.data,
          isEmailVerified: response.data.isVerified ?? response.data.isVerified ?? false,
          isVerified: response.data.isVerified ?? false,
        };

        if (userData.walletInfo && !userData.walletInfo.address) {
          delete userData.walletInfo;
        }
        if (!userData.wallet_address) {
          delete userData.wallet_address;
        }

        store.dispatch(forceUpdateUser(userData));

        // If response includes a new token, update it
        if ((response.data as any).token) {
          this.setToken((response.data as any).token);
        }

        return userData;
      }

      throw new Error('Failed to refresh user data');
    } catch (error) {
      console.error('[AuthService] Force refresh error:', error);
      throw error;
    }
  }

  /**
   * Refresh JWT token after wallet operations
   * This ensures the token reflects the current user state
   */
  static async refreshToken(): Promise<void> {
    try {
      // Trigger a profile update with empty data to get a new token
      const response = await apiClient.patch<UserData>('/auth/profile', {});

      if (response.status === 'success' && response.data) {

        // Ensure proper field mapping for user data
        const userData = {
          ...response.data,
          // Map isVerified to isEmailVerified for consistency
          isEmailVerified: response.data.isVerified ?? response.data.isVerified ?? false,
          // Also keep the original isVerified field
          isVerified: response.data.isVerified ?? false,
        };

        // Clean up partial wallet data (backend sometimes returns {network: "Mainnet"} instead of null)
        if (userData.walletInfo && !userData.walletInfo.address) {
          delete userData.walletInfo;
        }
        if (!userData.wallet_address) {
          delete userData.wallet_address;
        }

        // Update user data with force update to avoid field preservation
        store.dispatch(forceUpdateUser(userData));

        // If response includes a new token, update it
        if ((response.data as any).token) {
          this.setToken((response.data as any).token);
        }
      }
    } catch (error) {
      console.error('[AuthService] Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: Partial<UserData>): Promise<UserData> {
    try {
      const response = await apiClient.patch<UserData>('/auth/profile', updates);
      
      if (response.status === 'success' && response.data) {
        
        // Use updateUserProfile to preserve critical fields
        store.dispatch(updateUserProfile(response.data));
        
        // If response includes a new token, update it
        if ((response.data as any).token) {
          this.setToken((response.data as any).token);
        }
        
        return response.data;
      }

      throw new Error('Profile update failed');
    } catch (error) {
      console.error('[AuthService] Profile update error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      // Call logout endpoint
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('[AuthService] Logout API error:', error);
    } finally {
      // Always clear local state
      this.clearToken();
      store.dispatch(resetUser());
    }
  }

  /**
   * Get current authentication state
   */
  static getAuthState(): AuthState {
    const state = store.getState();
    return {
      isAuthenticated: state.user.isLoggedIn,
      user: state.user.user,
      token: this.getStoredToken(),
    };
  }

  /**
   * Apply auth update from API responses that include token and/or user
   */
  static applyAuthUpdate(data: { token?: string; user?: UserData }): void {
    try {
      if ((data as any)?.token) {
        this.setToken((data as any).token);
      }
      if (data?.user) {
        const userData = {
          ...data.user,
          isEmailVerified: (data.user as any).isEmailVerified ?? (data.user as any).isVerified ?? false,
          isVerified: (data.user as any).isVerified ?? (data.user as any).isEmailVerified ?? false,
        } as UserData;
        store.dispatch(forceUpdateUser(userData));
      }
    } catch (e) {
      console.error('[AuthService] Failed to apply auth update', e);
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = this.getStoredToken();
    if (!token) return false;

    const payload = this.decodeToken(token);
    if (!payload) return false;

    return !this.isTokenExpired(payload);
  }

  /**
   * Handle successful authentication
   */
  private static async handleAuthSuccess(data: LoginResponse): Promise<void> {
    
    // Store token
    this.setToken(data.token);
    
    // Update user state
    store.dispatch(setUser(data.user));
  }

  /**
   * Token management methods
   */
  private static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private static getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  private static clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  private static isValidTokenFormat(token: string): boolean {
    return token.split('.').length === 3;
  }

  private static decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      return JSON.parse(atob(parts[1]));
    } catch {
      return null;
    }
  }

  private static isTokenExpired(payload: any): boolean {
    if (!payload.exp) return false;
    return payload.exp < Date.now() / 1000;
  }

  /**
   * Get auth headers for API requests
   */
  static getAuthHeaders(): Record<string, string> {
    const token = this.getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
