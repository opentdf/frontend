require('@testing-library/jest-dom');

beforeEach(() => {
	const mockKeycloakStub = {
		init: jest.fn().mockResolvedValue(true),
		login: jest.fn(),
		logout: jest.fn(),
		createLoginUrl: jest.fn(),
		authenticated: true,
		initialized: true
	};

	jest.mock("@react-keycloak/web", () => ({
		useKeycloak: () => ({ keycloak: mockKeycloakStub })
	}))
})

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation(query => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(),
		removeListener: jest.fn(),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

Object.defineProperty(window, 'SERVER_DATA', {
	writable: true,
	value: {
		realms: 'realm1,realm2',
		basePath: '/base-path',
		clientId: 'client-id',
		authority: 'https://authority.com',
		access: 'https://kas-endpoint.com',
		entitlements: '/entitlements-path',
		attributes: '/attributes-path',
	}
});


const localStorageMock = (function() {
	let store = {};
	return {
		getItem(key) {
			return store[key] || null;
		},
		setItem(key, value) {
			store[key] = value.toString();
		},
		clear() {
			store = {};
		}
	};
})();

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock
});
