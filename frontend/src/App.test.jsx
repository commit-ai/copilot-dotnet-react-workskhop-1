import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Superheroes heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /superheroes/i });
  expect(heading).toBeInTheDocument();
});

test('renders React logo', () => {
  render(<App />);
  const logo = screen.getByAltText(/react logo/i);
  expect(logo).toBeInTheDocument();
});
