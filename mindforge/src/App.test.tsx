import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// jsdom doesn't implement matchMedia; ThemeProvider checks it defensively,
// but provide a stub so behavior is deterministic.
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

test('renders onboarding for a new user', () => {
  render(<App />);
  expect(screen.getByText(/Adaptive brain training/i)).toBeInTheDocument();
  expect(screen.getByText(/Get started/i)).toBeInTheDocument();
});
