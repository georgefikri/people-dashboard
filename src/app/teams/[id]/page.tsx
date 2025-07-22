'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Navigation } from '@/components/Navigation';
import { AddMemberModal } from '@/components/modals/AddMemberModal';
import { useRequireAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { getTeamById } from '@/actions/teams';
import { getTeamMembers, removeMember, updateMemberRole } from '@/actions/members';
import { Team, TeamMember, PaginatedResponse, UserRole } from '@/types';
import { ArrowLeft, Search, Edit, Trash2, Users, Crown, User } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;

  const { isAuthenticated } = useRequireAuth();
  const { user } = useAuthStore();
  const { isLoading, setLoading } = useUIStore();

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<PaginatedResponse<TeamMember>>({
    data: [],
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [optimisticMembers, setOptimisticMembers] = useState<TeamMember[]>([]);

  const loadTeam = async () => {
    try {
      const teamData = await getTeamById(teamId);
      if (!teamData) {
        router.push('/teams');
        return;
      }
      setTeam(teamData);
    } catch (error) {
      console.error('Failed to load team:', error);
      router.push('/teams');
    }
  };

  const loadMembers = async () => {
    setLoading(true);
    try {
      const result = await getTeamMembers(teamId, {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery.trim() || undefined,
      });
      setMembers(result);
      setOptimisticMembers(result.data);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && teamId) {
      loadTeam();
    }
  }, [isAuthenticated, teamId]);

  useEffect(() => {
    if (isAuthenticated && teamId) {
      loadMembers();
    }
  }, [currentPage, isAuthenticated, teamId]);

  useEffect(() => {
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage === 1) {
      loadMembers();
    }
  }, [searchQuery]);

  const handleSearch = () => {
    setCurrentPage(1);
    loadMembers();
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (
      !window.confirm(`Are you sure you want to remove "${memberName}" from the team?`)
    ) {
      return;
    }

    // Optimistic update
    const originalMembers = [...optimisticMembers];
    setOptimisticMembers((prev) => prev.filter((m) => m.id !== memberId));

    try {
      const result = await removeMember(memberId);
      if (result.success) {
        toast.success('Member removed successfully!');
        await loadMembers(); // Refresh the actual data
      } else {
        // Revert optimistic update
        setOptimisticMembers(originalMembers);
        toast.error(result.error || 'Failed to remove member');
      }
    } catch (error) {
      // Revert optimistic update
      setOptimisticMembers(originalMembers);
      toast.error('Failed to remove member');
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: UserRole) => {
    // Optimistic update
    const originalMembers = [...optimisticMembers];
    setOptimisticMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );

    try {
      const result = await updateMemberRole(memberId, newRole);
      if (result.success) {
        toast.success('Member role updated successfully!');
        await loadMembers(); // Refresh the actual data
      } else {
        // Revert optimistic update
        setOptimisticMembers(originalMembers);
        toast.error(result.error || 'Failed to update role');
      }
    } catch (error) {
      // Revert optimistic update
      setOptimisticMembers(originalMembers);
      toast.error('Failed to update role');
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < members.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!isAuthenticated || !team) return null;

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/teams">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Teams</span>
            </Button>
          </Link>
        </div>

        {/* Team Header */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl flex items-center space-x-2">
                    <Users className="h-6 w-6" />
                    <span>{team.name}</span>
                  </CardTitle>
                  {team.description && (
                    <p className="text-gray-600 mt-2">{team.description}</p>
                  )}
                </div>
                {isAdmin && (
                  <AddMemberModal teamId={teamId} onMemberAdded={loadMembers} />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Team Lead</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{team.leadName}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Members</p>
                  <p className="font-medium mt-1">{team.memberCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-medium mt-1">
                    {team.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium mt-1">
                    {team.updatedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Members Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Team Members</h3>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search members by name, email, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading}>
                Search
              </Button>
            </div>
          </div>

          {/* Members Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading members...</p>
                </div>
              ) : optimisticMembers.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    {searchQuery ? 'No members found' : 'No members in this team yet'}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {optimisticMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={member.role === 'admin' ? 'default' : 'secondary'}
                          >
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{member.joinedAt.toLocaleDateString()}</TableCell>
                        {isAdmin && (
                          <TableCell className="text-right">
                            <div className="flex space-x-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateRole(
                                    member.id,
                                    member.role === 'admin' ? 'member' : 'admin'
                                  )
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveMember(member.id, member.name)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {members.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {members.totalPages} ({members.total} total members)
              </span>

              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === members.totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
