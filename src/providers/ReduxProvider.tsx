"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";

import { store } from "@/redux/store";

interface WalletProviderProps {
  children: ReactNode;
}

export const ReduxProvider = ({ children }: WalletProviderProps) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
