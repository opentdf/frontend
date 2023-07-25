import { render } from "@testing-library/react";
import EditValueList from "./EditValueList";
import { setWindowMock } from "../../../tests/unit";

let props = {};
describe('EditValueList component', () => {
    beforeEach(() => {
        props = {
            list: ["one"],
            onEdit: jest.fn(),
            onEditGroupBy: jest.fn(),
        };
    })
    it("should rendered", () => {
        setWindowMock();
        // @ts-ignore
        const x = render(<EditValueList {...props} />);

        expect(x.findByTestId("edit-value-input-field-0")).toBeTruthy();
    });
});
