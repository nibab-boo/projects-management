
import { render, within, screen } from '@testing-library/react';
import RootPage from '../components/RootPage';
import { StaticRouter } from "react-router-dom/server";

test('renders learn react link', async () => {
  render(
    <StaticRouter location={"/"}>
      <RootPage />
    </StaticRouter>
    );

  const header = within( await screen.findByTestId("main-title")).getByText("Projects Management App");

  // const linkElement = screen.getByText(/Projects Management App/i);
  expect(header).toBeInTheDocument();
});