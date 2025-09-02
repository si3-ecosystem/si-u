import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  _id?: string;
  id?: string;
  email?: string;
  username?: string;
  roles?: string[];
  isVerified?: boolean;
  isEmailVerified?: boolean;
  wallet_address?: string;
  walletInfo?: any;
  profileImage?: string;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthStateV2 {
  status: AuthStatus;
  user: AuthUser | null;
}

const initialState: AuthStateV2 = {
  status: 'idle',
  user: null,
};

const authSliceV2 = createSlice({
  name: 'authV2',
  initialState,
  reducers: {
    setAuthLoading(state) {
      state.status = 'loading';
    },
    setAuthenticated(state, action: PayloadAction<AuthUser>) {
      state.status = 'authenticated';
      // Normalize id
      const user = action.payload || {};
      state.user = { ...user, _id: user._id || user.id };
    },
    setUnauthenticated(state) {
      state.status = 'unauthenticated';
      state.user = null;
    },
    mergeUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (!state.user) state.user = {} as AuthUser;
      state.user = { ...state.user, ...action.payload };
    },
    resetAuth(state) {
      state.status = 'idle';
      state.user = null;
    },
  },
});

export const { setAuthLoading, setAuthenticated, setUnauthenticated, mergeUser, resetAuth } = authSliceV2.actions;
export default authSliceV2.reducer;

