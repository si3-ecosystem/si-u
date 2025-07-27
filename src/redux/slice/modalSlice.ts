import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalsState {
  isModalOpen: boolean;
  isLogoutModalOpen: boolean;
  activeWallet: string | null;
}

const initialState: ModalsState = {
  activeWallet: null,
  isModalOpen: false,
  isLogoutModalOpen: false,
};

const modalsSlice = createSlice({
  name: "modals",

  initialState,

  reducers: {
    toggleModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },

    setLogoutModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isLogoutModalOpen = action.payload;
    },

    setActiveWallet: (state, action: PayloadAction<string | null>) => {
      state.activeWallet = action.payload;
    },
  },
});

export const { toggleModal, setActiveWallet, setLogoutModalOpen } =
  modalsSlice.actions;

export default modalsSlice.reducer;
