import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import * as msal from "@azure/msal-browser";
import {AUTHORITY, CLIENT_ID} from "./config";
import {Configuration} from "@azure/msal-browser/dist/config/Configuration";
import {MsalProvider} from "@azure/msal-react";

const msalConfig: Configuration = {
    auth: {
        clientId: CLIENT_ID,
        authority: AUTHORITY,
    }
};
const msalInstance = new msal.PublicClientApplication(msalConfig);
msalInstance.handleRedirectPromise().then((tokenResponse) => {
    // Check if the tokenResponse is null
    // If the tokenResponse !== null, then you are coming back from a successful authentication redirect.
    // If the tokenResponse === null, you are not coming back from an auth redirect.
    console.log(tokenResponse);
}).catch((error: any) => {
    // handle error, either in the library or coming back from the server
    console.error(error);
});
const loginRequest = {
    scopes: ["user.read"]
};
msalInstance.loginRedirect(loginRequest).then(r => console.log).catch(error => console.error);

ReactDOM.render(
  <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
