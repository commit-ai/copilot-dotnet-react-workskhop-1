import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import App from './App';

const superheroes = [
  {
    id: 4,
    name: 'Batman',
    image: 'https://example.com/batman.jpg',
    powerstats: {
      intelligence: 100,
      strength: 26,
      speed: 27,
      durability: 50,
      power: 47,
      combat: 100,
    },
  },
  {
    id: 8,
    name: 'Aquaman',
    image: 'https://example.com/aquaman.jpg',
    powerstats: {
      intelligence: 81,
      strength: 85,
      speed: 79,
      durability: 80,
      power: 100,
      combat: 80,
    },
  },
];

beforeEach(() => {
  global.fetch = vi.fn((url, options) => {
    if (url === '/api/superheroes') {
      return Promise.resolve({
        ok: true,
        json: async () => superheroes,
      });
    }

    if (url === '/api/battle-narration' && options?.method === 'POST') {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          narration: 'Batman collides with Aquaman in a blockbuster showdown.',
        }),
      });
    }

    return Promise.reject(new Error(`Unhandled fetch request: ${url}`));
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('renders superheroes heading and allows comparing two heroes', async () => {
  render(<App />);

  const heading = screen.getByRole('heading', { name: /^superheroes$/i });
  expect(heading).toBeInTheDocument();

  expect(await screen.findByText('Batman')).toBeInTheDocument();

  const checkboxes = screen.getAllByRole('checkbox');
  fireEvent.click(checkboxes[0]);
  fireEvent.click(checkboxes[1]);
  fireEvent.click(screen.getByRole('button', { name: /compare heroes/i }));

  expect(await screen.findByRole('heading', { name: /superhero comparison/i })).toBeInTheDocument();
  expect(screen.getByText(/aquaman wins!/i)).toBeInTheDocument();
  expect(screen.getByText(/score: 4-2/i)).toBeInTheDocument();
});

test('generates battle narration for the selected heroes', async () => {
  render(<App />);

  expect(await screen.findByText('Batman')).toBeInTheDocument();

  const checkboxes = screen.getAllByRole('checkbox');
  fireEvent.click(checkboxes[0]);
  fireEvent.click(checkboxes[1]);
  fireEvent.click(screen.getByRole('button', { name: /compare heroes/i }));

  fireEvent.click(await screen.findByRole('button', { name: /generate epic battle story/i }));

  expect(await screen.findByText(/blockbuster showdown/i)).toBeInTheDocument();
});
