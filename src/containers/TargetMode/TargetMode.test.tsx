import { render, screen, fireEvent } from "@testing-library/react";
import { InputTDF } from "./InputTDF";
const { ReactKeycloakProvider } = require('@react-keycloak/web');

describe('InputTDF component', () => {
    it("should render", () => {
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
                <InputTDF/>
            </ReactKeycloakProvider>
        );
        const element = screen.getByText("Secure Submit");
        // fireEvent.click(element);
        expect(element).toBeInTheDocument();
    });
});
