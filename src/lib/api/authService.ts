const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Helper to get token from localStorage
const getStoredToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("si3-token");
  }
  return null;
};

// Helper to set token in localStorage
const setStoredToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("si3-token", token);
  }
};

// Helper to remove token from localStorage
const removeStoredToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("si3-token");
  }
};

// Helper function for API calls with automatic auth headers
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}/api/auth${endpoint}`;

  // Get token from localStorage
  const token = getStoredToken();

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: "include", // Include cookies
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
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      removeStoredToken();
      return false;
    }
  }

  clearAuth(): void {
    removeStoredToken();
  }
}

export const authService = new AuthService();
