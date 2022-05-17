import { useIsAuthenticated, useAccount } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import {Avatar, Button} from "antd";

const UserStatus = () => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = useAccount();
  return (
    <>
      {isAuthenticated && (
          <>
            <Avatar size={32}>{account?.username}</Avatar>
            <Button
                onClick={() => {}}
                data-test-id="logout-button"
            >
              Log out
            </Button>
          </>
      )}

      {!isAuthenticated && (
          <Button
              type="primary"
              onClick={() => {instance.logoutRedirect().catch(e => console.error)}}
              data-test-id="login-button"
          >
            Log in
          </Button>
      )}
    </>
  );
};

export default UserStatus;
