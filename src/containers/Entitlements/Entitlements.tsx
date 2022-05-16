import { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { Divider } from "antd";
import { routes } from "../../routes";
import ClientsTable from "./ClientsTable";
import UsersTable from "./UsersTable";
import "./Entitlements.css";

const Entitlements = () => {
  const history = useHistory();
  const [clients] = useState([]);
  const [users] = useState([]);

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
