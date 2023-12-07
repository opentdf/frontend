const mockKeycloakStub = () => ({
  init: jest.fn().mockResolvedValue(true),
  login: jest.fn(),
  logout: jest.fn(),
  createLoginUrl: jest.fn(),
  authenticated: true,
  initialized: true
});

export { mockKeycloakStub };
