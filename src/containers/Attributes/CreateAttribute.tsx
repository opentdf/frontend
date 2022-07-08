import {FC, memo, useCallback, useEffect} from "react";
import { Affix, Card, Collapse, Typography } from "antd";
import { toast } from "react-toastify";
import { useLazyFetch } from "../../hooks/useFetch";
import { Attribute } from "../../types/attributes";
import { attributesClient } from "../../service";
import { Method } from "../../types/enums";
import { CreateAttributeForm, CreateAuthorityForm } from "./components";
import styles from './CreateAttribute.module.css';
import {AttributesFiltersStore} from "../../store";

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
    [createAuthority, onAddNamespace],
  );

  const handleCreateAttribute = (values: CreateAttributeValues) => {
    const formData = {
      ...values,
      // Filter falsy values: e.g. null, undefined, 0, ""
      // Each value is a string, so "0" is valid
      order: values.order.filter(Boolean),
      authority
    };

    createAttributes<Attribute>({
      method: Method.POST,
      path: '/definitions/attributes',
      data: formData,
    })
      .then(({ data }) => {
        onAddAttr(data);
        toast.success(`Attribute created for ${authority}`);
      })
      .catch(() => {
        toast.error(`Attribute was no created for ${authority}`);
      });
  };

  const onCollapseClose = useCallback((event): void => {
    if (event.keyCode === 27 && collapseValue !== '0') {
      AttributesFiltersStore.update(store => {
        if (store) {
          store.collapseValue = '0';
        }
      })
    }
  }, [collapseValue])

  useEffect(() => {
    window.addEventListener('keydown', onCollapseClose);

    return () => {
      window.removeEventListener('keydown', onCollapseClose);
    }
  }, [onCollapseClose]);

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
