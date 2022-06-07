import { render, screen } from "@testing-library/react";
import App from "../App";

describe("For App Component", () => {
    test("renders login form", async () => {
      render(<App />);
      const loginForm = await screen.findByTestId("login-form");
      expect(loginForm).toBeInTheDocument();
    });

    test("renders register form", async () => {
      render(<App />);
      const registerForm = await screen.findByTestId("register-form");
      expect(registerForm).toBeInTheDocument();
    });
});