import { render, screen, fireEvent } from "@testing-library/react";
import { InputTDF } from "./InputTDF";
const { ReactKeycloakProvider } = require('@react-keycloak/web')

// wip
jest.mock(
    '@opentdf/client',
    () => {
        const withStringSource = function () {
            return {
                withOffline: jest.fn().mockReturnValue({
                    build: jest.fn()
                })
            };
        };

        const EncryptParamsBuilder = function () {
        };
        EncryptParamsBuilder.prototype.withStringSource = withStringSource;

        const Client = function () {
        };

        Client.prototype.encrypt = async function () {
            return Promise.resolve("Encrypt");
        }

        Client.prototype.decrypt = function () {
            return Promise.resolve("Encrypt");
        }

        return {
            Client: {
                Client,
                EncryptParamsBuilder,
                DecryptParamsBuilder: jest.fn().mockImplementation(() => {
                    return {
                        withStringSource: jest.fn().mockImplementation(() => {
                            return { build: jest.fn() };
                        })
                    };
                })
            }
        }
    }
);

describe('InputTDF component', () => {
    beforeEach(() => {
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
    });

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
