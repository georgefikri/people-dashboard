import { create } from 'zustand';
import { UIState, Team, TeamMember } from '@/types';

export const useUIStore = create<UIState>((set) => ({
  // Loading state
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  // Modal states
  isCreateTeamModalOpen: false,
  setCreateTeamModalOpen: (open: boolean) => set({ isCreateTeamModalOpen: open }),

  isEditTeamModalOpen: false,
  setEditTeamModalOpen: (open: boolean) => set({ isEditTeamModalOpen: open }),

  isAddMemberModalOpen: false,
  setAddMemberModalOpen: (open: boolean) => set({ isAddMemberModalOpen: open }),

  // Selected items
  selectedTeam: null,
  setSelectedTeam: (team: Team | null) => set({ selectedTeam: team }),

  selectedMember: null,
  setSelectedMember: (member: TeamMember | null) => set({ selectedMember: member }),
}));
