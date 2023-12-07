import { Fakts, useFakts } from "@jhnnsrs/fakts";
import CancelablePromise from "cancelable-promise";
import { useCallback, useState } from "react";
import { useHerre } from "../herre";
import { HerreEndpoint, HerreGrant } from "../herre/types";

const defaultClassName =
  "w-full shadow-lg shadow-primary-300/60 flex items-center justify-center px-8 py-3 border text-base font-medium rounded-md dark:text-white text-back-700 border-primary-400 bg-primary-300 hover:bg-primary-400 md:py-4 md:text-lg md:px-10";

export type LoginButtonProps = {
  buildEndpoint?: (fakts: Fakts) => Promise<HerreEndpoint>;
  buildGrant?: (fakts: Fakts) => Promise<HerreGrant>;
  postLogin?: () => void;
  onCancel?: () => Promise<void>;
  className?: (helpers: { authenticating: boolean; fakts: Fakts }) => string;
  children?: (helpers: {
    authenticating: boolean;
    fakts: Fakts;
  }) => React.ReactNode;
};

export const LoginButton = ({
  buildEndpoint = async (fakts) => ({
    base_url: fakts.lok.base_url,
    tokenUrl: fakts.lok.base_url + "/token/",
    userInfoEndpoint: fakts.lok.base_url + "/userinfo/",
    authUrl: fakts.lok.base_url + "/authorize/",
  }),
  buildGrant = async (fakts) => ({
    clientId: fakts.lok.client_id,
    clientSecret: fakts.lok.client_secret,
    scopes: fakts.lok.scopes,
    redirectUri: window.location.origin + "/callback",
  }),
  onCancel = async () => {},
  className = (authenticating) => defaultClassName,
  children = (helpers) => (helpers.authenticating ? "Cancel Login" : "Login"),
}: LoginButtonProps) => {
  const { fakts } = useFakts();
  const [future, setFuture] = useState<CancelablePromise | null>(null);
  const { login } = useHerre();

  const adaptive_login = useCallback(() => {
    return new CancelablePromise(async (resolve, reject, cancel) => {
      try {
        let endpoint = await buildEndpoint(fakts);
        let grant = await buildGrant(fakts);

        cancel(async () => {
          await onCancel();
          setFuture(null);
        });

        await login(grant, endpoint);
      } catch (err) {
        console.error("oauth error", err);
      }
    });
  }, [fakts, buildEndpoint, buildGrant, onCancel, login]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (future) {
            future.cancel();
          } else {
            setFuture(adaptive_login());
          }
        }}
        className={
          className({ authenticating: future !== null, fakts }) ||
          defaultClassName
        }
      >
        {children({ authenticating: future !== null, fakts })}
      </button>
    </>
  );
};
