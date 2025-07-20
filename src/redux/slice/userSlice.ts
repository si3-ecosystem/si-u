import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User, AuthState } from "@/types/auth";

const initialState: AuthState = {
  user: null,
  address: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state: AuthState, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
    },

    setAddress: (state: AuthState, action: PayloadAction<string>) => {
      state.address = action.payload;
    },

    setConnected: (state: AuthState, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
      if (!action.payload) {
        // If disconnecting, clear user data
        state.user = null;
        state.address = null;
      }
    },

    setLoading: (state: AuthState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state: AuthState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    updateUserProfile: (state: AuthState, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    resetUser: (state: AuthState) => {
      state.user = null;
      state.address = null;
      state.isLoggedIn = false;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setUser,
  setAddress,
  setConnected,
  setLoading,
  setError,
  updateUserProfile,
  resetUser
} = userSlice.actions;

export default userSlice.reducer;
