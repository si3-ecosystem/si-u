// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// // Helper function for API calls
// const apiCall = async (endpoint: string, options: RequestInit = {}) => {
//   const url = `${API_BASE_URL}/api/auth${endpoint}`;

//   const config: RequestInit = {
//     headers: {
//       "Content-Type": "application/json",
//       ...options.headers,
//     },
//     credentials: "include",
//     ...options,
//   };

//   try {
//     const response = await fetch(url, config);
//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || `HTTP error! status: ${response.status}`);
//     }

//     return data;
//   } catch (error: any) {
//     console.error("API call failed:", error);
//     throw new Error(error.message || "An unexpected error occurred");
//   }
// };

// export interface SendOTPResponse {
//   status: string;
//   message: string;
//   data: {
//     email: string;
//     expiresIn: number;
//   };
// }

// export interface VerifyOTPResponse {
//   status: string;
//   message: string;
//   data: {
//     user: {
//       id: string;
//       email: string;
//       roles: string[];
//       lastLogin: string;
//       isVerified: boolean;
//     };
//     token?: string;
//   };
// }

// export interface AuthError {
//   message: string;
//   statusCode?: number;
// }

// class AuthService {
//   /**
//    * Send OTP to email
//    */

//   async sendEmailOTP(email: string): Promise<SendOTPResponse> {
//     return apiCall("/email/send-otp", {
//       method: "POST",
//       body: JSON.stringify({ email }),
//     });
//   }

//   /**
//    * Verify OTP and login/register
//    */

//   async verifyEmailOTP(email: string, otp: string): Promise<VerifyOTPResponse> {
//     return apiCall("/email/verify-otp", {
//       method: "POST",
//       body: JSON.stringify({ email, otp }),
//     });
//   }

//   /**
//    * Check authentication status
//    */

//   async checkAuth(): Promise<any> {
//     return apiCall("/check", {
//       method: "GET",
//     });
//   }

//   /**
//    * Logout user
//    */

//   async logout(): Promise<any> {
//     return apiCall("/logout", {
//       method: "POST",
//     });
//   }

//   /**
//    * Request wallet signature
//    */

//   async requestWalletSignature(walletAddress: string): Promise<any> {
//     return apiCall("/wallet/request-signature", {
//       method: "POST",
//       body: JSON.stringify({ walletAddress }),
//     });
//   }

//   /**
//    * Verify wallet signature
//    */

//   async verifyWalletSignature(
//     walletAddress: string,
//     signature: string,
//     message: string
//   ): Promise<any> {
//     return apiCall("/wallet/verify-signature", {
//       method: "POST",
//       body: JSON.stringify({
//         walletAddress,
//         signature,
//         message,
//       }),
//     });
//   }
// }

// export const authService = new AuthService();

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// // Helper function for API calls
// const apiCall = async (endpoint: string, options: RequestInit = {}) => {
//   const url = `${API_BASE_URL}/api/auth${endpoint}`;

//   const config: RequestInit = {
//     headers: {
//       "Content-Type": "application/json",
//       ...options.headers,
//     },
//     credentials: "include",
//     ...options,
//   };

//   try {
//     const response = await fetch(url, config);

//     // Parse JSON response
//     let data: any;

//     try {
//       data = await response.json();
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (parseError) {
//       // If JSON parsing fails, create a generic error
//       data = {
//         message: `HTTP ${response.status}: ${response.statusText}`,
//         statusCode: response.status,
//       };
//     }

//     // Check if response is ok (status 200-299)
//     if (!response.ok) {
//       // Throw error with the message from backend
//       const errorMessage =
//         data.message ||
//         data.error?.message ||
//         `HTTP error! status: ${response.status}`;
//       throw new Error(errorMessage);
//     }

//     return data;
//   } catch (error: any) {
//     console.error("API call failed:", error);

//     // If it's already our custom error, re-throw it
//     if (error.message && !error.message.includes("fetch")) {
//       throw error;
//     }

//     // For network errors, provide a user-friendly message
//     throw new Error(
//       error.message ||
//         "Network error. Please check your connection and try again."
//     );
//   }
// };

// export interface SendOTPResponse {
//   status: string;
//   message: string;
//   data: {
//     email: string;
//     expiresIn: number;
//   };
// }

// export interface VerifyOTPResponse {
//   status: string;
//   message: string;
//   data: {
//     user: {
//       id: string;
//       email: string;
//       isVerified: boolean;
//       roles: string[];
//       lastLogin: string;
//     };
//     token?: string;
//   };
// }

// export interface AuthError {
//   message: string;
//   statusCode?: number;
// }

// class AuthService {
//   /**
//    * Send OTP to email
//    */

//   async sendEmailOTP(email: string): Promise<SendOTPResponse> {
//     return apiCall("/email/send-otp", {
//       method: "POST",
//       body: JSON.stringify({ email }),
//     });
//   }

//   /**
//    * Verify OTP and login/register
//    */

//   async verifyEmailOTP(email: string, otp: string): Promise<VerifyOTPResponse> {
//     return apiCall("/email/verify-otp", {
//       method: "POST",
//       body: JSON.stringify({ email, otp }),
//     });
//   }

//   /**
//    * Check authentication status
//    */

//   async checkAuth(): Promise<any> {
//     return apiCall("/check", {
//       method: "GET",
//     });
//   }

//   /**
//    * Logout user
//    */

//   async logout(): Promise<any> {
//     return apiCall("/logout", {
//       method: "POST",
//     });
//   }

//   /**
//    * Request wallet signature
//    */

//   async requestWalletSignature(walletAddress: string): Promise<any> {
//     return apiCall("/wallet/request-signature", {
//       method: "POST",
//       body: JSON.stringify({ walletAddress }),
//     });
//   }

//   /**
//    * Verify wallet signature
//    */

//   async verifyWalletSignature(
//     walletAddress: string,
//     signature: string,
//     message: string
//   ): Promise<any> {
//     return apiCall("/wallet/verify-signature", {
//       method: "POST",
//       body: JSON.stringify({
//         walletAddress,
//         signature,
//         message,
//       }),
//     });
//   }
// }

// export const authService = new AuthService();

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

class AuthService {
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
