import { render } from "@testing-library/react";
import EditValueList from "./EditValueList";
import { shouldSaveValues } from './EditValueList';

describe('EditValueList component', () => {
    describe('shouldSaveValues: ', () => {
        it("should return false if arrays are equal", () => {
            expect(shouldSaveValues(['one'], ['one'])).toBeFalsy();
        });

        it("should return true if arrays are not equal", () => {
            expect(shouldSaveValues(['one'], ['five'])).toBeTruthy();
        });

        it("should return true if arrays are not equal", () => {
            expect(shouldSaveValues(['one', 'five'], ['one'])).toBeTruthy();
        });

        it("should return false if arrays are empty", () => {
            expect(shouldSaveValues([], [])).toBeFalsy();
        });
    });

    it("should rendered with one input", () => {
        const props = {
            orderValues: ["one"],
            groupByValue: "one",
            onEditOrderValues: jest.fn(),
            onEditGroupBy: jest.fn(),
        };

        // @ts-ignore
        const x = render(<EditValueList {...props} />);

        expect(x.findByTestId("edit-value-input-field-0")).toBeTruthy();
    });

    it("should rendered with three inputs", () => {
        const props = {
            orderValues: ["one", "two", "three"],
            groupByValue: "one",
            onEditOrderValues: jest.fn(),
            onEditGroupBy: jest.fn(),
        };

        // @ts-ignore
        const x = render(<EditValueList {...props} />);

        expect(x.findByTestId("edit-value-input-field-0")).toBeTruthy();
        expect(x.findByTestId("edit-value-input-field-1")).toBeTruthy();
        expect(x.findByTestId("edit-value-input-field-2")).toBeTruthy();
    });

    it("should rendered with no inputs", () => {
        const props = {
            orderValues: [],
            groupByValue: "",
            onEditOrderValues: jest.fn(),
            onEditGroupBy: jest.fn(),
        };

        // @ts-ignore
        const x = render(<EditValueList {...props} />);
        expect(x.queryByTestId('edit-value-input-field-0')).toBeFalsy();
    });
});
