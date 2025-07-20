// Authentication and User related types

export interface User {
  _id: string;
  email: string;
  isVerified: boolean;
  roles: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  
  // Profile information
  firstName?: string;
  lastName?: string;
  username?: string;
  website?: string;
  bio?: string;
  avatar?: string;
  
  // Preferences
  newsletter: boolean;
  interests: string[];
  personalValues: string[];
  
  // Company/Organization
  companyName?: string;
  companyAffiliation?: string;
  
  // Blockchain related
  wallet_address?: string;
  digitalLinks: any[];
}

export interface AuthState {
  user: User | null;
  address: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  otp?: string;
}

export interface WalletCredentials {
  address: string;
  signature: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token?: string;
  };
}

// JWT Payload interface (matches middleware)
export interface UserJWTPayload {
  _id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  roles: string[];
  lastLogin?: Date;
  digitalLinks: any[];
  isVerified: boolean;
  newsletter: boolean;
  interests: string[];
  companyName?: string;
  wallet_address?: string;
  personalValues: string[];
  companyAffiliation?: string;
  iat?: number;
  exp?: number;
}

// Auth hook return type
export interface UseAuthReturn {
  // User data
  user: User | null;
  address: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Auth status checks
  isAuthenticated: boolean;
  isVerified: boolean;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
  isGuide: boolean;
  isPartner: boolean;
  
  // Auth actions
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithWallet: (credentials: WalletCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  
  // Utility methods
  getDisplayName: () => string;
  getInitials: () => string;
}
