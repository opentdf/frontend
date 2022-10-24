import React, { FC, useRef } from 'react';
import { Form, Input } from 'antd';

type Props = {
    list: string[];
    onEdit: (newList: string[]) => void;
}

const EditValueList: FC<Props> = (props) => {
    const formRef = useRef<any>(null);
    const [form] = Form.useForm();
    const { list, onEdit } = props;

    const onBlurHandle = () => {
        const newValues = formRef.current?.getFieldsValue();
        onEdit(Object.values(newValues));
    };

    return (
        <Form
            form={form}
            ref={formRef}
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
                    <Input />
                </Form.Item>
            ))}
        </Form>
    );
}
// Blocking unnecessary re render because we losing validation messages after it
const disableRerender = () => true;
export default React.memo(EditValueList, disableRerender);