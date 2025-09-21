import { NextRequest, NextResponse } from 'next/server';
import { 
  updateSiherLiveSession, 
  deleteSiherLiveSession 
} from '@/lib/server-actions/siher-live';

// PUT - Update session
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const result = await updateSiherLiveSession(id, updates);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      data: result.data,
      message: result.message,
    });
    
    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
  } catch (error) {
    console.error('PUT /api/siher-live/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const result = await deleteSiherLiveSession(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      data: result.data,
      message: result.message,
    });
    
    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
  } catch (error) {
    console.error('DELETE /api/siher-live/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
