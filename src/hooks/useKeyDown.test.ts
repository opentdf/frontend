import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { useKeyDown } from './useKeyDown'; // Adjust the path to the actual file location

describe('useKeyDown hook', () => {
	it('calls handler on keydown event', () => {
		const handler = jest.fn();

		// Render the hook with the mock handler
		renderHook(() => useKeyDown(handler));

		// Create a keyboard event
		const event = new KeyboardEvent('keydown', { key: 'Enter' });

		// Dispatch the event on the document
		fireEvent(document, event);

		// Assert that the handler was called with the correct key
		expect(handler).toHaveBeenCalledWith({ key: 'Enter' });
	});

	it('cleans up event listeners on unmount', () => {
		const handler = jest.fn();
		const { unmount } = renderHook(() => useKeyDown(handler));

		unmount();

		const event = new KeyboardEvent('keydown', { key: 'Enter' });

		fireEvent(document, event);

		expect(handler).not.toHaveBeenCalled();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});
});
