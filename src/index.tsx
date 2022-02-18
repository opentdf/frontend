import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import Keycloak from "keycloak-js";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import Tutorial from "./Tutorial";

const {authority, clientId, realm, app} = window.SERVER_DATA;

// @ts-ignore
const keycloak = new Keycloak({
  url: authority,
  clientId: clientId,
  realm: realm,
});

ReactDOM.render(
  <React.StrictMode>
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        checkLoginIframe: false,
        responseType: "code id_token token",
      }}
      onEvent={(event: unknown, error: unknown) => {
        console.log("onKeycloakEvent", event, error);
      }}
      onTokens={(tokens) => {
        sessionStorage.setItem("keycloak", tokens.token || "");
      }}
    >
        {app === 'tutorial' &&
          <Tutorial/>}
        {(!app || app === 'abacus') &&
          <App />}
    </ReactKeycloakProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
