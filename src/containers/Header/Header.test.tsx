import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { BrowserRouter as Router } from "react-router-dom";
import { mockKeycloakStub } from "../../../tests/unit";
const { ReactKeycloakProvider } = require('@react-keycloak/web')

describe('Header component', () => {
  it("is rendered", () => {
    render(
      <ReactKeycloakProvider authClient={mockKeycloakStub()}>
        <Router>
          <Header />
        </Router>
      </ReactKeycloakProvider>
    );

    const element = screen.getAllByText('Abacus')[0] as HTMLElement;
    expect(element).toBeInTheDocument();
  });
});
