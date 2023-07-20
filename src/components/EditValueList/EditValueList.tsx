import React, {FC, useEffect, useState} from 'react';
import { Form, Input, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

type Props = {
    list: string[];
    onEdit: (newList: string[]) => void;
}

const EditValueList: FC<Props> = (props) => {
    const [form] = Form.useForm();
    const { onEdit } = props;
    const [list, setList] = useState<string[]>(props.list);

    useEffect(() => {
        onEdit(list.filter((item: string) => !!item));
    }, [list]);

    const onBlurHandle = () => {
        setList(form.getFieldsValue().values);
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
              {(fields, { add, remove }, { errors }) => (
                <>
                    {fields.map((field, index) => (
                      <Form.Item
                        required={false}
                        key={field.key}
                      >
                          <Form.Item
                            noStyle
                            {...field}
                            rules={[{ required: true, message: 'Order value should not be blank' }]}
                          >
                              <Input
                                id={'edit-value-input-field'}
                                onBlur={onBlurHandle}
                                style={{
                                    width: '98%',
                                }}
                              />
                          </Form.Item>

                          <DeleteOutlined
                            style={{
                                width: '2%',
                            }}
                            onClick={() => {
                                remove(field.name);
                                setList(form.getFieldsValue().values);
                            }}
                          />
                      </Form.Item>
                    ))}
                    <Form.Item>
                        <Button
                          onClick={() => add()}
                        >
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