import { renderHook } from '@testing-library/react';
import { useAuthorities } from './useAuthorities';
import { useLazyFetch } from "./useFetch";
import { useKeycloak } from "@react-keycloak/web";

jest.mock('./useFetch', () => ({
	useLazyFetch: jest.fn(),
}));
jest.mock('@react-keycloak/web', () => ({
	useKeycloak: jest.fn(),
}));
jest.mock('../store', () => ({
	AttributesFiltersStore: {
		update: jest.fn(),
	},
}));

describe('useAuthorities hook', () => {
	const mockData = [{ id: 1, name: 'Authority 1' }]; // Replace with actual mock data
	const mockGetAuthorites = jest.fn();
	const mockUseLazyFetch = useLazyFetch as jest.Mock;
	const mockUseKeycloak = useKeycloak as jest.Mock;

	beforeEach(() => {
		mockUseLazyFetch.mockReturnValue([mockGetAuthorites, { data: mockData, loading: false }]);
		mockUseKeycloak.mockReturnValue({ keycloak: { authenticated: true }, initialized: true });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should fetch authorities on mount if keycloak is initialized and authenticated', () => {
		renderHook(() => useAuthorities());

		expect(mockGetAuthorites).toHaveBeenCalledWith({ method: 'get', path: '/authorities' });
	});
});
