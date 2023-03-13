import CancelablePromise from "cancelable-promise";
import React, { useContext } from "react";
import { HerreUser, Token, HerreEndpoint, HerreGrant } from "./types";

export type HerreContextType = {
  logout: () => void;
  login: (
    grant: HerreGrant,
    endpoint: HerreEndpoint
  ) => CancelablePromise<void>;
  setCode: (code: string) => void;
  token?: Token;
  user?: HerreUser;
  isAuthenticating: boolean;
};

export const HerreContext = React.createContext<HerreContextType>({
  logout: () => {},
  login: () =>
    new CancelablePromise((resolve, reject) => {
      reject("Not Herre Provider in context");
    }),
  setCode: () => {},
  isAuthenticating: false,
});

export const useHerre = () => useContext(HerreContext);

export const useRole = (role: string): boolean => {
  const { user } = useHerre();
  return user?.roles?.includes(role) || false;
};
