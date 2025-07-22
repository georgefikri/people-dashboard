export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  leadId: string;
  leadName: string;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId: string;
  joinedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export interface UIState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  // Modal states
  isCreateTeamModalOpen: boolean;
  setCreateTeamModalOpen: (open: boolean) => void;
  isEditTeamModalOpen: boolean;
  setEditTeamModalOpen: (open: boolean) => void;
  isAddMemberModalOpen: boolean;
  setAddMemberModalOpen: (open: boolean) => void;
  // Selected items
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;
  selectedMember: TeamMember | null;
  setSelectedMember: (member: TeamMember | null) => void;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
