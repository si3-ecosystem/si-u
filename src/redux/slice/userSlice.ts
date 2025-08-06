import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  address: string | null;
  isLoggedIn: boolean;
  lastUpdated?: number; // Track when user data was last updated
}

const initialState: UserState = {
  user: {},
  address: null,
  isLoggedIn: false,
  lastUpdated: undefined,
};

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setUser: (state: UserState, action: PayloadAction<any>) => {
      // Preserve login state when updating user data
      const wasLoggedIn = state.isLoggedIn;
      const existingAddress = state.address;

      state.user = action.payload;
      state.lastUpdated = Date.now(); // Track when user data was updated

      // Ensure we don't accidentally log out the user during profile updates
      if (wasLoggedIn && action.payload) {
        state.isLoggedIn = true;
      }

      // Preserve wallet address if it exists
      if (existingAddress && !state.address) {
        state.address = existingAddress;
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setAddress: (state: UserState, action: PayloadAction<any>) => {
      state.address = action.payload;
    },

    resetUser: (state: UserState) => {
      state.user = {};
      state.address = null;
      state.isLoggedIn = false;
    },

    setConnected: (state: UserState, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateUserProfile: (state: UserState, action: PayloadAction<any>) => {
      // Specifically for profile updates - preserves all auth state
      state.user = {
        ...state.user,
        ...action.payload,
      };
      state.lastUpdated = Date.now();
      // Explicitly preserve login state
      state.isLoggedIn = true;
    },
  },
});

export const { setUser, resetUser, setConnected, setAddress, updateUserProfile } =
  userSlice.actions;

export default userSlice.reducer;
