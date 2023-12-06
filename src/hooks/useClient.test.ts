import { renderHook } from '@testing-library/react-hooks';
import { useClient } from './useClient';

const mockData = { id: '123', name: 'Mock Client' };

jest.mock('../service', () => ({
	keyCloakClient: jest.fn(),
}));
jest.mock('.', () => ({
	useFetch: jest.fn(() => [mockData]),
}));

describe('useClient hook', () => {
	it('sets client state with data received from useFetch', () => {
		const { result } = renderHook(() => useClient('123'));

		expect(result.current.client).toEqual(mockData);
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});
});
