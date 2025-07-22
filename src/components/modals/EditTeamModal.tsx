'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUIStore } from '@/stores/uiStore';
import { updateTeam } from '@/actions/teams';
import { MOCK_USERS } from '@/constants/mockData';
import { Team } from '@/types';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';

interface EditTeamModalProps {
  team: Team;
  onTeamUpdated?: () => void;
}

export function EditTeamModal({ team, onTeamUpdated }: EditTeamModalProps) {
  const { isEditTeamModalOpen, setEditTeamModalOpen, isLoading, setLoading } =
    useUIStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    leadId: '',
    leadName: '',
  });

  // Initialize form with team data when modal opens
  useEffect(() => {
    if (isEditTeamModalOpen && team) {
      setFormData({
        name: team.name,
        description: team.description || '',
        leadId: team.leadId,
        leadName: team.leadName,
      });
    }
  }, [isEditTeamModalOpen, team]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('description', formData.description);
      formDataObj.append('leadId', formData.leadId);
      formDataObj.append('leadName', formData.leadName);

      const result = await updateTeam(team.id, formDataObj);

      if (result.success) {
        setEditTeamModalOpen(false);
        toast.success('Team updated successfully!');
        onTeamUpdated?.();
      } else {
        toast.error(result.error || 'Failed to update team');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLeadChange = (leadId: string) => {
    const selectedLead = MOCK_USERS.find((user) => user.id === leadId);
    setFormData((prev) => ({
      ...prev,
      leadId,
      leadName: selectedLead?.name || '',
    }));
  };

  const handleOpenChange = (open: boolean) => {
    setEditTeamModalOpen(open);
  };

  return (
    <Dialog open={isEditTeamModalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription>
            Update the team details. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="editName">Team Name</Label>
            <Input
              id="editName"
              placeholder="Enter team name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="editDescription">Description (Optional)</Label>
            <Input
              id="editDescription"
              placeholder="Enter team description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="editLead">Team Lead</Label>
            <Select
              value={formData.leadId}
              onValueChange={handleLeadChange}
              required
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a team lead" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_USERS.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name || !formData.leadId}
            >
              {isLoading ? 'Updating...' : 'Update Team'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
