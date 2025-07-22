import { User, Team, TeamMember } from '@/types';

// Mock users for authentication
export const MOCK_USERS: User[] = [
  {
    id: 'admin-1',
    email: 'admin@demo.com',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: 'member-1',
    email: 'john@demo.com',
    name: 'John Doe',
    role: 'member',
  },
  {
    id: 'member-2',
    email: 'jane@demo.com',
    name: 'Jane Smith',
    role: 'member',
  },
  {
    id: 'member-3',
    email: 'mike@demo.com',
    name: 'Mike Johnson',
    role: 'member',
  },
];

// Hardcoded credentials
export const ADMIN_CREDENTIALS = {
  email: 'admin@demo.com',
  password: 'admin123',
};

// Mock teams data
export const MOCK_TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'Frontend Development',
    description: 'Responsible for all frontend applications',
    leadId: 'member-1',
    leadName: 'John Doe',
    memberCount: 4,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'team-2',
    name: 'Backend Development',
    description: 'API and server-side development',
    leadId: 'member-2',
    leadName: 'Jane Smith',
    memberCount: 3,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'team-3',
    name: 'DevOps',
    description: 'Infrastructure and deployment',
    leadId: 'member-3',
    leadName: 'Mike Johnson',
    memberCount: 2,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: 'team-4',
    name: 'QA Testing',
    description: 'Quality assurance and testing',
    leadId: 'admin-1',
    leadName: 'Admin User',
    memberCount: 3,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-30'),
  },
  {
    id: 'team-5',
    name: 'Design',
    description: 'UI/UX Design team',
    leadId: 'member-1',
    leadName: 'John Doe',
    memberCount: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'team-6',
    name: 'Product Management',
    description: 'Product strategy and roadmap',
    leadId: 'member-2',
    leadName: 'Jane Smith',
    memberCount: 2,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-02-05'),
  },
];

// Mock team members data
export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  // Frontend Development team
  {
    id: 'tm-1',
    name: 'John Doe',
    email: 'john@demo.com',
    role: 'member',
    teamId: 'team-1',
    joinedAt: new Date('2024-01-01'),
  },
  {
    id: 'tm-2',
    name: 'Alice Brown',
    email: 'alice@demo.com',
    role: 'member',
    teamId: 'team-1',
    joinedAt: new Date('2024-01-05'),
  },
  {
    id: 'tm-3',
    name: 'Bob Wilson',
    email: 'bob@demo.com',
    role: 'member',
    teamId: 'team-1',
    joinedAt: new Date('2024-01-10'),
  },
  {
    id: 'tm-4',
    name: 'Carol Davis',
    email: 'carol@demo.com',
    role: 'member',
    teamId: 'team-1',
    joinedAt: new Date('2024-01-12'),
  },
  // Backend Development team
  {
    id: 'tm-5',
    name: 'Jane Smith',
    email: 'jane@demo.com',
    role: 'member',
    teamId: 'team-2',
    joinedAt: new Date('2024-01-05'),
  },
  {
    id: 'tm-6',
    name: 'David Lee',
    email: 'david@demo.com',
    role: 'member',
    teamId: 'team-2',
    joinedAt: new Date('2024-01-08'),
  },
  {
    id: 'tm-7',
    name: 'Emma Taylor',
    email: 'emma@demo.com',
    role: 'member',
    teamId: 'team-2',
    joinedAt: new Date('2024-01-15'),
  },
  // DevOps team
  {
    id: 'tm-8',
    name: 'Mike Johnson',
    email: 'mike@demo.com',
    role: 'member',
    teamId: 'team-3',
    joinedAt: new Date('2024-01-10'),
  },
  {
    id: 'tm-9',
    name: 'Sarah Connor',
    email: 'sarah@demo.com',
    role: 'member',
    teamId: 'team-3',
    joinedAt: new Date('2024-01-18'),
  },
];
