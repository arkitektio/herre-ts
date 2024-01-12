# herre-ts


Herre is a typescript libary for authenticating users via the Oauth2 Protocol and OpenID Connect.
Contrary to other libaries, this library focusses on purely client side authentication. Meaning
that all authentication is done in the browser. This is done via the PKCE extension of the Oauth2
"authorization code" flow.

## Installation

```bash
yarn add @jhnnsrs/herre
```

## Features

- [x] PKCE
- [x] Refresh tokens
- [x] User info endpoint inspection
- [ ] Silent refresh

## Usage

```typescript
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useHerre, Callback, HerreProvider } from "@jhnnsrs/herre";


export const Test = () => {
  const { login, logout, token, refresh } = useHerre();

  return (
    <>
      <button onClick={() => login({
        grant: {
            clientId: "test",
            redirectUri: window.location.origin + "/callback",
            scopes: ["openid", "profile", "email"],
            clientSecret: "can be empty",
        },
        endpoint: {
            base_url: "http://localhost:8010/o", //base url of the authorization server
            tokenUrl: "http://localhost:8010/o/token", // if not provided, will be inferred
        }
      })}>Login</button>
      <HerreGuard>
        Only visible when logged in
      </HerreGuard>
    </>
  );
};

function App() {

  return (
    <div className="App">
        <HerreProvider>
            <Router> // Other router libraries can be used
                <Routes>
                <Route path="/" element={<Test />} />
                <Route path="/callback" element={<Callback />} /> //Default callback component
                </Routes>
            </Router>
        </HerreProvider>
    </div>
  );
}

export default App;
```






