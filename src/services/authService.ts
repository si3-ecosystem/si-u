/**
 * Unified Authentication Service
 * Centralized authentication management with Redux integration
 */

import { store } from '@/redux/store';
import { initializeUser, updateUserProfile, resetUser, forceUpdateUser, UserData } from '@/redux/slice/userSlice';
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
      console.log('🔄 [AuthService] updateProfile called with:', updates);
      const response = await apiClient.patch<UserData>('/auth/profile', updates);
      
      console.log('📝 [AuthService] updateProfile response:', {
        status: response.status,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : 'no data',
        username: response.data?.username,
        email: response.data?.email
      });
      
      if (response.status === 'success' && response.data) {
        console.log('✅ [AuthService] Dispatching updateUserProfile with:', response.data);
        
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
      console.error('❌ [AuthService] Profile update error:', error);
      throw error;
    }
  }

  /**
   * Send email OTP for login
   */
  static async sendEmailOTP(email: string): Promise<ApiResponse> {
    try {

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
   * Verify email OTP for login (alias method for compatibility)
   */
  static async verifyEmailOTP(email: string, otp: string): Promise<ApiResponse> {
    try {

      const response = await apiClient.post('/auth/email/verify-otp', {
        email: email.trim(),
        otp: otp.trim()
      });

      if (response.status === 'success' && response.data) {
        console.log('[AuthService] Email OTP verification response:', {
          hasUser: !!response.data.user,
          hasToken: !!response.data.token,
          userEmail: response.data.user?.email,
          userId: response.data.user?.id,
          user_Id: response.data.user?._id,
        });

        // Normalize user data - ensure _id field exists
        const normalizedUser = {
          ...response.data.user,
          _id: response.data.user._id || response.data.user.id
        };

        // Apply auth update using the unified method
        this.applyAuthUpdate({ user: normalizedUser, token: response.data.token });
        
        // Force re-initialization to ensure auth state is properly set
        setTimeout(() => {
          this.initialize().then((success) => {
            console.log('[AuthService] Re-initialization after OTP result:', success);
          });
        }, 100);

      }

      return response;
    } catch (error) {
      console.error('[AuthService] Email OTP verification error:', error);
      throw error;
    }
  }

  /**
   * Logout user with comprehensive cleanup
   */
  static async logout(options: { redirect?: boolean } = { redirect: true }): Promise<void> {
    
    try {
      // Try to call logout endpoint, but don't fail if it doesn't work
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('[AuthService] Logout API error (continuing with cleanup):', error);
      // Continue with cleanup even if API call fails
    }
    
    try {
      // Always clear all authentication data regardless of API response
      this.clearAllAuthData();
    } catch (error) {
      console.error('[AuthService] Error during data cleanup:', error);
      // Force manual cleanup as fallback
      this.forceManualCleanup();
    }

    // Additional cleanup using TokenCleanup utility for maximum reliability
    try {
      const { TokenCleanup } = await import('@/utils/tokenCleanup');
      TokenCleanup.clearEverything();
    } catch (importError) {
      console.warn('[AuthService] Could not import TokenCleanup, using fallback cleanup:', importError);
      // Fallback to manual cleanup if import fails
      this.forceManualCleanup();
    }

    // Verify cleanup was successful
    if (typeof window !== 'undefined') {
      const remainingTokens = this.checkForRemainingTokens();
      if (remainingTokens.length > 0) {
        console.warn('[AuthService] Found remaining tokens after cleanup:', remainingTokens);
        // Force clear any remaining tokens
        this.forceManualCleanup();
      } else {
        console.log('[AuthService] Cleanup verification successful - no tokens remaining');
      }
    }

    // Handle redirect (default to true as per memory requirement)
    if (options.redirect && typeof window !== 'undefined') {
      
      // Add a small delay to ensure all cleanup is complete
      setTimeout(() => {
        // Use window.location.replace() to prevent back navigation as per memory
        window.location.replace('/login');
      }, 100);
    }
    
  }

  /**
   * Force manual cleanup as ultimate fallback
   */
  private static forceManualCleanup(): void {
    
    if (typeof window !== 'undefined') {
      try {
        // Force clear localStorage
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key) {
            localStorage.removeItem(key);
          }
        }
        
        // Force clear sessionStorage
        for (let i = sessionStorage.length - 1; i >= 0; i--) {
          const key = sessionStorage.key(i);
          if (key) {
            sessionStorage.removeItem(key);
          }
        }
        
        // Force clear all cookies
        document.cookie.split(';').forEach((cookie) => {
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          if (name) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
          }
        });
        
      } catch (error) {
        console.error('[AuthService] Error in force manual cleanup:', error);
      }
    }
    
    // Force reset Redux state
    try {
      store.dispatch(resetUser());
    } catch (error) {
      console.error('[AuthService] Error resetting Redux state:', error);
    }
  }

  /**
   * Check for remaining tokens in storage (verification method)
   */
  private static checkForRemainingTokens(): string[] {
    if (typeof window === 'undefined') return [];
    
    const remainingTokens: string[] = [];
    
    // Check localStorage
    const possibleTokenKeys = [
      'si3-jwt', 'si3-token', 'token', 'auth-token', 
      'refresh-token', 'session-token', 'access-token', 
      'user-token', 'authentication', 'authorization'
    ];
    
    possibleTokenKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        remainingTokens.push(`localStorage:${key}`);
      }
    });
    
    // Check sessionStorage
    possibleTokenKeys.forEach(key => {
      if (sessionStorage.getItem(key)) {
        remainingTokens.push(`sessionStorage:${key}`);
      }
    });
    
    // Check cookies
    possibleTokenKeys.forEach(key => {
      if (document.cookie.includes(`${key}=`)) {
        remainingTokens.push(`cookie:${key}`);
      }
    });
    
    return remainingTokens;
  }
  static clearAllAuthData(): void {
    // Clear token using the existing method
    this.clearToken();

    // Reset Redux state
    store.dispatch(resetUser());

    if (typeof window !== 'undefined') {
      // Use TokenCleanup utility for comprehensive cleanup
      try {
        // Import TokenCleanup synchronously
        import('@/utils/tokenCleanup').then(({ TokenCleanup }) => {
          // Clear all tokens and storage
          TokenCleanup.clearAllTokensFromLocalStorage();
          TokenCleanup.clearAllAuthDataFromLocalStorage();
          TokenCleanup.clearAllSessionStorage();
          TokenCleanup.clearAllAuthCookies();
          
        }).catch((importError) => {
          console.warn('[AuthService] Could not import TokenCleanup:', importError);
        });
        
        // Force clear entire localStorage as backup (immediate)
        localStorage.clear();
        
      } catch (error) {
        console.warn('[AuthService] TokenCleanup utility not available, using fallback cleanup:', error);
        
        // Fallback to manual cleanup if TokenCleanup fails
        try {
          // First, get all localStorage keys to log what we're clearing
          const localStorageKeys = Object.keys(localStorage);
          console.log('[AuthService] Clearing localStorage keys:', localStorageKeys);
          
          // Clear all localStorage completely
          localStorage.clear();
          
        } catch (localStorageError) {
          console.error('[AuthService] Error clearing localStorage:', localStorageError);
          // Fallback: clear known auth-related keys
          const keysToRemove = [
            'si3-jwt', 
            'si3-token', 
            'token', 
            'user-preferences', 
            'auth-state',
            'diversityTrackerChartShown',
            'user-data',
            'auth-token',
            'refresh-token',
            'session-data'
          ];
          keysToRemove.forEach(key => {
            try {
              localStorage.removeItem(key);
            } catch (keyError) {
              console.warn(`[AuthService] Could not remove localStorage key: ${key}`, keyError);
            }
          });
        }

        // Clear ALL sessionStorage (comprehensive approach)
        try {
          const sessionStorageKeys = Object.keys(sessionStorage);
          console.log('[AuthService] Clearing sessionStorage keys:', sessionStorageKeys);
          
          sessionStorage.clear();
          
          console.log('[AuthService] All sessionStorage cleared');
        } catch (sessionStorageError) {
          console.error('[AuthService] Error clearing sessionStorage:', sessionStorageError);
        }

        // Clear auth-related cookies with comprehensive approach
        this.clearAllAuthCookies();
      }

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
      const cookieValue = `${this.TOKEN_KEY}=${encodeURIComponent(token)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
      document.cookie = cookieValue;
      
      console.log('[AuthService] Token stored in cookie:', {
        cookieSet: cookieValue.substring(0, 50) + '...',
        expires: expires.toUTCString()
      });
      
      // Verify cookie was set
      setTimeout(() => {
        const cookieCheck = this.getTokenFromCookie();
        console.log('[AuthService] Cookie verification:', {
          cookieRetrieved: !!cookieCheck,
          cookiesMatch: cookieCheck === token,
          allCookies: document.cookie.split(';').map(c => c.trim().split('=')[0])
        });
      }, 100);

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

  /**
   * Comprehensive cookie clearing method
   */
  private static clearAllAuthCookies(): void {
    if (typeof window === 'undefined') return;

    try {
      // List of all possible cookie names that might contain auth data
      const cookiesToClear = [
        'si3-jwt', 
        'auth-token', 
        'token',
        'si3-token',
        'refresh-token',
        'session-token',
        'access-token',
        'user-token',
        'authentication',
        'authorization'
      ];
      
      // List of all possible paths where cookies might be stored
      const paths = [
        '/', 
        '/login', 
        '/dashboard', 
        '/admin', 
        '/profile', 
        '/settings',
        '/guides',
        '/scholars',
        '/grow3dge',
        '/communities'
      ];
      
      // List of possible domains
      const domains = [
        window.location.hostname, 
        `.${window.location.hostname}`, 
        'localhost',
        '.localhost'
      ];

      // Clear cookies with all possible combinations
      cookiesToClear.forEach(cookieName => {
        // Clear with all path/domain combinations
        paths.forEach(path => {
          domains.forEach(domain => {
            // Clear with domain
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; SameSite=Lax;`;
            // Clear without domain
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Lax;`;
          });
        });

        // Also clear with no path/domain specified (catch-all)
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax;`;
        document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax;`;
      });

      console.log('[AuthService] All auth cookies cleared with comprehensive approach');
    } catch (error) {
      console.error('[AuthService] Error clearing cookies:', error);
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
  /**
   * Clear React Query cache comprehensively
   */
  private static clearQueryCache(): void {
    try {
      // Try multiple approaches to clear React Query cache
      
      // Method 1: Use global query client if available
      if (typeof window !== 'undefined' && (window as any).__REACT_QUERY_CLIENT__) {
        const queryClient = (window as any).__REACT_QUERY_CLIENT__;
        
        // Clear all queries
        queryClient.clear();
        
        // Clear user-specific cache
        AuthCacheManager.clearUserSpecificCache(queryClient);
        
        console.log('[AuthService] React Query cache cleared via global client');
      }
      
      // Method 2: Use AuthCacheManager directly
      if (typeof window !== 'undefined') {
        try {
          // Try to clear cache using any available query client
          const possibleClients = [
            (window as any).queryClient,
            (window as any).__TANSTACK_QUERY_CLIENT__,
            (window as any).__REACT_QUERY_CLIENT__
          ];
          
          possibleClients.forEach((client, index) => {
            if (client && typeof client.clear === 'function') {
              client.clear();
              console.log(`[AuthService] Cleared query cache via method ${index + 1}`);
            }
          });
        } catch (error) {
          console.warn('[AuthService] Could not clear additional query caches:', error);
        }
      }
      
      console.log('[AuthService] Query cache clearing completed');
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
      console.log('[AuthService] Applying unified auth update:', {
        userEmail: authData.user.email,
        userId: authData.user._id,
        hasToken: !!authData.token,
        tokenLength: authData.token.length
      });

      // 1. Update token storage
      this.setToken(authData.token);
      
      // Verify token was stored
      const storedToken = this.getStoredToken();
      console.log('[AuthService] Token storage verification:', {
        tokenStored: !!storedToken,
        tokensMatch: storedToken === authData.token
      });

      // 2. Update Redux state
      console.log('[AuthService] Dispatching forceUpdateUser with:', {
        hasId: !!authData.user._id,
        userId: authData.user._id,
        userEmail: authData.user.email,
        isVerified: authData.user.isVerified || authData.user.isEmailVerified
      });
      
      store.dispatch(forceUpdateUser(authData.user));
      
      // Verify Redux state was updated
      const newState = store.getState();
      console.log('[AuthService] Redux state after update:', {
        isLoggedIn: newState.user.isLoggedIn,
        hasUser: !!newState.user.user,
        userEmail: newState.user.user?.email,
        userId: newState.user.user?._id
      });

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
