import { renderHook, act } from '@testing-library/react-hooks'
import { useAttributesFilters } from './useAttributes';
import { useLazyFetch } from './useFetch';

const mockData = [{ id: 1, name: 'Attribute 1' }]; // Replace with actual mock data
const getAttributes = jest.fn(() => ({ data: mockData, status: 200 }));


jest.mock(
	'./useFetch', () => ({
		__esModule: true,
		useLazyFetch: jest.fn(),
	})
);

const params = {
	name: 'string',
	order: 'string',
	limit: 10,
	offset: 10,
	sort: 'string',
};

const mockLazyFetch = useLazyFetch as jest.Mock

describe('useAttributes hook', () => {
	it('sets useAttributesFilters on successful fetch', async () => {
		// @ts-ignore
		mockLazyFetch.mockReturnValue([
			getAttributes,
			{ data: mockData, loading: false },
		])

		const { result } = renderHook(
			() => useAttributesFilters('some-authority', params)
		);

		await act(async () => {
			await result.current.fetchAttrs()
		})

		expect(getAttributes).toHaveBeenCalledWith({"method": "get", params: { ...params, authority: 'some-authority' } , "path": "/definitions/attributes"});
	});

	it('sets useAttributesFilters on failed fetch', async () => {
		// @ts-ignore
		mockLazyFetch.mockReturnValue([
			() => ({ data: [], status: 400 }),
			{ data: mockData, loading: false },
		])
		const { result } = renderHook(
			() => useAttributesFilters('some-authority', params)
		);

		await act(async () => {
			try {
				await result.current.fetchAttrs()
			} catch (error) {
				expect(error).toBeInstanceOf(Error);
				// @ts-ignore
				expect(error.message).toMatch(/Status: 400/);
			}
		})
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});
});