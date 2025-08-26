"use client";
import { configureStore, Store } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createLogger } from "redux-logger";
import userReducer from "./slice/userSlice";
import pushReducer from "./slice/pushSlice";
import modalsReducer from "./slice/modalSlice";
import communityReducer from "./slice/communitySlice";
import commentReducer from "./slice/commentSlice";
import contentSlice from "./slice/contentSlice";

const contentPersistConfig = {
  key: "content",
  storage,
};

const persistedContentReducer = persistReducer(
  contentPersistConfig,
  contentSlice
);

export const store: Store = configureStore({
  reducer: {
    user: userReducer,
    push: pushReducer,
    modals: modalsReducer,
    community: communityReducer,
    comments: commentReducer,
    content: persistedContentReducer,
  },

  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
    if (process.env.NODE_ENV !== "production") {
      const logger = createLogger({ collapsed: true });
      return middleware.concat(logger);
    }
    return middleware;
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;

export const persistor = persistStore(store);
