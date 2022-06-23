import { FC, memo, useCallback } from "react";
import { Affix, Card, Collapse, Typography } from "antd";
import { toast } from "react-toastify";
import { useLazyFetch } from "../../hooks/useFetch";
import { Attribute } from "../../types/attributes";
import { attributesClient } from "../../service";
import { Method } from "../../types/enums";
import { CreateAttributeForm, CreateAuthorityForm } from "./components";
import styles from './CreateAttribute.module.css';

const { Panel } = Collapse;

type Props = {
  authority: string;
  collapseValue: string;
  onAddAttr: (attr: Attribute) => void;
  onAddNamespace: (namespace: string) => void;
  onCollapseChange: () => void;
};

type CreateAttributeValues = Omit<Attribute, "authority">;

const CreateAttribute: FC<Props> = (props) => {
  const { authority, collapseValue, onAddAttr, onAddNamespace, onCollapseChange } = props;

  const [createAuthority] = useLazyFetch(attributesClient);
  const [createAttributes] = useLazyFetch(attributesClient);

  const handleCreateAuthority = useCallback(
    async ({ authority }) => {
      try {
        const { data } = await createAuthority<string[]>({
          method: Method.POST,
          path: '/authorities',
          data: { authority },
        });

        const [ lastItem ] = data.slice(-1);

        toast.success("Authority was created");

        onAddNamespace(lastItem);
      } catch (e) {
        toast.error("Authority was not created");
      }
    },
    [createAuthority, onAddNamespace, onCollapseChange],
  );

  const handleCreateAttribute = (values: CreateAttributeValues) => {
    createAttributes<Attribute>({
      method: Method.POST,
      path: `/definitions/attributes`,
      data: { ...values, authority },
    })
      .then(({ data }) => {
        onAddAttr(data);
        toast.success(`Attribute created for ${authority}`);
      })
      .catch(() => {
        toast.error(`Attribute was no created for ${authority}`);
      });
  };

  return (
    <Affix offsetBottom={1}>
      <div>
        <Collapse
          activeKey={collapseValue}
          onChange={onCollapseChange}
        >
          <Panel
            header={<Typography.Title level={2}>New</Typography.Title>}
            key="1"
          >
            <Card>
              <Card.Grid className={styles.createAttribute}>
                <CreateAuthorityForm onFinish={handleCreateAuthority} />
              </Card.Grid>

              <Card.Grid className={styles.createAttribute}>
                <CreateAttributeForm
                  authority={authority}
                  onFinish={handleCreateAttribute}
                />
              </Card.Grid>
            </Card>
          </Panel>
        </Collapse>
      </div>
    </Affix>
  );
};

CreateAttribute.displayName = 'CreateAttribute';

export default memo(CreateAttribute);
