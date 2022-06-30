import { render, screen } from "@testing-library/react";
import Authorities from "./Authorities";
import { BrowserRouter as Router } from "react-router-dom";
const { ReactKeycloakProvider } = require('@react-keycloak/web')

describe('Authorities component', () => {
  it("is rendered", () => {
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

    const mockKeycloakStub = {
      init: jest.fn().mockResolvedValue(true),
      login: jest.fn(),
      logout: jest.fn(),
      createLoginUrl: jest.fn(),
      authenticated: true,
      initialized: true
    };

    render(
      <ReactKeycloakProvider authClient={mockKeycloakStub}>
        <Router>
          <Authorities />
        </Router>
        </ReactKeycloakProvider>
    );

    const element = screen.getAllByText('Authority')[0] as HTMLElement;
    expect(element).toBeInTheDocument();
  });
});
