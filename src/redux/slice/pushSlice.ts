import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PushState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pushSign: any;
  isConnected: boolean;
}

const initialState: PushState = {
  pushSign: {},
  isConnected: false,
};

const pushSlice = createSlice({
  name: "push",

  initialState,

  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setPushSign: (state: PushState, action: PayloadAction<any>) => {
      state.pushSign = action.payload;
    },

    resetPush: (state: PushState) => {
      state.pushSign = {};
      state.isConnected = false;
    },

    setConnected: (state: PushState, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setPushSign, resetPush, setConnected } = pushSlice.actions;

export default pushSlice.reducer;
