import { render, screen } from "@testing-library/react";
import Authorities from "./Authorities";
import { BrowserRouter as Router } from "react-router-dom";
import { mockKeycloakStub } from "../../../tests/unit";

const { ReactKeycloakProvider } = require('@react-keycloak/web')

describe('Authorities component', () => {
  it("is rendered", () => {
    render(
      <ReactKeycloakProvider authClient={mockKeycloakStub()}>
        <Router>
          <Authorities />
        </Router>
      </ReactKeycloakProvider>
    );

    const element = screen.getAllByText('Authority')[0] as HTMLElement;
    expect(element).toBeInTheDocument();
  });
});
