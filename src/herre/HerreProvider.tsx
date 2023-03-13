import React, { useEffect, useState } from "react";
import { HerreContext } from "./HerreContext";
import {
  HerreEndpoint,
  HerreGrant,
  HerreUser,
  Token,
  TokenRequestBody,
} from "./types";
import { createPKCECodes, PKCECodePair, toUrlEncoded } from "./utils";
import { CancelablePromise } from "cancelable-promise";
export type WrappedHerreProps = {
  children?: React.ReactNode;
};

export type HerreProps = {
  children: React.ReactNode;
  grantType?: string;
  doRedirect?: (url: string) => void;
};

export type Auth = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
};

export const HerreProvider = ({
  doRedirect,
  children,
  grantType = "authorization_code",
}: HerreProps) => {
  const [refresh_token, setRefreshToken] = useState<string | undefined>();
  const [staging_token, setStagingToken] = useState<string | undefined>();
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [loginFuture, setLoginFuture] = useState<
    CancelablePromise<Token> | undefined
  >();

  // Context state
  const [user, setUser] = useState<HerreUser | undefined>();
  const [access_token, setAccessToken] = useState<string | undefined>();

  const getPkce = () => {
    const pkce = localStorage.getItem("pkce");
    if (null === pkce) {
      throw new Error("PKCE pair not found in local storage");
    } else {
      return JSON.parse(pkce) as PKCECodePair;
    }
  };

  const getStoredGrant = () => {
    const grant_string = localStorage.getItem("herre-grant");
    if (null === grant_string) {
      throw new Error("Grant not found in local storage.");
    } else {
      return JSON.parse(grant_string) as HerreGrant;
    }
  };

  const getStoredEndpoint = () => {
    const endpoint_string = localStorage.getItem("herre-endpoint");
    if (null === endpoint_string) {
      throw new Error("Endpoint not found in local storage.");
    } else {
      return JSON.parse(endpoint_string) as HerreEndpoint;
    }
  };

  const storeGrant = (grant: HerreGrant) => {
    localStorage.setItem("herre-grant", JSON.stringify(grant));
  };

  const storeEndpoint = (endpoint: HerreEndpoint) => {
    localStorage.setItem("herre-endpoint", JSON.stringify(endpoint));
  };

  const getAuth = () => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      return undefined;
    } else {
      try {
        return JSON.parse(auth) as Auth;
      } catch (e) {
        return undefined;
      }
    }
  };

  const setCode = async (code: string) => {
    localStorage.setItem("herre-code", code);
  };

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      setStagingToken(auth.access_token);
      setRefreshToken(auth.refresh_token);
    }
  }, []);

  const fetchToken = async (
    grant: HerreGrant,
    endpoint: HerreEndpoint,
    code: string,
    isRefresh = false
  ) => {
    let payload: TokenRequestBody = {
      clientId: grant.clientId.trim(),
      clientSecret: grant.clientSecret || grant.clientSecret?.trim(),
      redirectUri: grant.redirectUri,
      grantType,
    };
    console.log(payload);

    if (isRefresh) {
      payload = {
        ...payload,
        grantType: "refresh_token",
        refresh_token: code,
      };
    } else {
      const pkce: PKCECodePair = getPkce();
      const codeVerifier = pkce.codeVerifier;
      payload = {
        ...payload,
        code,
        codeVerifier,
      };
    }

    let tokenUrl = endpoint.tokenUrl || endpoint.base_url + "/token";

    console.log(payload);
    const response = await fetch(`${tokenUrl}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: toUrlEncoded(payload),
    }).catch((e) => {
      console.log({ e });
      throw e;
    });

    const json = await response.json();
    console.log(json);
    return json;
  };

  useEffect(() => {
    if (staging_token) {
      try {
        let endpoint = getStoredEndpoint();
        let userInfoUrl =
          endpoint.userInfoEndpoint || endpoint.base_url + "/userinfo";
        console.log(`Fetching user from ${userInfoUrl}`);
        fetch(`${userInfoUrl}`, {
          headers: {
            Authorization: `Bearer ${staging_token}`,
          },
          method: "GET",
        }).then(
          (result) => {
            if (result) {
              result.json().then((data) => {
                console.log(data);
                if (data.error) {
                  logout();
                }
                if (data.sub) {
                  setUser(data);
                  setAccessToken(staging_token);
                  localStorage.setItem(
                    "auth",
                    JSON.stringify({
                      access_token: staging_token,
                      refresh_token: refresh_token,
                    })
                  );
                  let path = localStorage.getItem("preAuthUri");
                  if (path) {
                    localStorage.removeItem("preAuthUri");
                  }
                }
              });
            } else {
              console.log("Didnt receive an Associated User", result);
            }
          },
          (error) => {
            console.error(error);
            logout();
          }
        );
      } catch (e) {
        console.log(e);
      }
    }
  }, [staging_token]);

  const logout = () => {
    console.log("Logging Out");
    localStorage.removeItem("auth");
    setUser(undefined);
    setAccessToken(undefined);
  };

  const login = (grant?: HerreGrant, endpoint?: HerreEndpoint) => {
    console.log("Logging in");
    localStorage.setItem("herre-code", "");

    let used_grant = grant;
    let used_endpoint = endpoint;

    if (grant) {
      storeGrant(grant);
      used_grant = grant;
    } else {
      used_grant = getStoredGrant();
    }

    if (endpoint) {
      storeEndpoint(endpoint);
      used_endpoint = endpoint;
    } else {
      used_endpoint = getStoredEndpoint();
    }

    //service?.login();

    const pkce = createPKCECodes();
    localStorage.setItem("pkce", JSON.stringify(pkce));
    localStorage.setItem("preAuthUri", location.pathname);

    const codeChallenge = pkce.codeChallenge;

    const query = {
      clientId: used_grant.clientId.trim(),
      scopes: used_grant.scopes.join(" "),
      responseType: "code",
      redirectUri: used_grant.redirectUri,
      codeChallenge,
      codeChallengeMethod: "S256",
    };
    // Responds with a 302 redirect
    const url = `${
      used_endpoint.authUrl || used_endpoint.base_url || "/token"
    }?${toUrlEncoded(query)}`;
    if (doRedirect != undefined) {
      doRedirect(url);
    } else {
      window.open(url, "_blank", "noreferrer, popup");
    }

    setIsAuthenticating(true);
    const loginFuture = new CancelablePromise(
      async (resolve, reject, onCancel) => {
        let count = 0;

        const interval = setInterval(async () => {
          console.log("Checking for code change");
          const code = localStorage.getItem("herre-code");
          if (count > 10) {
            console.log("Code not changed, cancelling");
            setIsAuthenticating(false);
            clearInterval(interval);
            reject("Code not changed");
            return;
          }

          if (code && code.length > 0) {
            count += 1;
            console.log("Retrieved code", code);
            setIsAuthenticating(false);
            clearInterval(interval);
            localStorage.removeItem("herre-code");

            try {
              let endpoint = getStoredEndpoint();
              let grant = getStoredGrant();

              console.log("Code changed, challenging server");
              fetchToken(grant, endpoint, code).then((token) => {
                localStorage.setItem("auth", token);

                resolve(token);
                setStagingToken(token.access_token);
                setRefreshToken(token.refresh_token);
                return;
              });
            } catch (e) {
              reject(e);
              return;
            }
          }
        }, 500);

        onCancel(() => {
          setIsAuthenticating(false);
          console.log("Cancelling login");
          clearInterval(interval);
        });
      }
    );
    setLoginFuture(loginFuture);

    return loginFuture;
  };

  return (
    <HerreContext.Provider
      value={{
        logout: logout,
        login: login,
        setCode: setCode,
        user: user,
        token: access_token,
        isAuthenticating,
      }}
    >
      {children}
    </HerreContext.Provider>
  );
};
