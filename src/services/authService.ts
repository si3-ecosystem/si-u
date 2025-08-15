/**
 * Unified Authentication Service
 * Centralized authentication management with Redux integration
 */

import { store } from '@/redux/store';
import { initializeUser, setUser, updateUserProfile, resetUser, forceUpdateUser, UserData } from '@/redux/slice/userSlice';
import { apiClient } from './api';
import { AuthCacheManager } from '@/utils/authCacheManager';

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
  private static isInitializing = false;
  private static initializationPromise: Promise<boolean> | null = null;

  /**
   * Initialize authentication from stored token
   * Prevents race conditions by ensuring only one initialization at a time
   */
  static async initialize(): Promise<boolean> {
    // If already initializing, return the existing promise
    if (this.isInitializing && this.initializationPromise) {
      console.log('[AuthService] Initialization already in progress, waiting...');
      return this.initializationPromise;
    }

    // Check if already initialized
    const state = store.getState();
    if (state.user.isInitialized) {
      console.log('[AuthService] Already initialized, skipping');
      return true;
    }

    // Start initialization
    this.isInitializing = true;
    this.initializationPromise = this.performInitialization();

    try {
      const result = await this.initializationPromise;
      return result;
    } finally {
      this.isInitializing = false;
      this.initializationPromise = null;
    }
  }

  /**
   * Perform the actual initialization logic
   */
  private static async performInitialization(): Promise<boolean> {
    try {
      const token = this.getStoredToken();
      if (!token) {
        console.log('[AuthService] No stored token found');
        // Mark as initialized even if no token
        store.dispatch(initializeUser({}));
        return false;
      }

      // Validate token format
      if (!this.isValidTokenFormat(token)) {
        console.log('[AuthService] Invalid token format, clearing');
        this.clearToken();
        store.dispatch(initializeUser({}));
        return false;
      }

      // Decode and validate token
      const payload = this.decodeToken(token);
      if (!payload) {
        console.log('[AuthService] Failed to decode token, clearing');
        this.clearToken();
        store.dispatch(initializeUser({}));
        return false;
      }

      // Check if token is expired
      if (this.isTokenExpired(payload)) {
        console.log('[AuthService] Token expired, clearing');
        this.clearToken();
        store.dispatch(initializeUser({}));
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
      store.dispatch(initializeUser({}));
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
      // Clear all authentication data
      this.clearAllAuthData();
    }
  }

  /**
   * Clear all authentication data and state
   */
  static clearAllAuthData(): void {
    // Clear token
    this.clearToken();

    // Reset Redux state
    store.dispatch(resetUser());

    // Clear all localStorage auth-related data
    if (typeof window !== 'undefined') {
      // Clear any other auth-related localStorage items
      const keysToRemove = ['si3-jwt', 'si3-token', 'user-preferences', 'auth-state'];
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      // Clear sessionStorage
      sessionStorage.clear();

      // Clear auth-related cookies
      document.cookie = 'si3-jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    // Clear React Query cache if available
    this.clearQueryCache();

    // Emit logout event for other components to listen
    this.emitAuthEvent('logout');
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
    // Use unified auth update method
    this.applyAuthUpdate({ user: data.user, token: data.token });
  }

  /**
   * Invalidate user-specific cache
   */
  private static invalidateUserCache(): void {
    try {
      if (typeof window !== 'undefined' && (window as any).__REACT_QUERY_CLIENT__) {
        const queryClient = (window as any).__REACT_QUERY_CLIENT__;
        AuthCacheManager.invalidateUserSpecificCache(queryClient);
        console.log('[AuthService] User-specific cache invalidated for new login');
      }
    } catch (error) {
      console.warn('[AuthService] Could not invalidate user cache:', error);
    }
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

  /**
   * Clear React Query cache
   */
  private static clearQueryCache(): void {
    try {
      // Try to get the global query client and clear user-specific cache
      if (typeof window !== 'undefined' && (window as any).__REACT_QUERY_CLIENT__) {
        const queryClient = (window as any).__REACT_QUERY_CLIENT__;
        AuthCacheManager.clearUserSpecificCache(queryClient);
        console.log('[AuthService] User-specific React Query cache cleared');
      }
    } catch (error) {
      console.warn('[AuthService] Could not clear React Query cache:', error);
    }
  }

  /**
   * Emit authentication events
   */
  private static emitAuthEvent(event: 'login' | 'logout' | 'refresh', data?: any): void {
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(`auth:${event}`, { detail: data }));
        console.log(`[AuthService] Emitted auth:${event} event`);
      }
    } catch (error) {
      console.warn('[AuthService] Could not emit auth event:', error);
    }
  }

  /**
   * Listen to authentication events
   */
  static onAuthEvent(event: 'login' | 'logout' | 'refresh', handler: (data?: any) => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const eventHandler = (e: CustomEvent) => handler(e.detail);
    window.addEventListener(`auth:${event}`, eventHandler as EventListener);

    // Return cleanup function
    return () => {
      window.removeEventListener(`auth:${event}`, eventHandler as EventListener);
    };
  }

  /**
   * Apply authentication update - unified method for all auth state changes
   * This ensures consistent state updates across Redux, cache, and events
   */
  static applyAuthUpdate(authData: { user: UserData; token: string }): void {
    try {
      console.log('[AuthService] Applying unified auth update:', authData.user);

      // 1. Update token storage
      this.setToken(authData.token);

      // 2. Update Redux state
      store.dispatch(setUser(authData.user));

      // 3. Invalidate user-specific cache for new user data
      this.invalidateUserCache();

      // 4. Emit login event for components to react
      this.emitAuthEvent('login', authData.user);

      console.log('[AuthService] Auth update applied successfully');
    } catch (error) {
      console.error('[AuthService] Error applying auth update:', error);
    }
  }

  /**
   * Get current authentication state
   */
  static getAuthState(): { user: UserData | null; isAuthenticated: boolean; token: string | null } {
    const state = store.getState();
    const token = this.getStoredToken();

    return {
      user: state.user.user,
      isAuthenticated: this.isAuthenticated(),
      token,
    };
  }

  /**
   * Force refresh user data and update all state
   */
  static async forceRefreshAuth(): Promise<boolean> {
    try {
      console.log('[AuthService] Force refreshing auth state...');

      const token = this.getStoredToken();
      if (!token) {
        console.log('[AuthService] No token found for refresh');
        return false;
      }

      // Fetch fresh user data
      const response = await apiClient.get('/auth/me');
      if (response.data?.status === 'success' && response.data?.data) {
        const userData = response.data.data;

        // Apply unified update
        this.applyAuthUpdate({ user: userData, token });

        // Emit refresh event
        this.emitAuthEvent('refresh', userData);

        console.log('[AuthService] Auth state refreshed successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error('[AuthService] Error refreshing auth state:', error);
      return false;
    }
  }
}
