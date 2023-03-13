import { useState } from "react";
import "./App.css";
import { FaktsProvider, FaktsGuard, useFakts } from "fakts";
import { HerreProvider } from "./herre/HerreProvider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useHerre } from "./herre/HerreContext";
import { Callback } from "./contrib/Callback";
import { NoFakts } from "./NoFakts";
import CancelablePromise from "cancelable-promise";

export const Test = () => {
  const { login, logout, user, isAuthenticating } = useHerre();
  const { fakts } = useFakts();
  const [loginFuture, setLoginFuture] = useState<
    CancelablePromise<void> | undefined
  >();

  const base_url = "http://localhost:8000/o";
  console.log(loginFuture);

  return (
    <>
      {user ? (
        <button onClick={() => logout()}>Logout {user.sub}</button>
      ) : (
        <>
          {loginFuture ? (
            <button
              onClick={() => {
                loginFuture.cancel();
                setLoginFuture(undefined);
              }}
            >
              {" "}
              Cancell{" "}
            </button>
          ) : (
            <button
              onClick={() =>
                setLoginFuture(
                  login(
                    {
                      clientId: "mylittlefakts",
                      clientSecret: "mylittlefaktssecret",
                      scopes: ["read", "write"],
                      redirectUri: window.location.origin + "/callback",
                    },
                    {
                      base_url: base_url,
                      tokenUrl: base_url + "/token/",
                      userInfoEndpoint: base_url + "/userinfo/",
                      authUrl: base_url + "/authorize/",
                    }
                  ).then(() => {
                    setLoginFuture(undefined);
                  })
                )
              }
            >
              {isAuthenticating ? "Logging in..." : "Login"}
            </button>
          )}
        </>
      )}
    </>
  );
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      {" "}
      <HerreProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Test />} />
            <Route path="/callback" element={<Callback />} />
          </Routes>
        </Router>
      </HerreProvider>
    </div>
  );
}

export default App;
