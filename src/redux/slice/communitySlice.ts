import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommunityState {
  activeAccordionValue: string | string[];
}

const initialState: CommunityState = {
  activeAccordionValue: "si_u_scholars",
};

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    setActiveAccordionValue: (
      state,
      action: PayloadAction<string | string[]>,
    ) => {
      state.activeAccordionValue = action.payload;
    },
  },
});

export const { setActiveAccordionValue } = communitySlice.actions;
export default communitySlice.reducer;
