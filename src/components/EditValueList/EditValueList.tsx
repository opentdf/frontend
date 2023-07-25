import React, {FC, useState, useEffect} from 'react';
import { Form, Input, Button, Divider, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

type Props = {
    list: string[];
    groupByValue?: string;
    onEditOrderValues: (newList: string[]) => void;
    onEditGroupBy: (value: string) => void;
}

type SelectOption = {
  value: string;
  label: string;
}

const toOptions = (item: string) => ({ value: item, label: item })

const EditValueList: FC<Props> = (props) => {
  const [selectValue, setSelectValue] = useState(props.groupByValue);
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>(props.list.map(toOptions));
  const [form] = Form.useForm();
  const { onEditOrderValues, onEditGroupBy } = props;

  useEffect(() => {
    onEditGroupBy(selectValue || '');
  }, [selectValue, onEditGroupBy]);

  const onOrderValueBlur = () => {
    onEditOrderValues(form.getFieldsValue().values);
    setSelectOptions(form.getFieldsValue().values.map(toOptions));
  };

  const onRemoveOrderValue = (remove: (index: number) => void, index: number) => {
    if (selectOptions[index].value === selectValue) {
      setSelectValue(undefined);
    }
    remove(index);
    onEditOrderValues(form.getFieldsValue().values);
    setSelectOptions(form.getFieldsValue().values.map(toOptions));
  };

  const onSelectChange = (value: string) => {
    setSelectValue(value);
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
                              id={`edit-value-input-field-${field.name}`}
                              onBlur={onOrderValueBlur}
                              placeholder="Order Value"
                            />
                        </Form.Item>

                        <Button
                          style={{ left: '-1px' }}
                          icon={<DeleteOutlined />}
                          onClick={() => onRemoveOrderValue(remove, field.name)}
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
         <Select
           value={selectValue}
           allowClear
           placeholder="Order Value"
           options={selectOptions}
           onChange={onSelectChange}
         />
       </Form.Item>
     </Form>
  );
}
// Blocking unnecessary re render because we losing validation messages after it
const disableRerender = () => true;
export default React.memo(EditValueList, disableRerender);