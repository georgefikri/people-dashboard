# API Configuration Guide

## Overview

The API functions in `/src/app/api/` are designed to work with both mock data and real APIs. They automatically switch between:

1. **Mock Data Mode** - Uses server actions with mock data
2. **Real API Mode** - Uses Axios to call external APIs

## Environment Variables

### For Development (Mock Data)

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_DATA=true
# NEXT_PUBLIC_API_URL= (leave empty)
```

### For Production (Real API)

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_URL=https://api.yourbackend.com
```

## How It Works

### Mock Data Mode (Default)

- Uses server actions directly
- No HTTP requests
- Fast development
- Uses mock data from `/src/constants/mockData.ts`

### Real API Mode

- Uses Axios for HTTP requests
- Calls external API endpoints
- Production ready
- Requires real backend API

## API Functions Available

### Members

```typescript
import { getMembers, createMember } from '@/app/api/members';

// Get team members
const members = await getMembers('team-123', { page: 1, limit: 10 });

// Create member
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('email', 'john@example.com');
const result = await createMember(formData);
```

### Teams

```typescript
import { getTeams, createTeam } from '@/app/api/teams';

// Get teams
const teams = await getTeams({ page: 1, limit: 10, search: 'engineering' });

// Create team
const formData = new FormData();
formData.append('name', 'Engineering Team');
const result = await createTeam(formData);
```

## Switching Between Modes

1. **Development**: Set `NEXT_PUBLIC_USE_MOCK_DATA=true` (default)
2. **Production**: Set `NEXT_PUBLIC_USE_MOCK_DATA=false` and provide `NEXT_PUBLIC_API_URL`

## Benefits

- ✅ **Seamless switching** between mock and real data
- ✅ **No code changes** needed when switching
- ✅ **Type safety** maintained in both modes
- ✅ **Error handling** consistent across modes
- ✅ **Development friendly** with fast mock data
- ✅ **Production ready** with real API support
