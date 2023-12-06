import { render } from "@testing-library/react";
import AttributeListItem from "./AttributeListItem";
let props = {};
describe('Header component', () => {
  beforeEach(() => {
    props = {
      activeAuthority: "activeAuthority",
      attr: {
        name: 'mockName',
        order: ['order1', 'order2'],
        state: 'mockState',
        rule: 'mockRule',
      },
      onChange: jest.fn(),
    }
  })
  it("should rendered", () => {
    const x = render(<AttributeListItem activeAuthority={""} attr={{
      authority: "",
      name: "",
      order: [],
      rule: "hierarchy",
      state: undefined,
      group_by: undefined
    }} onChange={function (): void {
      throw new Error("Function not implemented.");
    }} {...props} />);

    expect(x.getByText("mockName")).toBeInTheDocument();
    expect(x.getByText("order1")).toBeInTheDocument();
    expect(x.getByText("order2")).toBeInTheDocument();
    expect(x.getByText("mockState")).toBeInTheDocument();
    expect(x.getByText("mockRule")).toBeInTheDocument();
  });
});
