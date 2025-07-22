import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/stores/authStore';

// Mock the store to avoid persistence during tests
jest.mock('zustand/middleware', () => ({
  persist: (fn: unknown) => fn,
}));

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
    });
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  it('should login with valid credentials', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      const success = await result.current.login('admin@demo.com', 'admin123');
      expect(success).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeTruthy();
    expect(result.current.user?.email).toBe('admin@demo.com');
  });

  it('should reject invalid credentials', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      const success = await result.current.login('invalid@example.com', 'wrongpassword');
      expect(success).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should logout successfully', async () => {
    const { result } = renderHook(() => useAuthStore());

    // First login
    await act(async () => {
      await result.current.login('admin@demo.com', 'admin123');
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
