import { NextRequest, NextResponse } from 'next/server';
import { getTeamMembers, addTeamMember } from '@/actions/members';

// GET /api/members?teamId=... - Get team members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;

    if (!teamId) {
      return NextResponse.json(
        { success: false, error: 'Team ID is required' },
        { status: 400 }
      );
    }

    const result = await getTeamMembers(teamId, { page, limit, search });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

// POST /api/members - Add a new team member
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await addTeamMember(formData);

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result.member,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add member' },
      { status: 500 }
    );
  }
}
