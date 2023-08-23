import CancelablePromise from "cancelable-promise";
import { useFakts } from "fakts";
import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Callback } from "./contrib/Callback";
import { useHerre } from "./herre/HerreContext";
import { HerreProvider } from "./herre/HerreProvider";

export const Test = () => {
  const { login, logout, token, refresh } = useHerre();
  const { fakts } = useFakts();
  const [loginFuture, setLoginFuture] = useState<
    CancelablePromise<void> | undefined
  >();

  const base_url = "https://lok-sibarita.iins.u-bordeaux.fr/o";
  console.log(loginFuture);

  return (
    <>
      {token ? (
        <>
          <button onClick={() => logout()}>Logout</button>
          <button onClick={() => refresh()}>Refresh</button>
        </>
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
              Cancel Login{" "}
            </button>
          ) : (
            <button
              onClick={() =>
                setLoginFuture(
                  login(
                    {
                      clientId:
                        "soinfosienfsfosefghsegfsefsdfgeisnefoisneofinsef",
                      clientSecret:
                        "soinfoefsefssdfienfoisnefsefsefoisneofinsef",
                      scopes: ["read"],
                      redirectUri: window.location.origin + "/callback",
                    },
                    {
                      base_url: base_url,
                      tokenUrl: base_url + "/token/",
                      userInfoEndpoint: base_url + "/userinfo/",
                      authUrl: base_url + "/authorize/",
                    }
                  )
                    .then(() => {
                      setLoginFuture(undefined);
                    })
                    .catch((e) => {
                      alert(e.message);
                      setLoginFuture(undefined);
                    })
                )
              }
            >
              {"Login"}
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
