

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, ...cookieValueParts] = cookie.trim().split('=');
      if (cookieName === name) {
        return cookieValueParts.join('='); 
      }
    }
    return null;
  } catch (error) {
    console.error('Error parsing cookies:', error);
    return null;
  }
};

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const cookieToken = getCookie("si3-jwt");

  if (cookieToken) {
    return cookieToken;
  }

  const localToken = localStorage.getItem("si3-jwt");
  return localToken;
};

const setStoredToken = (token: string): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem("si3-jwt", token);

  const expires = new Date();
  expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
  document.cookie = `si3-jwt=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
};

// Helper to remove token from both cookie and localStorage
const removeStoredToken = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("si3-jwt");

  document.cookie = "si3-jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict";
};

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}/api/auth${endpoint}`;

  const token = getStoredToken();

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: "include", 
    ...options,
  };

  try {
    const response = await fetch(url, config);

    let data: any;

    try {
      data = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (parseError) {
      data = {
        message: `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status,
      };
    }

    if (!response.ok) {
      if (response.status === 401) {
        removeStoredToken();
        // Let middleware handle redirect
        window.location.reload();
      }

      const errorMessage =
        data.message ||
        data.error?.message ||
        `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    console.error("API call failed:", error);

    if (error.message && !error.message.includes("fetch")) {
      throw error;
    }

    throw new Error(
      error.message ||
        "Network error. Please check your connection and try again."
    );
  }
};

export interface SendOTPResponse {
  status: string;
  message: string;
  data: {
    email: string;
    expiresIn: number;
  };
}

export interface VerifyOTPResponse {
  status: string;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      isVerified: boolean;
      roles: string[];
      lastLogin: string;
    };
    token?: string;
  };
}

// New interfaces for wallet authentication
export interface WalletNonceResponse {
  status: string;
  data: {
    message: string;
    wallet_address: string;
    expiresIn: number;
  };
}

export interface WalletVerifyResponse {
  status: string;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      wallet_address: string;
      isVerified: boolean;
      roles: string[];
      lastLogin: string;
    };
    token?: string;
  };
}

class AuthService {
  // Existing email methods
  async sendEmailOTP(email: string): Promise<SendOTPResponse> {
    return apiCall("/email/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async verifyEmailOTP(email: string, otp: string): Promise<VerifyOTPResponse> {
    const response = await apiCall("/email/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });

    // Store token in localStorage if present
    if (response.data?.token) {
      setStoredToken(response.data.token);
    }

    return response;
  }

  // New wallet authentication methods
  async requestWalletSignature(
    walletAddress: string
  ): Promise<WalletNonceResponse> {
    return apiCall("/wallet/request-signature", {
      method: "POST",
      body: JSON.stringify({ wallet_address: walletAddress }),
    });
  }

  async verifyWalletSignature(
    walletAddress: string,
    signature: string
  ): Promise<WalletVerifyResponse> {
    const response = await apiCall("/wallet/verify-signature", {
      method: "POST",
      body: JSON.stringify({ wallet_address: walletAddress, signature }),
    });

    // Store token in localStorage if present
    if (response.data?.token) {
      setStoredToken(response.data.token);
    }

    return response;
  }

  // Existing methods
  async checkAuth(): Promise<any> {
    return apiCall("/check", {
      method: "GET",
    });
  }

  async logout(): Promise<any> {
    try {
      const response = await apiCall("/logout", {
        method: "POST",
      });

      removeStoredToken();
      return response;
    } catch (error) {
      removeStoredToken();
      throw error;
    }
  }

  getToken(): string | null {
    return getStoredToken();
  }

  isAuthenticated(): boolean {
    const token = getStoredToken();
    if (!token) {
      console.log('authService.isAuthenticated: No token found in any source');
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Date.now() / 1000;
      const isValid = payload.exp > now;

      if (!isValid) {
        console.log('authService.isAuthenticated: Token is expired, removing...');
        removeStoredToken();
      }

      return isValid;
    } catch (error) {
      console.log('authService.isAuthenticated: Token parsing failed:', error);
      removeStoredToken();
      return false;
    }
  }

  clearAuth(): void {
    removeStoredToken();
  }
}

export const authService = new AuthService();
