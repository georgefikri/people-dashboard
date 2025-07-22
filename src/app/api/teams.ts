import axios from 'axios';
import {
  getTeams as getTeamsAction,
  createTeam as createTeamAction,
} from '@/actions/teams';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !process.env.NEXT_PUBLIC_API_URL;

// GET /api/teams - Get paginated teams
export async function getTeams(
  options: { page?: number; limit?: number; search?: string } = {}
) {
  try {
    if (USE_MOCK_DATA) {
      // Use mock data (server actions)
      const { page = 1, limit = 10, search } = options;
      const result = await getTeamsAction({ page, limit, search });
      return {
        success: true,
        data: result,
      };
    } else {
      // Use real API with Axios
      const { page = 1, limit = 10, search } = options;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await axios.get(`${API_BASE_URL}/teams?${params}`);
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch teams');
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch teams');
  }
}

// POST /api/teams - Create a new team
export async function createTeam(formData: FormData) {
  try {
    if (USE_MOCK_DATA) {
      // Use mock data (server actions)
      const result = await createTeamAction(formData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create team');
      }

      return {
        success: true,
        data: result.team,
      };
    } else {
      // Use real API with Axios
      const response = await axios.post(`${API_BASE_URL}/teams`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to create team');
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to create team');
  }
}
