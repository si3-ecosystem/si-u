import { NextRequest, NextResponse } from 'next/server';
import { 
  createSiherLiveSession, 
  updateSiherLiveSession, 
  deleteSiherLiveSession,
  getSiherLiveSessionsAction 
} from '@/lib/server-actions/siher-live';

// GET - Fetch sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessType = searchParams.get('accessType') || undefined;

    const result = await getSiherLiveSessionsAction(accessType);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('GET /api/siher-live error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new session
export async function POST(request: NextRequest) {
  try {
    const sessionData = await request.json();

    if (!sessionData.title || !sessionData.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const result = await createSiherLiveSession(sessionData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    console.error('POST /api/siher-live error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}