import { useState } from "react";
import "./App.css";
import { FaktsProvider, FaktsGuard, useFakts } from "fakts";
import { FaktsHerreProvider } from "./contrib/FaktsHerreProvider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useHerre } from "./herre/HerreContext";
import { Callback } from "./contrib/Callback";
import { NoFakts } from "./NoFakts";

export const Test = () => {
  const { login, logout, user } = useHerre();
  const { fakts } = useFakts();

  return (
    <>
      {user ? (
        <button onClick={() => logout()}>Logout {user.sub}</button>
      ) : (
        <button
          onClick={() =>
            login(
              {
                clientId: fakts.herre.client_id,
                clientSecret: fakts.herre.client_secret,
                scopes: fakts.herre.scopes,
                redirectUri: window.location.origin + "/callback",
              },
              {
                base_url: fakts.herre.base_url,
                tokenUrl: fakts.herre.base_url + "/token/",
                userInfoEndpoint: fakts.herre.base_url + "/userinfo/",
                authUrl: fakts.herre.base_url + "/authorize/",
              }
            )
          }
        >
          Login
        </button>
      )}
    </>
  );
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <FaktsProvider
        clientId="PsdU71PlUYeC4hP4aDf8pTdm2Hv9xYKdrxCFI5RO"
        clientSecret="8jXSNhrH7fllN8cGjxg7y2Jl1INb22wlDSmUBepb9aRDGV3al5pfNzswS85MPEvpN5vnfrPkrIERQ6kcMHLiISr4HcYirivdtrnyMjFMlzKGvlCrwfkNJmtQgCLZmH4X"
      >
        <FaktsGuard fallback={<NoFakts />}>
          <FaktsHerreProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Test />} />
                <Route path="/callback" element={<Callback />} />
              </Routes>
            </Router>
          </FaktsHerreProvider>
        </FaktsGuard>
      </FaktsProvider>
    </div>
  );
}

export default App;
