import React, { FC, useState } from 'react';
import { Form, Input, Button, Divider, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

type Props = {
    list: string[];
    onEdit: (newList: string[]) => void;
}

type SelectOption = {
  value: string;
  label: string;
}

const toOptions = (item: string) => ({ value: item, label: item })

const EditValueList: FC<Props> = (props) => {
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>(props.list.map(toOptions));
  const [form] = Form.useForm();
  const { onEdit } = props;

  const onBlurHandle = () => {
    onEdit(form.getFieldsValue().values);
    setSelectOptions(form.getFieldsValue().values.map(toOptions));
  };

  const onRemoveHandle = (remove: (index: number) => void, index: number) => {
    remove(index);
    onEdit(form.getFieldsValue().values);
    setSelectOptions(form.getFieldsValue().values.map(toOptions));
  };

  const onChangeHandle = () => {

  }

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
                              placeholder="Order Value"
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

       <Divider orientation="left">Group By</Divider>
       <Form.Item>
         <Input placeholder="Name" />
       </Form.Item>
       <Form.Item>
         <Select
           placeholder="Order Value"
           options={selectOptions}
           onChange={onChangeHandle}
         />
       </Form.Item>
     </Form>
  );
}
// Blocking unnecessary re render because we losing validation messages after it
const disableRerender = () => true;
export default React.memo(EditValueList, disableRerender);