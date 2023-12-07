import CancelablePromise from "cancelable-promise";
import { useFakts } from "fakts";
import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Callback } from "./contrib/Callback";
import { useHerre } from "./herre/HerreContext";
import { HerreProvider } from "./herre/HerreProvider";
import { FaktsGuard, FaktsProvider, WellKnownDiscovery } from "@jhnnsrs/fakts";
import { ConnectButtons } from "./contrib/ConnectButton";
import { LoginButton } from "./contrib/LoginButton";
import { HerreGuard } from "./herre";
import { LogoutButton } from "./contrib/LogoutButton";

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
      <HerreGuard fallback={<LoginButton />}>
        <LogoutButton />
      </HerreGuard>
    </>
  );
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <FaktsProvider>
        <WellKnownDiscovery endpoints={["localhost:8000"]} />
        <FaktsGuard fallback={<ConnectButtons />}>
          <HerreProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Test />} />
                <Route path="/callback" element={<Callback />} />
              </Routes>
            </Router>
          </HerreProvider>
        </FaktsGuard>
      </FaktsProvider>
    </div>
  );
}

export default App;
