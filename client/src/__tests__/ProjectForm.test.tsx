import { render, screen } from "@testing-library/react";
import ProjectForm from "../components/ProjectForm";
import { BrowserRouter as Router } from "react-router-dom";

describe("For ProjectForm Component", () => {
  test("ProjectForm form exists", async () => {
    render(
      <Router>
        <ProjectForm title="New Project" submit={"hello"}/>
      </Router>
    );
  
    const inputTypes = ["Name", "Details", "Live", "Repo", "Stacks", "hosting", "status", "submit"];
    const inputs = await screen.findAllByTestId("input");
  
    for (let i = 0; i < inputs.length; i++) {
      expect(inputs[i].getAttribute("name")).toContain(inputTypes[i]);
    }
  });
});
