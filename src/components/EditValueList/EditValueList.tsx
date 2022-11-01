import React, { FC } from 'react';
import { Form, Input } from 'antd';

type Props = {
    list: string[];
    onEdit: (newList: string[]) => void;
}

const EditValueList: FC<Props> = (props) => {
    const [form] = Form.useForm();
    const { list, onEdit } = props;

    const onBlurHandle = () => {
        onEdit(Object.values(form.getFieldsValue()));
    };

    return (
        <Form
            form={form}
            autoComplete="off"
            initialValues={{ ...list }}
            onBlur={onBlurHandle}
        >
            {list.map((item, index) => (
                <Form.Item
                    key={item}
                    name={index}
                    rules={[{ required: true, message: 'Order value should not be blank' }]}
                >
                    <Input id={'edit-value-input-field'}/>
                </Form.Item>
            ))}
        </Form>
    );
}
// Blocking unnecessary re render because we losing validation messages after it
const disableRerender = () => true;
export default React.memo(EditValueList, disableRerender);