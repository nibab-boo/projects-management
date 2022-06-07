import { render, screen } from "@testing-library/react";
import Quote from "../components/Quote";
import { BrowserRouter as Router } from "react-router-dom";

describe("For Quote Component", () => {

  
  test("Renders Quote", async () => {
    render(
      <Router>
        <Quote />
      </Router>
    );
    const quote = await screen.findByTestId("quote");
    expect(quote).toBeInTheDocument();
  });
  
  test("Quote form exists", async () => {    
    render(
      <Router>
        <Quote />
      </Router>
    );
    const inputTypes = ["text", "submit"];
    const inputs = await screen.findAllByTestId("input");
  
    for (let i = 0; i < inputs.length; i++) {
      expect(inputs[i].getAttribute("type")).toContain(inputTypes[i]);
    }
  });
});
