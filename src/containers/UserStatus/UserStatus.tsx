import { IPublicClientApplication } from "@azure/msal-browser";
import {useIsAuthenticated} from "@azure/msal-react";
import {useMsal} from "@azure/msal-react";
import {Avatar, Button} from "antd";

const UserStatus = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  function handleLogout(instance: IPublicClientApplication) {
    instance.logoutRedirect().catch(e => {
      console.error(e);
    });
  }

  return (
    <>
      {isAuthenticated && (
          <>
            <Avatar>{accounts[0].name?.split(" ").map((n)=>n[0]).join("")}</Avatar>
            <Button
                onClick={() => handleLogout(instance)}
                data-test-id="logout-button"
            >
              Log out
            </Button>
          </>
      )}

      {!isAuthenticated && (
          <Button
              type="primary"
              data-test-id="login-button"
          >
            Log in
          </Button>
      )}
    </>
  );
};

export default UserStatus;
