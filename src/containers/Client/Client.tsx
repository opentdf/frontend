import { Divider } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";

import { Method } from "../../types/enums";
import { entitlementsClient } from "../../service";
import { useClient } from "../../hooks";
import { useEntitlements } from "./hooks/useEntitlement";

import AssignAttributeForm from "./AssignAttributeForm";
import ClientTable from "./ClientTable";
import { TableData } from "../../types/table";
import { toast } from "react-toastify";

const Client = () => {
  const { id } = useParams<{ id: string }>();

  const [entityId, setEntityId] = useState(id);

  const { client } = useClient(id);

  const config = useMemo(
    () => ({
      method: Method.GET,
      path: `/entitlements`,
      params: { entityId },
    }),
    [entityId],
  );

  const {
    getEntitlements,
    data: entityAttributes,
    loading,
  } = useEntitlements();

  useEffect(() => {
    getEntitlements(config);
  }, [config, getEntitlements]);

  useEffect(() => {
    setEntityId(id);
  }, [id]);

  const onDeleteKey = useCallback(
    (entity: TableData) => {
      entitlementsClient
        .delete(`/entitlements/${entity.entityId}`, {
          data: [entity.attribute],
        })
        .then(() => {
          getEntitlements(config);
          toast.success(`Entitlement ${entity.attribute} deleted`);
        })
        .catch(({ message }) => toast.error(message));
    },
    [config, getEntitlements],
  );

  const onAssignAttribute = useCallback(() => {
    const config = {
      method: Method.GET,
      path: `/entitlements`,
      params: { entityId },
    };

    getEntitlements(config);
  }, [entityId, getEntitlements]);

  const clientTableData = useMemo(
    () =>
      entityAttributes?.reduce((acc: TableData[], item): TableData[] => {
        const transformedItem = Object.entries(item).flatMap(([key, values]) =>
          values.map((attribute) => ({
            attribute,
            entityId: key,
          })),
        );

        return [...acc, ...transformedItem];
      }, []),
    [entityAttributes],
  );

  return (
    <section>
      <AssignAttributeForm
        entityId={entityId}
        onAssignAttribute={onAssignAttribute}
      />
      <Divider />
      <article>
        <h2>Client {client?.clientId}</h2>
        <ClientTable
          onDeleteKey={onDeleteKey}
          data={clientTableData}
          loading={loading}
        />
      </article>
    </section>
  );
};

Client.displayName = 'Client';

export default Client;
