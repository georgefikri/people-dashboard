'use server';

import { revalidatePath } from 'next/cache';
import { Team, PaginatedResponse, PaginationParams } from '@/types';
import { MOCK_TEAMS } from '@/constants/mockData';

// In-memory storage for demo purposes
const teams = [...MOCK_TEAMS];

export async function getTeams(
  params: PaginationParams
): Promise<PaginatedResponse<Team>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredTeams = [...teams];

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredTeams = teams.filter(
      (team) =>
        team.name.toLowerCase().includes(searchLower) ||
        team.leadName.toLowerCase().includes(searchLower)
    );
  }

  // Sort by creation date (newest first)
  filteredTeams.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Apply pagination
  const startIndex = (params.page - 1) * params.limit;
  const endIndex = startIndex + params.limit;
  const paginatedTeams = filteredTeams.slice(startIndex, endIndex);

  return {
    data: paginatedTeams,
    total: filteredTeams.length,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(filteredTeams.length / params.limit),
  };
}

export async function getTeamById(id: string): Promise<Team | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const team = teams.find((t) => t.id === id);
  return team || null;
}

export async function createTeam(
  formData: FormData
): Promise<{ success: boolean; error?: string; team?: Team }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const leadId = formData.get('leadId') as string;
    const leadName = formData.get('leadName') as string;

    if (!name || !leadId || !leadName) {
      return { success: false, error: 'Missing required fields' };
    }

    // Check if team name already exists
    if (teams.some((team) => team.name.toLowerCase() === name.toLowerCase())) {
      return { success: false, error: 'Team name already exists' };
    }

    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name,
      description: description || undefined,
      leadId,
      leadName,
      memberCount: 1, // Start with just the lead
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    teams.push(newTeam);
    revalidatePath('/teams');

    return { success: true, team: newTeam };
  } catch (error) {
    return { success: false, error: 'Failed to create team' };
  }
}

export async function updateTeam(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string; team?: Team }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const leadId = formData.get('leadId') as string;
    const leadName = formData.get('leadName') as string;

    if (!name || !leadId || !leadName) {
      return { success: false, error: 'Missing required fields' };
    }

    const teamIndex = teams.findIndex((team) => team.id === id);
    if (teamIndex === -1) {
      return { success: false, error: 'Team not found' };
    }

    // Check if team name already exists (excluding current team)
    if (
      teams.some(
        (team) => team.id !== id && team.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      return { success: false, error: 'Team name already exists' };
    }

    const updatedTeam: Team = {
      ...teams[teamIndex],
      name,
      description: description || undefined,
      leadId,
      leadName,
      updatedAt: new Date(),
    };

    teams[teamIndex] = updatedTeam;
    revalidatePath('/teams');
    revalidatePath(`/teams/${id}`);

    return { success: true, team: updatedTeam };
  } catch (error) {
    return { success: false, error: 'Failed to update team' };
  }
}

export async function deleteTeam(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const teamIndex = teams.findIndex((team) => team.id === id);
    if (teamIndex === -1) {
      return { success: false, error: 'Team not found' };
    }

    teams.splice(teamIndex, 1);
    revalidatePath('/teams');

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete team' };
  }
}
