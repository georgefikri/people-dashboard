import axios from 'axios';
import { getTeamMembers, addTeamMember } from '@/actions/members';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !process.env.NEXT_PUBLIC_API_URL;

// GET /api/members?teamId=... - Get team members
export async function getMembers(
  teamId: string,
  options: { page?: number; limit?: number; search?: string } = {}
) {
  try {
    if (USE_MOCK_DATA) {
      // Use mock data (server actions)
      const { page = 1, limit = 10, search } = options;
      const result = await getTeamMembers(teamId, { page, limit, search });
      return {
        success: true,
        data: result,
      };
    } else {
      // Use real API with Axios
      const { page = 1, limit = 10, search } = options;
      const params = new URLSearchParams({
        teamId,
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await axios.get(`${API_BASE_URL}/members?${params}`);
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch members');
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch members');
  }
}

// POST /api/members - Add a new team member
export async function createMember(formData: FormData) {
  try {
    if (USE_MOCK_DATA) {
      // Use mock data (server actions)
      const result = await addTeamMember(formData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to add member');
      }

      return {
        success: true,
        data: result.member,
      };
    } else {
      // Use real API with Axios
      const response = await axios.post(`${API_BASE_URL}/members`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to add member');
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to add member');
  }
}
