import { render, within, screen } from '@testing-library/react';
import App from '../App';

test('renders learn react link', async () => {
  render(<App />);

  const header = within( await screen.findByTestId("main-title")).getByText("Projects Management App");

  // const linkElement = screen.getByText(/Projects Management App/i);
  expect(header).toBeInTheDocument();
});
