import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { Divider } from "antd";
import { getCancellationConfig, keyCloakClient } from "../../service";
import { routes } from "../../routes";
import ClientsTable from "./ClientsTable";
import UsersTable from "./UsersTable";
import { components } from "../../keycloak";
import { REALM } from "../../config";
import { useKeycloak } from "@react-keycloak/web";
import "./Entitlements.css";

const Entitlements = () => {
  const history = useHistory();
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    const { token, cancel } = getCancellationConfig();

    if (initialized && keycloak.authenticated) {
      keyCloakClient
        .get(`/admin/realms/${REALM}/clients`, {
          cancelToken: token,
        })
        .then(({ data }) => {
          const clientsWithMapper = data.filter((element: components["schemas"]["ClientRepresentation"]) => {
            return element.protocolMappers?.find((pm => pm.protocolMapper === 'virtru-oidc-protocolmapper'));
          })
          setClients(clientsWithMapper);
        });

      keyCloakClient
        .get(`/admin/realms/${REALM}/users`, { cancelToken: token })
        .then(({ data }) => setUsers(data));
    }


    return () => cancel("Operation canceled by the user.");
  }, [keycloak, initialized]);

  const onClientRecordClick = useCallback(
    (id) => {
      history.push(`${routes.CLIENTS}/${id}`);
    },
    [history],
  );

  const onUserRecordClick = useCallback(
    (id) => {
      history.push(`${routes.USERS}/${id}`);
    },
    [history],
  );

  const formattedClients = useMemo(
    () =>
      clients.map(({ clientId, id, enabled }) => ({ clientId, id, enabled })),
    [clients],
  );

  const formattedUsers = useMemo(
    () => users.map(({ username, id, enabled }) => ({ username, id, enabled })),
    [users],
  );

  return (
    <section>
      <ClientsTable
        data={formattedClients}
        loading={!clients.length}
        onRowClick={onClientRecordClick}
      />

      <Divider />

      <UsersTable
        data={formattedUsers}
        loading={!users.length}
        onRowClick={onUserRecordClick}
      />
    </section>
  );
};

Entitlements.displayName = 'Entitlements';

export default Entitlements;
