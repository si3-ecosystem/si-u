"use client";

import { configureStore, Store } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import userReducer from "./slice/userSlice";
import pushReducer from "./slice/pushSlice";
import modalsReducer from "./slice/modalSlice";
import communityReducer from "./slice/communitySlice";
import commentReducer from "./slice/commentSlice";

export const store: Store = configureStore({
  reducer: {
    user: userReducer,
    push: pushReducer,
    modals: modalsReducer,
    community: communityReducer,
    comments: commentReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
