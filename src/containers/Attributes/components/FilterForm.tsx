import { Button, Col, Form, Input, Row } from "antd";
import { AttributesFiltersStore } from '../../../store';
import { useCallback } from "react";

const { Item } = Form;

const FilterForm = () => {

  const onClear = useCallback(() => {
    AttributesFiltersStore.update(store => {
      store.query = {
        name: '',
        order: '',
        limit: store.query.limit,
        offset: store.query.offset,
        sort: '',
      };
    })
  }, []);

  return (
    <Form
      name="filter"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onFinish={(values) => {
        AttributesFiltersStore.update(store => {
          store.query = { ...values };
        })
      }}
      autoComplete="off"
      layout="vertical"
    >
      <Row gutter={[8, 8]}>
        <Col>
          <Item
            label="Rule"
            name="rule"
          >
            <Input />
          </Item>
        </Col>
        <Col>
          <Item
            label="Name"
            name="name"
          >
            <Input />
          </Item>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col>
          <Item
            label="Order"
            name="order"
          >
            <Input />
          </Item>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col offset={12} span={6}>
          <Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              id="submit-filter-button"
            >
              Submit
            </Button>
          </Item>
        </Col>
        <Col span={6}>
          <Item>
            <Button
              block
              type="primary"
              htmlType="reset"
              id="clear-filter-button"
              onClick={onClear}
            >
              Clear
            </Button>
          </Item>
        </Col>
      </Row>
    </Form>
  );
};

FilterForm.displayName = 'FilterForm';

export default FilterForm;
