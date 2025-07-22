import { renderHook, act } from '@testing-library/react';
import { useUIStore } from '@/stores/uiStore';

describe('UIStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useUIStore());
    act(() => {
      result.current.setLoading(false);
      result.current.setCreateTeamModalOpen(false);
      result.current.setEditTeamModalOpen(false);
      result.current.setAddMemberModalOpen(false);
      result.current.setSelectedTeam(null);
      result.current.setSelectedMember(null);
    });
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useUIStore());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isCreateTeamModalOpen).toBe(false);
    expect(result.current.isEditTeamModalOpen).toBe(false);
    expect(result.current.isAddMemberModalOpen).toBe(false);
    expect(result.current.selectedTeam).toBeNull();
    expect(result.current.selectedMember).toBeNull();
  });

  it('should toggle loading state', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should toggle create team modal', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.setCreateTeamModalOpen(true);
    });

    expect(result.current.isCreateTeamModalOpen).toBe(true);

    act(() => {
      result.current.setCreateTeamModalOpen(false);
    });

    expect(result.current.isCreateTeamModalOpen).toBe(false);
  });

  it('should toggle edit team modal', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.setEditTeamModalOpen(true);
    });

    expect(result.current.isEditTeamModalOpen).toBe(true);

    act(() => {
      result.current.setEditTeamModalOpen(false);
    });

    expect(result.current.isEditTeamModalOpen).toBe(false);
  });

  it('should toggle add member modal', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.setAddMemberModalOpen(true);
    });

    expect(result.current.isAddMemberModalOpen).toBe(true);

    act(() => {
      result.current.setAddMemberModalOpen(false);
    });

    expect(result.current.isAddMemberModalOpen).toBe(false);
  });

  it('should set and clear selected team', () => {
    const { result } = renderHook(() => useUIStore());
    const mockTeam = {
      id: '1',
      name: 'Test Team',
      leadId: 'lead-1',
      leadName: 'John Doe',
      memberCount: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    act(() => {
      result.current.setSelectedTeam(mockTeam);
    });

    expect(result.current.selectedTeam).toEqual(mockTeam);

    act(() => {
      result.current.setSelectedTeam(null);
    });

    expect(result.current.selectedTeam).toBeNull();
  });

  it('should set and clear selected member', () => {
    const { result } = renderHook(() => useUIStore());
    const mockMember = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'member' as const,
      teamId: 'team-1',
      joinedAt: new Date(),
    };

    act(() => {
      result.current.setSelectedMember(mockMember);
    });

    expect(result.current.selectedMember).toEqual(mockMember);

    act(() => {
      result.current.setSelectedMember(null);
    });

    expect(result.current.selectedMember).toBeNull();
  });
});
