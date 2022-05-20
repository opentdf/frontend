import { Select as AntdSelect, SelectProps, Form } from "antd";
import { useCallback, useEffect, useState } from "react";

const { Option } = AntdSelect;

const Select = (props: SelectProps & { name: string }) => {
  const {
    defaultActiveFirstOption,
    disabled,
    placeholder,
    style,
    options,
    onChange,
    name,
  } = props;

  const [componentOptions, setComponentOptions] = useState(options);

  useEffect(() => {
    setComponentOptions(options);
  }, [options]);

  const onSearch = useCallback(
    (searchVal) => {
      const filteredOptions = options?.filter(({ value }) => {
        return String(value).match(new RegExp(searchVal, "gi"));
      });

      setComponentOptions(filteredOptions);
    },
    [options],
  );

  const filterOptionCb = useCallback((input, option) => {
    if (option && option.children) {
      return String(option.children).toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    return false;
  }, []);

  return (
    <Form.Item name={name}>
      <AntdSelect
        defaultActiveFirstOption={defaultActiveFirstOption}
        disabled={disabled}
        style={style}
        showSearch
        placeholder={placeholder}
        onSearch={onSearch}
        onChange={onChange}
        filterOption={filterOptionCb}
      >
        {componentOptions?.map(opt => <Option key={opt.key + '-opt'} value={opt.value}>{opt.value}</Option>)}
      </AntdSelect>
    </Form.Item>
  );
};

Select.displayName = 'Select';

export default Select;
