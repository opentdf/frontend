import { Divider } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { entityClient } from "../../service";
import AssignAttributeForm from "./AssignAttributeForm";
import ClientTable from "./ClientTable";
import { useEntitlements } from "./hooks/useEntitlement";
import { useClient } from "../../hooks";

//TODO: switch to correct entityID. Should be 'browsertest' instead of `id`

const Client = () => {
  const { id } = useParams<{ id: string }>();

  const [entityId, setEntityId] = useState(id);

  const { client } = useClient(id);
  console.log(`client`, client);
  const { entityAttributes } = useEntitlements(entityId);

  useEffect(() => {
    setEntityId(id);
  }, [id]);

  const onDeleteKey = useCallback(
    (attribute) => {
      entityClient.delete(
        `/entitlement/v1/entity/${entityId}/attribute/${encodeURIComponent(
          attribute,
        )}`,
      );
    },
    [entityId],
  );

  return (
    <section>
      <AssignAttributeForm entityId={entityId} />

      <Divider />

      <Divider />

      <article>
        <h2>User {id}</h2>

        <ClientTable
          onDeleteKey={onDeleteKey}
          entityAttributes={entityAttributes}
        />
        <Divider />

        <pre>{JSON.stringify(client, null, 2)}</pre>
      </article>
    </section>
  );
};

export default Client;
