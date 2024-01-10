import { useFakts } from "fakts";
import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Callback } from "./contrib/Callback";
import { useHerre } from "./herre/HerreContext";
import { HerreProvider } from "./herre/HerreProvider";
import { FaktsGuard, FaktsProvider, WellKnownDiscovery, useLoadFakts } from "@jhnnsrs/fakts";
import { ConnectButtons } from "./contrib/ConnectButton";
import { LoginButton } from "./contrib/LoginButton";
import { HerreGuard } from "./herre";
import { LogoutButton } from "./contrib/LogoutButton";
import { manifest } from "./manifest";

export const Test = () => {
  const { login, logout, token, refresh } = useHerre();
  const { fakts, load, remove } = useLoadFakts({
    onProgress: (progress) => {
      console.log("Progress", progress);
    },
    manifest: manifest
  });
;

  return (
    <>
    {JSON.stringify(fakts)}
      <button onClick={() => load()}>Load</button>
      <button onClick={() => remove()}>Remove</button>
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
        <WellKnownDiscovery endpoints={["localhost:8010"]} />
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
