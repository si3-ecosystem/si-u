import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  address: string | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: {},
  address: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setUser: (state: UserState, action: PayloadAction<any>) => {
      state.user = action.payload;
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
  },
});

export const { setUser, resetUser, setConnected, setAddress } =
  userSlice.actions;

export default userSlice.reducer;
