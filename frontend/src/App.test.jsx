import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Superheroes heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /superheroes/i });
  expect(heading).toBeInTheDocument();
});
