'use client';

import { useState } from 'react';
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
import { createTeam } from '@/actions/teams';
import { MOCK_USERS } from '@/constants/mockData';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface CreateTeamModalProps {
  onTeamCreated?: () => void;
}

export function CreateTeamModal({ onTeamCreated }: CreateTeamModalProps) {
  const { isCreateTeamModalOpen, setCreateTeamModalOpen, isLoading, setLoading } =
    useUIStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    leadId: '',
    leadName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('description', formData.description);
      formDataObj.append('leadId', formData.leadId);
      formDataObj.append('leadName', formData.leadName);

      const result = await createTeam(formDataObj);

      if (result.success) {
        setCreateTeamModalOpen(false);
        setFormData({ name: '', description: '', leadId: '', leadName: '' });
        toast.success('Team created successfully!');
        onTeamCreated?.();
      } else {
        toast.error(result.error || 'Failed to create team');
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
    setCreateTeamModalOpen(open);
    if (!open) {
      setFormData({ name: '', description: '', leadId: '', leadName: '' });
    }
  };

  return (
    <Dialog open={isCreateTeamModalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Team</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Add a new team to your organization. Choose a team lead who will manage the
            team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              placeholder="Enter team name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Enter team description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead">Team Lead</Label>
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
              {isLoading ? 'Creating...' : 'Create Team'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
