"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { CreateTeamModal } from "@/components/modals/CreateTeamModal";
import { EditTeamModal } from "@/components/modals/EditTeamModal";
import { useRequireAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { getTeams, deleteTeam } from "@/actions/teams";
import { Team, PaginatedResponse } from "@/types";
import { Search, Trash2, Users, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 5;

export default function TeamsPage() {
  const { isAuthenticated } = useRequireAuth();
  const { user } = useAuthStore();
  const { isLoading, setLoading } = useUIStore();

  const [teams, setTeams] = useState<PaginatedResponse<Team>>({
    data: [],
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadTeams = async () => {
    setLoading(true);
    try {
      const result = await getTeams({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery.trim() || undefined,
      });
      setTeams(result);
    } catch (error) {
      console.error("Failed to load teams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadTeams();
    }
  }, [currentPage, isAuthenticated]);

  useEffect(() => {
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage === 1) {
      loadTeams();
    }
  }, [searchQuery]);

  const handleSearch = () => {
    setCurrentPage(1);
    loadTeams();
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${teamName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteTeam(teamId);
      if (result.success) {
        toast.success("Team deleted successfully!");
        await loadTeams(); // Refresh the list
      } else {
        toast.error(result.error || "Failed to delete team");
      }
    } catch (error) {
      toast.error("Failed to delete team");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < teams.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!isAuthenticated) return null;

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Teams
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your organization&apos;s teams
            </p>
          </div>

          {isAdmin && <CreateTeamModal onTeamCreated={loadTeams} />}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search teams by name or lead..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              Search
            </Button>
          </div>
        </div>

        {/* Teams Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Loading teams...
            </p>
          </div>
        ) : teams.data.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery ? "No teams found" : "No teams yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Get started by creating your first team"}
            </p>
            {isAdmin && !searchQuery && (
              <CreateTeamModal onTeamCreated={loadTeams} />
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teams.data.map((team) => (
              <Card key={team.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {team.description || "No description"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Team Lead:
                      </span>
                      <Badge variant="secondary">{team.leadName}</Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Members:
                      </span>
                      <span className="font-medium dark:text-white">
                        {team.memberCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Created:
                      </span>
                      <span className="dark:text-white">
                        {team.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Link href={`/teams/${team.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>

                    {isAdmin && (
                      <>
                        <EditTeamModal team={team} onTeamUpdated={loadTeams} />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTeam(team.id, team.name)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 dark:border-red-600 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {teams.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1 || isLoading}
              className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Previous
            </Button>

            <span className="text-sm text-gray-600 dark:text-gray-300">
              Page {currentPage} of {teams.totalPages} ({teams.total} total
              teams)
            </span>

            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === teams.totalPages || isLoading}
              className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
