import { renderHook, act } from '@testing-library/react'
import { useLazyFetch } from './useFetch';

const client = {
	get: jest.fn(() => ({ headers: { foo: 'bar' }, data: { foo: 'baz' } })),
	post: jest.fn(() => {
		// @ts-ignore
		throw { isAxiosError: true, response: 'oops', message: 'something is wrong' }
	}),
}

const testMessage = jest.fn();
jest.mock('react-toastify', () => {
	//@ts-ignore
	return { toast: { error: (resp) => testMessage(resp) } }
});

describe('useFetch hook', () => {
	it('sets useAttributesFilters on successful fetch', async () => {
		const { result } = renderHook(
			//@ts-ignore
			() => useLazyFetch(client)
		);
		const config = {
			method: 'get',
			path: '/mock-path',
			params: { foo: 'bar' }
		};
		await act(async () => {
			// @ts-ignore
			await result.current[0](config);
		});


		expect(client.get).toHaveBeenCalledWith(config.path, { params: config.params });
	});

	it('failed config object', async () => {
		const { result } = renderHook(
			//@ts-ignore
			() => useLazyFetch(client)
		);
		const config = {};
		await act(async () => {
			try {
				// @ts-ignore
				await result.current[0](config);
			} catch (error) {
				expect(error).toBeInstanceOf(Error);
				// @ts-ignore
				expect(error.message).toMatch(/is not a function/);
			}
		});
	});

	it('failed config object with isAxiosError', async () => {
		const { result } = renderHook(
			//@ts-ignore
			() => useLazyFetch(client)
		);
		const config = {
			method: 'post',
			path: '/mock-path',
			params: { foo: 'bar' }
		};
		await act(async () => {
			// @ts-ignore
			await result.current[0](config);
		});

		expect(testMessage).toHaveBeenCalledWith('something is wrong');
	});


	afterAll(() => {
		jest.restoreAllMocks();
	});
});
