"use client";

import { configureStore, Store } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import userReducer from "./slice/userSlice";
import pushReducer from "./slice/pushSlice";
import modelReducer from "./slice/modelSlice";
import communityReducer from "./slice/communitySlice";

export const store: Store = configureStore({
  reducer: {
    user: userReducer,
    push: pushReducer,
    model: modelReducer,
    community: communityReducer,
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
