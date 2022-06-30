import {lazy, Suspense, useState} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Button, Layout} from "antd";
import {ToastContainer} from "react-toastify";
import {BASE_PATH} from "./config";

import {Header} from "./containers";
import {routes} from "./routes";

import "./App.css";

import {TargetMode} from "./containers/TargetMode"
import {AuthenticatedTemplate, useMsal} from "@azure/msal-react";
import {BaseAuthRequest} from "@azure/msal-common/dist/request/BaseAuthRequest";
import {useClaims} from "./hooks/useClaims";

const Entitlements = lazy(() => import("./containers/Entitlements"));
const Attributes = lazy(() => import("./containers/Attributes"));
const Client = lazy(() => import("./containers/Client"));
const Home = lazy(() => import("./containers/Home"));
const NotFound = lazy(() => import("./containers/NotFound"));
const User = lazy(() => import("./containers/User"));

function App() {
  return (
    <Router basename={BASE_PATH}>
      <Layout style={{ minHeight: "100vh" }}>
        <Header />
        <AuthenticatedTemplate>
          <ProfileContent />
          <h2>Groups</h2>
          <GroupContent/>
          <h2>Entitlements Policy</h2>
          <h2>Access Policy</h2>
        </AuthenticatedTemplate>
        <Layout.Content className="layout">
          <Suspense fallback="Loading...">
            <Switch>
              <Route path={routes.ENTITLEMENTS} exact>
                <Entitlements />
              </Route>
              <Route path={routes.CLIENT} exact>
                <Client />
              </Route>
              <Route path={routes.USER} exact>
                <User />
              </Route>
              <Route path={routes.ATTRIBUTES} exact>
                <Attributes />
              </Route>
              <Route path={routes.HOME} exact>
                <TargetMode />
              </Route>
              <Route path={routes.CATCH}>
                <NotFound />
              </Route>
            </Switch>
          </Suspense>
        </Layout.Content>
        <ToastContainer position="bottom-center" />
      </Layout>
    </Router>
  );
}

function GroupContent() {
  const [groups, setGroups] = useState([]);
  const claimsObject = useClaims();

  if (groups.length === 0) {
    // @ts-ignore
    if (claimsObject?.Groups) {
      // @ts-ignore
      setGroups(claimsObject?.Groups)
    }

  }

  // @ts-ignore
  return(
      <ul>
        {groups.map(group => (
            <li key={group}>{group}</li>
            )
        )}
      </ul>
  )
}

function ProfileContent() {
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState("");

  const name = accounts[0] && accounts[0].name;

  function RequestAccessToken() {
    let loginRequest: BaseAuthRequest = {authority: "", correlationId: "", scopes: []};
    const request = {
      ...loginRequest,
      account: accounts[0]
    };

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance.acquireTokenSilent(request).then((response) => {
      setAccessToken(response.accessToken);
      window.sessionStorage.setItem('keycloak', response.accessToken);
    }).catch((e) => {
      instance.acquireTokenPopup(request).then((response) => {
        setAccessToken(response.accessToken);
      });
    });
  }

  return (
      <>
        <h5 className="card-title">Welcome {name}</h5>
        {accessToken ?
            <><p>Access Token Acquired!</p></>
            :
            <b>No token</b>
        }
        <Button onClick={RequestAccessToken}>Request Access Token</Button>
      </>
  );
}

App.displayName = 'App';

export default App;
