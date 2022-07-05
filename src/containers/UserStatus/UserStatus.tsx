import { useKeycloak } from "@react-keycloak/web";
import { Avatar, Button, Image } from "antd";
import { SelectRealm } from "./SelectRealm";
import logo from '../../assets/openTDF.png';

const UserStatus = () => {
  const { keycloak } = useKeycloak();

  return (
    <>
      <SelectRealm />
      {keycloak.authenticated && (
        <>
          <Avatar
            style={{ marginLeft: '0.5rem' }}
            src={
              <Image
                src={logo}
                preview={false}
                style={{ width: 32 }}
              />
            }
            size={32}
          >
            {keycloak.subject}
          </Avatar>
          <Button
            onClick={() => keycloak.logout()}
            data-test-id="logout-button"
          >
            Log out
          </Button>
        </>
      )}

      {!keycloak.authenticated && (
        <Button
          type="primary"
          onClick={() => keycloak.login()}
          data-test-id="login-button"
        >
          Log in
        </Button>
      )}
    </>
  );
};

UserStatus.displayName = 'UserStatus';

export default UserStatus;
