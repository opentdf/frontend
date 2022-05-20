import { Button, Form } from "antd";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { AttributesFiltersStore } from "../../store";
import { useUpdateEntitlement } from "./hooks/useEntitlement";
import { useAuthorities, useDefinitionAttributes } from "../../hooks";
import { Select, AutoComplete } from "../../components";
import { Method } from "../../types/enums";
import { toast } from "react-toastify";

const { Item, useForm } = Form;

type Option = { label: string; value: string };

type Props = {
  entityId: string;
  onAssignAttribute: () => void;
};

type FormValues = {
  authority: string;
  name: string;
  value: string;
};

const AssignAttributeForm: FC<Props> = (props) => {
  const { entityId, onAssignAttribute } = props;
  useAuthorities();

  const [form] = useForm();
  const authorities = AttributesFiltersStore.useState(s => s.possibleAuthorities);
  const authority = AttributesFiltersStore.useState(s => s.authority);
  const { attrs, getAttrs, loading } = useDefinitionAttributes(authority);
  const [updateEntitlement] = useUpdateEntitlement();

  const [selectedName, setSelectedName] = useState();
  const [attributeValOptions, setAttributeValOptions] = useState<Option[]>();

  const authoritiesOptions = useMemo(
    () =>
      authorities.map((authority) => ({
        label: authority,
        value: authority,
      })),
    [authorities],
  );

  const nameOptions = useMemo(
    () =>
      attrs.map((attribute) => ({
        label: attribute.name,
        value: attribute.name,
      })),
    [attrs],
  );

  useEffect(() => {
    const selectedAttr = attrs.find(
      (attribute) => attribute.name === selectedName,
    );

    const options = selectedAttr?.order.map((option) => ({
      label: option,
      value: option,
    }));

    setAttributeValOptions(options);
  }, [attrs, selectedName]);

  const onAttributeName = useCallback((selectedVal) => {
    setSelectedName(selectedVal);
  }, []);

  const onFinish = useCallback((values: FormValues) => {
      const data = `${values.authority}/attr/${values.name}/value/${values.value}`;

      updateEntitlement({
        method: Method.POST,
        path: `/entitlements/${entityId}`,
        data: [data],
      })
        .then(() => {
          toast.success("Entitlement updated!");
          onAssignAttribute();
        })
        .catch(() => toast.error("Could not update entitlement"))
        .finally(form.resetFields);
    },
    [entityId, form, onAssignAttribute, updateEntitlement],
  );

  const handleAuthorityChange = async (namespace: string) => {
    await getAttrs(namespace);
  };

  return (
    <Form
      form={form}
      layout="inline"
      size="middle"
      onFinish={onFinish}
    >
      <Item
          label="Authority Namespace"
          name="authority"
          rules={[{ required: true, message: 'Please select Authority Namespace!' }]}
      >
        <Select
          defaultActiveFirstOption
          name="authority"
          onChange={handleAuthorityChange}
          options={authoritiesOptions}
          placeholder="Add authority"
          style={{ width: 200 }}
        />
      </Item>

      <Item
          label="Attribute Name"
          name="name"
          rules={[{ required: true, message: 'Please select Attribute Name!' }]}
      >
        <AutoComplete
          name="name"
          onSelect={onAttributeName}
          options={nameOptions}
          placeholder="Add name"
          style={{ width: 200 }}
        />
      </Item>

      <Item
          label="Attribute Value"
          name="value"
          rules={[{ required: true, message: 'Please select Attribute Value!' }]}
      >
        <AutoComplete
          name="value"
          options={attributeValOptions}
          placeholder="Add value"
          style={{ width: 200 }}
        />
      </Item>

      <Item>
        <Button
          htmlType="submit"
          id="assign-submit"
          loading={loading}
          type="primary"
        >
          Submit
        </Button>
      </Item>
    </Form>
  );
};

AssignAttributeForm.displayName = 'AssignAttributeForm';

export default AssignAttributeForm;
