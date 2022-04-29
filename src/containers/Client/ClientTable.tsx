import {FC, useCallback, useMemo} from "react";
import {Table, Button, Modal} from "antd";

type TableData = { attribute: string; entityId: string };

type Props = {
  data?: TableData[];
  loading: boolean;
  onDeleteKey: (row: TableData) => void;
};

const ClientTable: FC<Props> = (props) => {
  const { onDeleteKey, data, loading } = props;

  const onDelete = useCallback((row: TableData): void => {
    Modal.confirm({
      title: 'Delete Attribute',
      content: 'Are you sure you want to remove an attribute for the Entity?  Removal may affect access to correspondent data',
      onOk: () => onDeleteKey(row),
      okText: 'Delete',
      okButtonProps: {
        id: 'delete-attr'
      }
    })}, [onDeleteKey]);

  const columns = useMemo(
    () => [
      {
        dataIndex: "attribute",
        key: "attribute",
        title: "Attribute",
      },
      {
        dataIndex: "entityId",
        key: "entityId",
        title: "EntityId",
      },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        render: (row: TableData) => (
          <Button
            type="link"
            onClick={() => onDelete(row)}
          >
            Delete
          </Button>
        ),
      },
    ],
    [onDelete],
  );

  return (
    <Table
      bordered
      className="table"
      columns={columns}
      dataSource={data}
      pagination={false}
      loading={loading}
    />
  );
};

ClientTable.displayName = 'ClientTable';

export default ClientTable;
