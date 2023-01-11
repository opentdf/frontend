import { Button, Modal, Spin, Table } from "antd";
import { useAuthorities } from "../../hooks";
import { useCallback, useMemo } from "react";
import { attributesClient } from "../../service";
import { AttributesFiltersStore } from "../../store";
import { toast } from "react-toastify";
import styles from './Authorities.module.css';

type TableData = { authority: string; };

const Authorities = () => {
  const activeAuthority = AttributesFiltersStore.useState(s => s.authority);
  const { authorities, loading, getAuthorities } = useAuthorities();

  const data: TableData[] = authorities.map((authority) => {
    return { authority };
  });

  const onDeleteKey = useCallback(
    async ({ authority }) => {
      try {
        await attributesClient.delete('/authorities', {
          data: { authority },
        });
        await getAuthorities();
        toast.success(`Authority ${authority} deleted`);
        if (activeAuthority === authority) {
          AttributesFiltersStore.update(s => {
            s.authority = authorities[0] || ''
          });
        }
      } catch (error: any) {
        let errorText = error.message;

        if (error.message.includes('code 405')) {
          errorText = 'Something went wrong. Make sure there are no attributes assigned to this Authority'
        }

        toast.error(errorText)
      }
    },
    [
      getAuthorities,
      activeAuthority,
      authorities,
    ],
  );

  const onDelete = useCallback((row: TableData): void => {
    Modal.confirm({
      title: 'Delete Authority',
      content: 'Are you sure you want to remove an authority? Removal may affect access to correspondent data',
      onOk: () => onDeleteKey(row),
      okText: 'Delete',
      okButtonProps: {
        id: 'delete-authority'
      },
      cancelButtonProps: {
        id: 'cancel-deletion'
      }
    })},
  [onDeleteKey]);

  const columns = useMemo(
    () => [
      {
        dataIndex: 'authority',
        key: 'authority',
        title: 'Authority',
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (row: TableData) => (
          <Button
            type='link'
            style={{ paddingLeft: '0' }}
            onClick={() => onDelete(row)}
            id='delete-authority-button'
          >
            Delete
          </Button>
        ),
      },
    ],
    [onDelete],
  );

  return (
    <>
      { loading
        ? (
        <div className={styles.loadingWrapper}>
          <h1 className={styles.loading}>loading...</h1>
          <Spin size="large" />
        </div>
      )
      : (
        <Table
          bordered
          className="table"
          columns={columns}
          dataSource={data}
          pagination={false}
          loading={loading}
        />
      )}
  </>
  );
};

Authorities.displayName = 'Authorities';

export default Authorities;
