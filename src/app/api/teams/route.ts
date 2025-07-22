import { NextRequest, NextResponse } from 'next/server';
import { getTeams, createTeam } from '@/actions/teams';

// GET /api/teams - Get paginated teams
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;

    const result = await getTeams({ page, limit, search });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

// POST /api/teams - Create a new team
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await createTeam(formData);

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result.team,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create team' },
      { status: 500 }
    );
  }
}
