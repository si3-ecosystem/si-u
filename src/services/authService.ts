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
      console.log('[AuthService] Initialization completed:', {
        success: result,
        userLoggedIn: store.getState().user.isLoggedIn
      });
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
      console.log('[AuthService] Decoding token:', {
        tokenLength: token.length,
        tokenStart: token.substring(0, 50) + '...',
        tokenEnd: '...' + token.substring(token.length - 50)
      });

      const payload = this.decodeToken(token);
      if (!payload) {
        console.log('[AuthService] Failed to decode token, clearing');
        this.clearToken();
        store.dispatch(initializeUser({}));
        return false;
      }

      console.log('[AuthService] Decoded token payload:', {
        _id: payload._id,
        email: payload.email,
        isVerified: payload.isVerified,
        wallet_address: payload.wallet_address,
        exp: payload.exp,
        iat: payload.iat
      });

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
        const freshUserData = await this.forceRefreshUserData();

        console.log('[AuthService] Fresh user data received:', {
          email: freshUserData.email,
          tokenEmail: basicUserData.email,
          isVerified: freshUserData.isVerified
        });

        // Check if the token data is stale compared to API data
        if (freshUserData && freshUserData.email && freshUserData.email !== basicUserData.email) {
          console.log('[AuthService] Token data is stale, forcing token refresh:', {
            tokenEmail: basicUserData.email,
            apiEmail: freshUserData.email
          });

          // Force a token refresh to get updated JWT
          await this.refreshToken();
        } else {
          console.log('[AuthService] Token data is current, no refresh needed');
        }
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
   * Request wallet signature message from backend
   */
  static async requestWalletSignature(address: string): Promise<{ data: { message: string } }> {
    try {
      console.log('[AuthService] Requesting wallet signature for address:', address);

      // Validate address before sending
      if (!address || typeof address !== 'string') {
        throw new Error('Invalid wallet address provided');
      }

      const requestBody = {
        wallet_address: address.trim(),
      };

      console.log('[AuthService] Sending request body:', requestBody);

      const response = await apiClient.post('/auth/wallet/request-signature', requestBody);

      if (response.status === 'success' && response.data) {
        return { data: response.data };
      }

      throw new Error('Failed to get signature message');
    } catch (error) {
      console.error('[AuthService] Wallet signature request error:', error);
      throw error;
    }
  }

  /**
   * Verify wallet signature and complete authentication
   */
  static async verifyWalletSignature(address: string, signature: string): Promise<{ data: any }> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/wallet/verify-signature', {
        wallet_address: address,
        signature,
      });

      if (response.status === 'success' && response.data) {
        console.log('[AuthService] Wallet verification response:', {
          hasUser: !!response.data.user,
          hasToken: !!response.data.token,
          userEmail: response.data.user?.email,
          userId: response.data.user?.id,
          user_Id: response.data.user?._id,
          fullUserData: response.data.user
        });

        // Normalize user data - ensure _id field exists
        const normalizedUser = {
          ...response.data.user,
          _id: response.data.user._id || response.data.user.id
        };

        console.log('[AuthService] Normalized user data:', {
          hasId: !!normalizedUser.id,
          has_Id: !!normalizedUser._id,
          userId: normalizedUser.id,
          user_Id: normalizedUser._id
        });

        // Apply auth update using the unified method
        this.applyAuthUpdate({ user: normalizedUser, token: response.data.token });

        console.log('[AuthService] Auth update applied, checking stored token...');
        const storedToken = this.getStoredToken();
        console.log('[AuthService] Stored token after update:', !!storedToken);

        return { data: response.data };
      }

      throw new Error('Wallet login failed');
    } catch (error) {
      console.error('[AuthService] Wallet signature verification error:', error);
      throw error;
    }
  }

  /**
   * Login with wallet signature (legacy method for backward compatibility)
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

      throw new Error('Invalid response from server');
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
      const response = await apiClient.get('/auth/me');

      console.log('[AuthService] forceRefreshUserData response:', {
        status: response.status,
        hasData: !!response.data,
        dataStructure: response.data ? Object.keys(response.data) : 'no data'
      });

      if (response.status === 'success' && response.data) {
        // Handle the correct API response structure: { status: 'success', data: { user: {...} } }
        const rawUserData = response.data.user || response.data;

        console.log('[AuthService] Raw user data from API:', {
          email: rawUserData.email,
          isVerified: rawUserData.isVerified,
          hasId: !!(rawUserData._id || rawUserData.id)
        });

        const userData = {
          ...rawUserData,
          _id: rawUserData._id || rawUserData.id, // Ensure _id field exists
          isEmailVerified: rawUserData.isVerified ?? false,
          isVerified: rawUserData.isVerified ?? false,
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
   * Send email OTP for login
   */
  static async sendEmailOTP(email: string): Promise<ApiResponse> {
    try {
      console.log('[AuthService] Sending email OTP to:', email);

      const response = await apiClient.post('/auth/email/send-otp', {
        email: email.trim()
      });

      console.log('[AuthService] Email OTP sent successfully');
      return response;
    } catch (error) {
      console.error('[AuthService] Send email OTP error:', error);
      throw error;
    }
  }

  /**
   * Send email verification OTP to current user's email
   */
  static async sendEmailVerification(): Promise<ApiResponse> {
    try {
      console.log('[AuthService] Sending verification to current user email');

      const response = await apiClient.post('/auth/send-verification');

      console.log('[AuthService] Email verification sent successfully');
      return response;
    } catch (error) {
      console.error('[AuthService] Send email verification error:', error);
      throw error;
    }
  }

  /**
   * Send email verification OTP to a new email address
   */
  static async sendEmailVerificationToNewEmail(email: string): Promise<ApiResponse> {
    try {
      console.log('[AuthService] Sending verification to new email:', email);

      const response = await apiClient.post('/auth/send-verification-new-email', {
        email: email.trim()
      });

      console.log('[AuthService] New email verification sent successfully');
      return response;
    } catch (error) {
      console.error('[AuthService] Send new email verification error:', error);
      throw error;
    }
  }

  /**
   * Verify email with OTP code
   */
  static async verifyEmail(otp: string): Promise<ApiResponse> {
    try {
      console.log('[AuthService] Verifying email with OTP');

      const response = await apiClient.post('/auth/verify-email', {
        otp: otp.trim()
      });

      if (response.status === 'success' && response.data) {
        // Refresh user data after successful verification
        await this.forceRefreshUserData();
        console.log('[AuthService] Email verified successfully');
      }

      return response;
    } catch (error) {
      console.error('[AuthService] Email verification error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  static async logout(options: { redirect?: boolean } = { redirect: false }): Promise<void> {
    try {
      // Call logout endpoint
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('[AuthService] Logout API error:', error);
    } finally {
      // Clear all authentication data
      this.clearAllAuthData();

      // Optionally redirect to login page
      if (options.redirect && typeof window !== 'undefined') {
        console.log('[AuthService] Redirecting to login page after logout');
        window.location.href = '/login';
      }
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

      // Clear auth-related cookies with all possible path combinations
      const cookiesToClear = ['si3-jwt', 'auth-token', 'token'];
      const paths = ['/', '/login', '/dashboard', '/admin', '/profile', '/settings'];
      const domains = [window.location.hostname, `.${window.location.hostname}`, 'localhost'];

      cookiesToClear.forEach(cookieName => {
        paths.forEach(path => {
          domains.forEach(domain => {
            // Clear with domain
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; SameSite=Lax;`;
            // Clear without domain
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Lax;`;
          });
        });

        // Also clear with no path specified
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax;`;
      });

      console.log('[AuthService] All cookies and storage cleared');
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

  // Removed duplicate applyAuthUpdate method - using the unified one below

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
      // Store in localStorage
      localStorage.setItem(this.TOKEN_KEY, token);

      // Also store in cookie for middleware consistency
      const expires = new Date();
      expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
      document.cookie = `${this.TOKEN_KEY}=${encodeURIComponent(token)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

      console.log('[AuthService] Token stored in both localStorage and cookie');
    }
  }

  private static getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      // First check localStorage
      const localStorageToken = localStorage.getItem(this.TOKEN_KEY);
      if (localStorageToken) {
        return localStorageToken;
      }

      // If not in localStorage, check cookies as fallback
      const cookieToken = this.getTokenFromCookie();
      if (cookieToken) {
        console.log('[AuthService] Found token in cookie, syncing to localStorage');
        // Sync cookie token to localStorage for consistency
        localStorage.setItem(this.TOKEN_KEY, cookieToken);
        return cookieToken;
      }
    }
    return null;
  }

  /**
   * Check if token data is stale compared to API data
   */
  static async isTokenDataStale(): Promise<boolean> {
    try {
      const token = this.getStoredToken();
      if (!token) return false;

      const payload = this.decodeToken(token);
      if (!payload) return false;

      // Fetch current data from API
      const response = await apiClient.get('/auth/me');
      if (response.data?.status === 'success' && response.data?.data) {
        const apiData = response.data.data;

        // Compare key fields
        const isStale = (
          payload.email !== apiData.email ||
          payload.isVerified !== apiData.isVerified ||
          payload.wallet_address !== apiData.wallet_address
        );

        if (isStale) {
          console.log('[AuthService] Token data is stale:', {
            tokenEmail: payload.email,
            apiEmail: apiData.email,
            tokenVerified: payload.isVerified,
            apiVerified: apiData.isVerified
          });
        }

        return isStale;
      }

      return false;
    } catch (error) {
      console.warn('[AuthService] Failed to check token staleness:', error);
      return false;
    }
  }

  /**
   * Get token from cookie as fallback
   */
  private static getTokenFromCookie(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === this.TOKEN_KEY && value) {
          return decodeURIComponent(value);
        }
      }
    } catch (error) {
      console.error('[AuthService] Error reading token from cookie:', error);
    }

    return null;
  }

  private static clearToken(): void {
    if (typeof window !== 'undefined') {
      // Clear from localStorage
      localStorage.removeItem(this.TOKEN_KEY);

      // Clear from cookie
      document.cookie = `${this.TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;

      console.log('[AuthService] Token cleared from both localStorage and cookie');
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
    console.log('[AuthService] Getting auth headers:', {
      hasToken: !!token,
      tokenLength: token?.length,
      environment: process.env.NODE_ENV
    });
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
      console.log('[AuthService] Dispatching forceUpdateUser with:', {
        hasId: !!authData.user._id,
        userId: authData.user._id,
        userEmail: authData.user.email
      });
      store.dispatch(forceUpdateUser(authData.user));

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
   * Force clear all cached data and reinitialize from API
   */
  static async forceClearAndReinitialize(): Promise<boolean> {
    try {
      console.log('[AuthService] Force clearing all cached data and reinitializing...');

      // Clear Redux state first
      store.dispatch(resetUser());

      // Clear any cached data
      this.invalidateUserCache();

      // Get fresh token and data from API
      const token = this.getStoredToken();
      if (!token) {
        console.log('[AuthService] No token found for reinitialization');
        return false;
      }

      // Fetch fresh user data directly from API
      const response = await apiClient.get('/auth/me');

      console.log('[AuthService] forceClearAndReinitialize API response:', {
        status: response.status,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : 'no data',
        hasUser: !!(response.data?.user),
        hasDirectData: !!(response.data?.data)
      });

      if (response.status === 'success' && response.data) {
        // Handle the correct API response structure: { status: 'success', data: { user: {...} } }
        const freshUserData = response.data.user || response.data.data || response.data;

        if (!freshUserData) {
          console.error('[AuthService] No user data found in API response:', response.data);
          throw new Error('No user data found in API response');
        }

        // Normalize the user data (ensure _id field exists)
        const normalizedUser = {
          ...freshUserData,
          _id: freshUserData._id || freshUserData.id
        };

        console.log('[AuthService] Reinitializing with fresh API data:', {
          email: normalizedUser.email,
          isVerified: normalizedUser.isVerified,
          hasId: !!normalizedUser._id,
          dataSource: response.data.user ? 'response.data.user' : response.data.data ? 'response.data.data' : 'response.data'
        });

        // Force update with fresh data
        store.dispatch(forceUpdateUser(normalizedUser));

        // Emit refresh event
        this.emitAuthEvent('refresh', normalizedUser);

        console.log('[AuthService] Force reinitialization completed successfully');
        return true;
      }

      throw new Error(`Failed to get fresh user data - API returned status: ${response.status}`);
    } catch (error) {
      console.error('[AuthService] Force reinitialization failed:', error);
      return false;
    }
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
