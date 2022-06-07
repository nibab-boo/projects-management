import { screen, render } from "@testing-library/react";
import Register from "./../components/Register";
import { BrowserRouter as Router} from "react-router-dom";

test("register form exist", async () => {
  render(
    <Router>
      <Register />
    </Router>
  );
  
  const inputTypes = ["text", "email", "password", "submit"]
  const inputs = await screen.findAllByTestId("input");
  for (let i = 0; i< inputs.length; i++) {
    expect(inputs[i].getAttribute("type")).toContain(inputTypes[i]);
  }
});