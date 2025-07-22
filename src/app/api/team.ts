import axios from 'axios';
import { getTeamById, updateTeam, deleteTeam } from '@/actions/teams';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !process.env.NEXT_PUBLIC_API_URL;

// GET /api/team?id=... - Get a specific team
export async function getTeam(id: string) {
  try {
    if (USE_MOCK_DATA) {
      // Use mock data (server actions)
      const team = await getTeamById(id);

      if (!team) {
        throw new Error('Team not found');
      }

      return {
        success: true,
        data: team,
      };
    } else {
      // Use real API with Axios
      const response = await axios.get(`${API_BASE_URL}/team?id=${id}`);
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch team');
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch team');
  }
}

// PUT /api/team - Update a specific team
export async function updateTeamData(id: string, data: Record<string, string>) {
  try {
    if (USE_MOCK_DATA) {
      // Use mock data (server actions)
      // Convert the data to FormData format for the action
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const result = await updateTeam(id, formData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to update team');
      }

      return {
        success: true,
        data: result.team,
      };
    } else {
      // Use real API with Axios
      const response = await axios.put(`${API_BASE_URL}/team`, { id, ...data });
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to update team');
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to update team');
  }
}

// DELETE /api/team - Delete a specific team
export async function deleteTeamData(id: string) {
  try {
    if (USE_MOCK_DATA) {
      // Use mock data (server actions)
      const result = await deleteTeam(id);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete team');
      }

      return {
        success: true,
        message: 'Team deleted successfully',
      };
    } else {
      // Use real API with Axios
      const response = await axios.delete(`${API_BASE_URL}/team?id=${id}`);
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to delete team');
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to delete team');
  }
}
