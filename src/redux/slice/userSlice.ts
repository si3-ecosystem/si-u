import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Enhanced user interface with proper typing
interface UserData {
  _id?: string;
  email?: string;
  username?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  roles?: string[];
  isVerified?: boolean;
  newsletter?: boolean;
  interests?: string[];
  companyName?: string;
  wallet_address?: string;
  personalValues?: string[];
  companyAffiliation?: string;
  digitalLinks?: Array<{
    platform: string;
    url: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
  notificationSettings?: any;
  walletInfo?: any;
  settingsUpdatedAt?: string;
}

interface UserState {
  user: UserData;
  address: string | null;
  isLoggedIn: boolean;
  lastUpdated?: number;
  isInitialized: boolean; // Track if auth has been initialized
  debugLog: Array<{
    timestamp: number;
    action: string;
    data: any;
    preservedFields?: string[];
  }>;
}

// Critical fields that should never be lost during updates
const CRITICAL_FIELDS = ['_id', 'wallet_address', 'email', 'roles', 'username'] as const;

const initialState: UserState = {
  user: {},
  address: null,
  isLoggedIn: false,
  lastUpdated: undefined,
  isInitialized: false,
  debugLog: [],
};

// Debug logging utility
const addDebugLog = (state: UserState, action: string, data: any, preservedFields?: string[]) => {
  const logEntry = {
    timestamp: Date.now(),
    action,
    data: typeof data === 'object' ? { ...data } : data,
    preservedFields,
  };

  state.debugLog.push(logEntry);

  // Keep only last 50 log entries
  if (state.debugLog.length > 50) {
    state.debugLog = state.debugLog.slice(-50);
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[UserSlice] ${action}:`, {
      data,
      preservedFields,
      currentUser: { ...state.user },
      isLoggedIn: state.isLoggedIn,
    });
  }
};

// Safe merge utility that preserves critical fields
const safeMergeUserData = (currentUser: UserData, newData: UserData): UserData => {
  const merged = { ...currentUser };

  // Merge new data, but preserve critical fields if they exist in current user
  Object.keys(newData).forEach(key => {
    const typedKey = key as keyof UserData;
    const newValue = newData[typedKey];
    const currentValue = currentUser[typedKey];

    // Special handling for username - always update if new data has it
    if (typedKey === 'username' && newValue) {
      merged[typedKey] = newValue;
    }
    // If it's a critical field and current value exists, only update if new value is truthy
    else if (CRITICAL_FIELDS.includes(typedKey as any) && currentValue) {
      if (newValue) {
        merged[typedKey] = newValue;
      }
      // Keep current value if new value is falsy
    } else {
      // For non-critical fields, always update
      merged[typedKey] = newValue;
    }
  });

  return merged;
};

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    // Initialize user from token (first login or page refresh)
    initializeUser: (state: UserState, action: PayloadAction<UserData>) => {
      const userData = action.payload;
      addDebugLog(state, 'initializeUser', userData);

      state.user = { ...userData };
      state.isLoggedIn = !!userData._id;
      state.isInitialized = true;
      state.lastUpdated = Date.now();

      // Set address from wallet_address if available
      if (userData.wallet_address) {
        state.address = userData.wallet_address;
      }
    },

    // Set user data (for login and major updates)
    setUser: (state: UserState, action: PayloadAction<UserData>) => {
      const newUserData = action.payload;
      const wasLoggedIn = state.isLoggedIn;
      const preservedFields: string[] = [];

      // Use safe merge to preserve critical fields
      const mergedUser = safeMergeUserData(state.user, newUserData);

      // Track what fields were preserved
      CRITICAL_FIELDS.forEach(field => {
        if (state.user[field] && !newUserData[field]) {
          preservedFields.push(field);
        }
      });

      addDebugLog(state, 'setUser', newUserData, preservedFields);

      state.user = mergedUser;
      state.lastUpdated = Date.now();

      // Set login state based on user data and previous state
      if (mergedUser._id && (wasLoggedIn || newUserData._id)) {
        state.isLoggedIn = true;
      }

      // Update address from wallet_address
      if (mergedUser.wallet_address) {
        state.address = mergedUser.wallet_address;
      }
    },

    // Update profile data (preserves all critical fields)
    updateUserProfile: (state: UserState, action: PayloadAction<Partial<UserData>>) => {
      const updates = action.payload;
      const preservedFields: string[] = [];

      // Use safe merge to preserve critical fields
      const mergedUser = safeMergeUserData(state.user, updates);

      // Track what critical fields were preserved
      CRITICAL_FIELDS.forEach(field => {
        if (state.user[field] && !updates[field]) {
          preservedFields.push(field);
        }
      });

      addDebugLog(state, 'updateUserProfile', updates, preservedFields);

      state.user = mergedUser;
      state.lastUpdated = Date.now();
      state.isLoggedIn = true; // Profile updates should maintain login state

      // Update address if wallet_address changed
      if (mergedUser.wallet_address) {
        state.address = mergedUser.wallet_address;
      }
    },

    // Set wallet address
    setAddress: (state: UserState, action: PayloadAction<string | null>) => {
      addDebugLog(state, 'setAddress', action.payload);

      state.address = action.payload;

      // Also update wallet_address in user data if address is provided
      if (action.payload) {
        state.user.wallet_address = action.payload;
      } else {
        // Clear wallet_address when setting address to null
        delete state.user.wallet_address;
      }
    },

    // Force update user data without field preservation (for wallet disconnect)
    forceUpdateUser: (state: UserState, action: PayloadAction<UserData>) => {
      const newUserData = action.payload;

      addDebugLog(state, 'forceUpdateUser', newUserData, ['No fields preserved - force update']);

      // Directly replace user data without any field preservation
      state.user = { ...newUserData };
      state.lastUpdated = Date.now();
      state.isLoggedIn = !!newUserData._id;

      // Update address from wallet_address or clear it
      if (newUserData.wallet_address) {
        state.address = newUserData.wallet_address;
      } else {
        state.address = null;
      }
    },

    // Set connection status
    setConnected: (state: UserState, action: PayloadAction<boolean>) => {
      addDebugLog(state, 'setConnected', action.payload);
      state.isLoggedIn = action.payload;
    },

    // Reset user state (logout)
    resetUser: (state: UserState) => {
      addDebugLog(state, 'resetUser', 'Logging out user');

      state.user = {};
      state.address = null;
      state.isLoggedIn = false;
      state.isInitialized = false;
      state.lastUpdated = Date.now();
    },

    // Clear debug log
    clearDebugLog: (state: UserState) => {
      state.debugLog = [];
    },
  },
});

export const {
  initializeUser,
  setUser,
  updateUserProfile,
  setAddress,
  setConnected,
  resetUser,
  clearDebugLog,
  forceUpdateUser
} = userSlice.actions;

// Export types for use in other files
export type { UserData, UserState };

// Export selectors
export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectIsLoggedIn = (state: { user: UserState }) => state.user.isLoggedIn;
export const selectWalletAddress = (state: { user: UserState }) => state.user.address;
export const selectUserDebugLog = (state: { user: UserState }) => state.user.debugLog;
export const selectIsInitialized = (state: { user: UserState }) => state.user.isInitialized;

export default userSlice.reducer;
