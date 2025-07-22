'use server';

import { revalidatePath } from 'next/cache';
import { TeamMember, PaginatedResponse, PaginationParams, UserRole } from '@/types';
import { MOCK_TEAM_MEMBERS } from '@/constants/mockData';

// In-memory storage for demo purposes
const teamMembers = [...MOCK_TEAM_MEMBERS];

export async function getTeamMembers(
  teamId: string,
  params: PaginationParams
): Promise<PaginatedResponse<TeamMember>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Filter members by team
  let filteredMembers = teamMembers.filter((member) => member.teamId === teamId);

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredMembers = filteredMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        member.role.toLowerCase().includes(searchLower)
    );
  }

  // Sort by join date (newest first)
  filteredMembers.sort((a, b) => b.joinedAt.getTime() - a.joinedAt.getTime());

  // Apply pagination
  const startIndex = (params.page - 1) * params.limit;
  const endIndex = startIndex + params.limit;
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  return {
    data: paginatedMembers,
    total: filteredMembers.length,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(filteredMembers.length / params.limit),
  };
}

export async function addTeamMember(
  formData: FormData
): Promise<{ success: boolean; error?: string; member?: TeamMember }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as UserRole;
    const teamId = formData.get('teamId') as string;

    if (!name || !email || !role || !teamId) {
      return { success: false, error: 'Missing required fields' };
    }

    // Check if email already exists in this team
    if (
      teamMembers.some(
        (member) =>
          member.teamId === teamId && member.email.toLowerCase() === email.toLowerCase()
      )
    ) {
      return {
        success: false,
        error: 'Member with this email already exists in the team',
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Invalid email format' };
    }

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name,
      email,
      role,
      teamId,
      joinedAt: new Date(),
    };

    teamMembers.push(newMember);
    revalidatePath(`/teams/${teamId}`);

    return { success: true, member: newMember };
  } catch (error) {
    return { success: false, error: 'Failed to add team member' };
  }
}

export async function updateMemberRole(
  memberId: string,
  newRole: UserRole
): Promise<{ success: boolean; error?: string; member?: TeamMember }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const memberIndex = teamMembers.findIndex((member) => member.id === memberId);
    if (memberIndex === -1) {
      return { success: false, error: 'Member not found' };
    }

    const updatedMember = {
      ...teamMembers[memberIndex],
      role: newRole,
    };

    teamMembers[memberIndex] = updatedMember;
    revalidatePath(`/teams/${updatedMember.teamId}`);

    return { success: true, member: updatedMember };
  } catch (error) {
    return { success: false, error: 'Failed to update member role' };
  }
}

export async function removeMember(
  memberId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const memberIndex = teamMembers.findIndex((member) => member.id === memberId);
    if (memberIndex === -1) {
      return { success: false, error: 'Member not found' };
    }

    const teamId = teamMembers[memberIndex].teamId;
    teamMembers.splice(memberIndex, 1);
    revalidatePath(`/teams/${teamId}`);

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to remove member' };
  }
}

export async function getMemberById(id: string): Promise<TeamMember | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const member = teamMembers.find((m) => m.id === id);
  return member || null;
}
