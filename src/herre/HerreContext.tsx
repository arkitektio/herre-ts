import CancelablePromise from "cancelable-promise";
import React, { useContext } from "react";
import { HerreUser, Token, HerreEndpoint, HerreGrant } from "./types";

export type HerreContextType = {
  logout: () => void;
  login: (
    grant: HerreGrant,
    endpoint: HerreEndpoint
  ) => CancelablePromise<void>;
  refresh: () => Promise<void>;
  token?: Token;
  user?: HerreUser;
};

export const HerreContext = React.createContext<HerreContextType>({
  logout: () => {},
  login: () =>
    new CancelablePromise((resolve, reject) => {
      reject("Not Herre Provider in context");
    }),
  refresh: () => new Promise((resolve, reject) => reject()),
});

export const useHerre = () => useContext(HerreContext);

export const useRole = (role: string): boolean => {
  const { user } = useHerre();
  return user?.roles?.includes(role) || false;
};
