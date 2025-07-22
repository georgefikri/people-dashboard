import axios from 'axios';
import { getMemberById, updateMemberRole, removeMember } from '@/actions/members';
import { UserRole } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !process.env.NEXT_PUBLIC_API_URL;

// GET /api/member?id=... - Get a specific member
export async function getMember(id: string) {
  try {
    if (USE_MOCK_DATA) {
      // Use mock data (server actions)
      const member = await getMemberById(id);

      if (!member) {
        throw new Error('Member not found');
      }

      return {
        success: true,
        data: member,
      };
    } else {
      // Use real API with Axios
      const response = await axios.get(`${API_BASE_URL}/member?id=${id}`);
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch member');
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch member');
  }
}

// PUT /api/member - Update member role
export async function updateMember(id: string, role: UserRole) {
  try {
    if (USE_MOCK_DATA) {
      // Use mock data (server actions)
      const result = await updateMemberRole(id, role);

      if (!result.success) {
        throw new Error(result.error || 'Failed to update member');
      }

      return {
        success: true,
        data: result.member,
      };
    } else {
      // Use real API with Axios
      const response = await axios.put(`${API_BASE_URL}/member`, { id, role });
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to update member');
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to update member');
  }
}

// DELETE /api/member - Remove a member
export async function deleteMember(id: string) {
  try {
    if (USE_MOCK_DATA) {
      // Use mock data (server actions)
      const result = await removeMember(id);

      if (!result.success) {
        throw new Error(result.error || 'Failed to remove member');
      }

      return {
        success: true,
        message: 'Member removed successfully',
      };
    } else {
      // Use real API with Axios
      const response = await axios.delete(`${API_BASE_URL}/member?id=${id}`);
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to remove member');
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to remove member');
  }
}
