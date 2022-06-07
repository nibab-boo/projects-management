import { render, screen } from "@testing-library/react";
import Login from "../components/Login";
import { BrowserRouter as Router } from "react-router-dom";

describe("For Login Component", () => {
  test("Login form exists", async () => {
    render(
      <Router>
        <Login />
      </Router>
    );
  
    const inputTypes = ["email", "password", "submit"];
    const inputs = await screen.findAllByTestId("input");
  
    for (let i = 0; i < inputs.length; i++) {
      expect(inputs[i].getAttribute("type")).toContain(inputTypes[i]);
    }
  });
});
