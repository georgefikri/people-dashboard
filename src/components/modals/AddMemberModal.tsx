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
import { addTeamMember } from '@/actions/members';
import { UserRole } from '@/types';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface AddMemberModalProps {
  teamId: string;
  onMemberAdded?: () => void;
}

export function AddMemberModal({ teamId, onMemberAdded }: AddMemberModalProps) {
  const { isAddMemberModalOpen, setAddMemberModalOpen, isLoading, setLoading } =
    useUIStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member' as UserRole,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('email', formData.email);
      formDataObj.append('role', formData.role);
      formDataObj.append('teamId', teamId);

      const result = await addTeamMember(formDataObj);

      if (result.success) {
        setAddMemberModalOpen(false);
        setFormData({ name: '', email: '', role: 'member' });
        toast.success('Member added successfully!');
        onMemberAdded?.();
      } else {
        toast.error(result.error || 'Failed to add member');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setAddMemberModalOpen(open);
    if (!open) {
      setFormData({ name: '', email: '', role: 'member' });
    }
  };

  return (
    <Dialog open={isAddMemberModalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <UserPlus className="h-4 w-4" />
          <span>Add Member</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            Add a new member to this team. They will be able to collaborate with other
            team members.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="memberName">Full Name</Label>
            <Input
              id="memberName"
              placeholder="Enter member's full name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="memberEmail">Email Address</Label>
            <Input
              id="memberEmail"
              type="email"
              placeholder="Enter member's email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="memberRole">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: UserRole) =>
                setFormData((prev) => ({ ...prev, role: value }))
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
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
              disabled={isLoading || !formData.name || !formData.email}
            >
              {isLoading ? 'Adding...' : 'Add Member'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
