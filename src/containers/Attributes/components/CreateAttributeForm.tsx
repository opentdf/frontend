import { FC, useMemo } from "react";
import { Button, Form, Input, Select, Typography } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";

import { ATTRIBUTE_RULE_TYPES } from "../../../constants/attributeRules";
import { Attribute } from "../../../types/attributes";

const { Item, List } = Form;

type CreateAttributeValues = Omit<Attribute, "authority">;

type Props = {
  authority: string;
  onFinish: (values: CreateAttributeValues) => void;
};

const CreateAttributeForm: FC<Props> = (props) => {
  const { authority, onFinish } = props;

  const stateOptions = useMemo(
    () => ATTRIBUTE_RULE_TYPES.map(([value, label]) => ({ value, label })),
    [],
  );

  const formLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 5 }, md: { span: 5 }, lg: { span: 4 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 19 }, md: { span: 19 }, lg: { span: 20 } }
  }

  return (
    <>
      <Typography.Title level={3}>
        Attribute for
        <Typography.Text italic> {authority}</Typography.Text>
      </Typography.Title>

      <Form
        onFinish={onFinish}
        {...formLayout}
        initialValues={{ order: [undefined], rule: "hierarchy" }}
      >
        <Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input name value!' }]}
        >
          <Input />
        </Item>

        <Item
          name="rule"
          label="Rule"
          rules={[{ required: true, message: 'Please input rule value!' }]}
          data-test-id="rule-form-item"
        >
          <Select options={stateOptions} id="rule-options"/>
        </Item>

        <Item
          name="state"
          label="State"
          rules={[{ required: true }]}
          initialValue="published"
          hidden
        >
          <Input />
        </Item>

        <List name="order">
          {(fields, { add, remove }) => {
            const lastIndex = fields.length - 1;

            return fields.map((field, index) => {
              const isLast = lastIndex === index;

              // order is a string[].
              // We need at least one value in array.
              // field.key is kinda ['0', '1', ...].
              // So !Number('0') returns true, everything else is false
              const isRequired = !Number(field.key);

              return (
                <Item
                  required={isRequired}
                  label="Order"
                  key={field.key}
                >
                  <Item {...field} rules={[{ required: isRequired, message: 'Please input order value!' }]} noStyle>
                    <Input style={{ width: "calc(100% - 32px)" }} />
                  </Item>

                  <Item noStyle>
                    {isLast ? (
                      <Button
                        //! Had to use like this because https://github.com/ant-design/ant-design/issues/24698
                        onClick={() => add()}
                        icon={<PlusCircleOutlined />}
                      />
                    ) : (
                      <Button
                        onClick={() => remove(field.name)}
                        icon={<MinusCircleOutlined />}
                      />
                    )}
                  </Item>
                </Item>
              );
            });
          }}
        </List>

        <Item>
          <Button
            type="primary"
            htmlType="submit"
            id="create-attribute-button"
          >
            Submit
          </Button>
        </Item>
      </Form>
    </>
  );
};

CreateAttributeForm.displayName = 'CreateAttributeForm';

export default CreateAttributeForm;
