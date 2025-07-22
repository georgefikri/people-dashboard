import { render, screen } from '@testing-library/react';
import { Navigation } from '@/components/Navigation';
import { useAuthStore } from '@/stores/authStore';

// Mock the auth store
jest.mock('@/stores/authStore');

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('Navigation', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders nothing when user is not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { container } = render(<Navigation />);
    expect(container.firstChild).toBeNull();
  });

  it('renders navigation when user is authenticated', () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin' as const,
    };

    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<Navigation />);

    expect(screen.getByText('Team Manager')).toBeInTheDocument();
    // Check that Test User appears (there are multiple instances)
    expect(screen.getAllByText('Test User')).toHaveLength(2);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('displays admin badge for admin users', () => {
    const mockAdminUser = {
      id: 'admin-1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin' as const,
    };

    mockUseAuthStore.mockReturnValue({
      user: mockAdminUser,
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<Navigation />);

    const adminBadge = screen.getByText('admin');
    expect(adminBadge).toBeInTheDocument();
  });

  it('displays member badge for member users', () => {
    const mockMemberUser = {
      id: 'member-1',
      email: 'member@example.com',
      name: 'Member User',
      role: 'member' as const,
    };

    mockUseAuthStore.mockReturnValue({
      user: mockMemberUser,
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<Navigation />);

    const memberBadge = screen.getByText('member');
    expect(memberBadge).toBeInTheDocument();
  });
});
