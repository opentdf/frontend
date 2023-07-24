import { FC, useCallback, useMemo, useState, useEffect } from "react";
import { List, Table, Divider, Modal } from "antd";
import { toast } from "react-toastify";
import { Attribute } from "../../types/attributes";
import { EntityAttribute } from "../../types/entitlements";
import { Method } from "../../types/enums";
import { attributesClient, entitlementsClient } from "../../service";
import { useLazyFetch } from "../../hooks";
import { TABLE_COLUMNS } from "./constants";
import { AttributeRule, OrderCard, OrderList, EditValueList } from "../../components";
import { AttributesFiltersStore } from "../../store";
import { ATTRIBUTE_RULE_TYPES } from "../../../src/constants/attributeRules"

type Props = {
  activeAuthority: string;
  attr: Attribute;
  onChange: () => void;
};

const addKey = (item: EntityAttribute) => ({ ...item, key: item.entityId })
const attributeRules = ATTRIBUTE_RULE_TYPES.map((item) => item[0]);
type AttributeRuleType = typeof attributeRules[number]

const AttributeListItem: FC<Props> = (props) => {
  const { attr, activeAuthority, onChange } = props;
  const { name, order, state, rule } = attr;
  const [activeTabKey, setActiveTab] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [isEditValues, setIsEditValues] = useState(false);

  const [activeOrderList, setActiveOrderList] = useState<string[]>([]);
  const [activeAttribute, setActiveAttribute] = useState<Attribute>();
  const [activeRule, setActiveRule] = useState<AttributeRuleType>();

  const [getAttrEntities, { loading, data: entities }] = useLazyFetch<EntityAttribute[]>(entitlementsClient);
  const [updateAttribute] = useLazyFetch(attributesClient);

  useEffect(() => {
    const unsubscribeAttributesFiltersStore = AttributesFiltersStore.subscribe(
      (store) => store.collapseValue,
      (watched, allState, prevWatched) => {
        if (Number(watched)) {
          setActiveTab('');
        }
      }
    );

    return () => unsubscribeAttributesFiltersStore();
  }, [])

  const closeAll = useCallback(() => {
    setIsEdit(false);
    setIsEditValues(false);
    if (activeAttribute?.order) {
      setActiveOrderList(activeAttribute?.order);
    }
  }, [activeAttribute])

  const toggleEdit = useCallback(() => {
    setIsEdit(!isEdit);
  }, [isEdit]);

  const valueEdit = useCallback(() => {
    setIsEditValues(!isEditValues);
    setActiveRule(activeAttribute?.rule);
  }, [isEditValues, activeAttribute]);

  const activeOrderItem = useMemo(
    () => order.find((orderItem) => orderItem === activeTabKey),
    [activeTabKey, order],
  );

  const tabList = useMemo(
    () =>
      order.map((orderItem) => ({
        key: orderItem,
        tab: orderItem,
      })),
    [order],
  );

  const handleOrderClick = useCallback(
    async (attribute: Attribute, order: string): Promise<void> => {
      const { name } = attribute;

      try {
        await getAttrEntities({
          method: Method.GET,
          path: '/v1/entity/attribute',
          params: { name }
        });
      } catch (error) {
        toast.error('Could not get entities');
      }

      setActiveTab(order);
      setActiveOrderList(attribute.order);
      setActiveAttribute(attribute);
    },
    [getAttrEntities],
  );

  const handleTabChange = useCallback(
    (tab: string) => {
      handleOrderClick(attr, tab);

      AttributesFiltersStore.update(store => {
        if (store) {
          store.collapseValue = '0';
        }
      })
    },
    [attr, handleOrderClick],
  );

  const handleClose = useCallback(() => {
    setActiveTab("");
  }, []);

  const handleSaveClick = useCallback(async () => {
    const isSomeItemEmpty = activeOrderList.some((item) => !item.trim());
    if (isSomeItemEmpty) {
      return;
    }

    const data = {
      authority: activeAuthority,
      name: activeAttribute?.name,
      order: activeOrderList,
      rule: activeRule,
      state: activeAttribute?.state,
    };

    try {
      await updateAttribute({
        method: Method.PUT,
        path: `/definitions/attributes`,
        data,
      });
      toast.success(isEditValues ? "Order value was updated!" : "Rule was updated!");
    } catch (error) {
      toast.error("Could not update rules!");
    }
    handleClose();
    onChange();
  }, [
    activeAttribute,
    activeAuthority,
    activeOrderList,
    activeRule,
    isEditValues,
    updateAttribute,
    handleClose,
    onChange
  ]);

  const handleDeleteClick = useCallback(async () => {
    const data = {
      authority: activeAuthority,
      name: activeAttribute?.name,
      order: activeOrderList,
      rule: activeAttribute?.rule,
      state: activeAttribute?.state,
    };


    try {
      await attributesClient.delete('/definitions/attributes', {
        data,
      });

      toast.success(`Attribute ${activeAttribute?.name} deleted`);

    } catch (error: any) {
      let errorText = error.message;

      if (error.message.includes('code 500')) {
        errorText = 'Something went wrong.'
      }

      toast.error(errorText)
    }
    handleClose();
    onChange();
  }, [
    activeAttribute,
    activeAuthority,
    activeOrderList,
    handleClose,
    onChange
  ]);

  const onDeleteAttribute = useCallback((): void => {
    Modal.confirm({
      title: 'Delete Attribute',
      content: 'Are you sure you want to remove this attribute?',
      onOk: () => handleDeleteClick(),
      okText: 'Delete',
      okButtonProps: {
        id: 'confirm-attribute-deletion'
      },
      cancelButtonProps: {
        id: 'cancel-attribute-deletion'
      }
    })},
  [handleDeleteClick]);

  const handleRuleChange = useCallback((rule) => {
    setActiveRule(rule);
  }, [setActiveRule]);

  const handleReorder = useCallback((list) => {
    setActiveOrderList(list);
  }, []);

  const handleEditValues = useCallback(async (newList: string[]) => {
    setActiveOrderList(newList);
  }, [setActiveOrderList]);

  return (
    <List.Item>
      <OrderCard
        activeTabKey={activeTabKey}
        isActive={!!activeOrderItem}
        isEdit={!!activeOrderItem && (isEdit || isEditValues)}
        name={name}
        onClose={handleClose}
        onDeleteAttribute={onDeleteAttribute}
        onSaveClick={handleSaveClick}
        onTabChange={handleTabChange}
        state={state}
        rule={rule}
        tabList={tabList}
        toggleEdit={toggleEdit}
        valueEdit={valueEdit}
        closeAll={closeAll}
      >
        {activeOrderItem && (
          <>
            <Table
              className="table"
              id="entitlements-table"
              columns={TABLE_COLUMNS}
              dataSource={entities?.map(addKey)}
              loading={loading}
            />

            {isEdit && (
              <>
                <Divider orientation="left">Edit rule</Divider>
                <AttributeRule onRuleChange={handleRuleChange} />
                <div>
                  <OrderList
                    list={activeOrderList}
                    onReorder={handleReorder}
                  />
                </div>
              </>
            )}
            {isEditValues && (
                <>
                  <Divider orientation="left">Edit values</Divider>
                  <div>
                    <EditValueList
                        list={activeOrderList}
                        onEdit={handleEditValues}
                    />
                  </div>
                </>
            )}
          </>
        )}
      </OrderCard>
    </List.Item>
  );
};

AttributeListItem.displayName = 'AttributeListItem';

export default AttributeListItem;
