import React, { FC } from 'react';
import { Form, Input, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

type Props = {
    list: string[];
    onEdit: (newList: string[]) => void;
}

const EditValueList: FC<Props> = (props) => {
    const [form] = Form.useForm();
    const { onEdit } = props;

    const onBlurHandle = () => {
        onEdit(form.getFieldsValue().values);
    };

    const onRemoveHandle = (remove: (index: number) => void, index: number) => {
        remove(index);
        onEdit(form.getFieldsValue().values);
    };

    return (
       <Form
         form={form}
         name="form"
       >
          <Form.List
            name="values"
            initialValue={props.list}
          >
              {(fields, { add, remove }) => (
                 <>
                    {fields.map((field) => (
                       <div style={{ display: "flex", width: '100%' }} key={field.key}>
                          <Form.Item
                            {...field}
                            style={{ flex: '1' }}
                            rules={[{ required: true, message: 'Order value should not be blank' }]}
                          >
                              <Input
                                id={'edit-value-input-field'}
                                onBlur={onBlurHandle}
                              />
                          </Form.Item>

                          <Button
                            style={{ left: '-1px' }}
                            icon={<DeleteOutlined />}
                            onClick={() => onRemoveHandle(remove, field.name)}
                          />
                       </div>
                    ))}
                    <Form.Item>
                        <Button onClick={() => add('')}>
                            Add field
                        </Button>
                    </Form.Item>
                 </>
              )}
          </Form.List>
       </Form>
    );
}
// Blocking unnecessary re render because we losing validation messages after it
const disableRerender = () => true;
export default React.memo(EditValueList, disableRerender);