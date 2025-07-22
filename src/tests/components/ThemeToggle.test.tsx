import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle, SimpleThemeToggle } from '@/components/ThemeToggle';

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme() {
    return {
      theme: 'light',
      setTheme: jest.fn(),
    };
  },
}));

describe('ThemeToggle', () => {
  it('renders theme toggle button', () => {
    render(<ThemeToggle />);

    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  it('has screen reader text for accessibility', () => {
    render(<ThemeToggle />);

    const screenReaderText = screen.getByText('Toggle theme');
    expect(screenReaderText).toBeInTheDocument();
    expect(screenReaderText).toHaveClass('sr-only');
  });
});

describe('SimpleThemeToggle', () => {
  it('renders simple theme toggle button', () => {
    render(<SimpleThemeToggle />);

    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  it('has screen reader text for accessibility', () => {
    render(<SimpleThemeToggle />);

    const screenReaderText = screen.getByText('Toggle theme');
    expect(screenReaderText).toBeInTheDocument();
    expect(screenReaderText).toHaveClass('sr-only');
  });
});
