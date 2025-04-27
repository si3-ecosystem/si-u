import { createSlice } from "@reduxjs/toolkit";

interface ModalsState {
  isModalOpen: boolean;
  activeWallet: string | null;
}

const initialState: ModalsState = {
  activeWallet: null,
  isModalOpen: false,
};

const modalsSlice = createSlice({
  name: "modals",

  initialState,

  reducers: {
    toggleModal: (state: ModalsState) => {
      state.isModalOpen = !state.isModalOpen;
    },

    setActiveWallet: (state: ModalsState, action) => {
      state.activeWallet = action.payload;
    },
  },
});

export const { toggleModal, setActiveWallet } = modalsSlice.actions;

export default modalsSlice.reducer;
