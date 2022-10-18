import React, { FC, useRef } from 'react';
import { Input } from 'antd';

type Props = {
    list: string[];
    onEdit: (newList: string[]) => void;
}

const EditValueList: FC<Props> = (props) => {
    const listRef = useRef<HTMLUListElement>(null);
    const { list, onEdit } = props;

    const onBlurHandle = () => {
        const newValues = list.map((item, index) => {
            const input = listRef.current?.children.item(index)?.children.item(0) as HTMLInputElement;
            return input?.value;
        });
        onEdit(newValues);
    };

    return (
        <ul className="order-list" ref={listRef}>
            {list.map((item) => (
                <li
                    className="order-list__item"
                    key={item}
                    style={{ borderBottom: '0px' }}
                >
                    <Input defaultValue={item} onBlur={onBlurHandle} />
                </li>
            ))}
        </ul>
    );
}

export default EditValueList;