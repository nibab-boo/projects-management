import { render, screen } from "@testing-library/react";
import Dashboard from "../components/Dashboard";
import { BrowserRouter as Router } from "react-router-dom";
describe("For Dashboard Component", () => {
  test("Dashboard renders", () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );
    const dashboard = screen.getByTestId("dashboard");
    expect(dashboard).toBeInTheDocument();
  });

});
