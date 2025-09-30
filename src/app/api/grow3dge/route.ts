// import { NextRequest, NextResponse } from 'next/server';
// import { 
//   createSiherLiveSession, 
//   getSiherLiveSessionsAction 
// } from '@/lib/server-actions/siher-live';

// // GET - Fetch sessions
// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const accessType = searchParams.get('accessType') || undefined;

//     const result = await getSiherLiveSessionsAction(accessType);

//     if (!result.success) {
//       return NextResponse.json({ error: result.error }, { status: 500 });
//     }

//     const response = NextResponse.json({ success: true, data: result.data });
    
//     // Add cache control headers to prevent caching
//     response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//     response.headers.set('Pragma', 'no-cache');
//     response.headers.set('Expires', '0');
//     response.headers.set('Surrogate-Control', 'no-store');
    
//     return response;
//   } catch (error) {
//     console.error('GET /api/siher-live error:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// // POST - Create new session
// export async function POST(request: NextRequest) {
//   try {
//     const sessionData = await request.json();

//     if (!sessionData.title || !sessionData.description) {
//       return NextResponse.json(
//         { error: 'Title and description are required' },
//         { status: 400 }
//       );
//     }

//     const result = await createSiherLiveSession(sessionData);

//     if (!result.success) {
//       return NextResponse.json({ error: result.error }, { status: 500 });
//     }

//     const response = NextResponse.json({
//       success: true,
//       data: result.data,
//       message: result.message,
//     });
    
//     // Add cache control headers to prevent caching
//     response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//     response.headers.set('Pragma', 'no-cache');
//     response.headers.set('Expires', '0');
//     response.headers.set('Surrogate-Control', 'no-store');
    
//     return response;
//   } catch (error) {
//     console.error('POST /api/siher-live error:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }



import { NextRequest, NextResponse } from 'next/server';
import { 
  createGrow3dgeSession, 
  getGrow3dgeSessionsAction 
} from '@/lib/server-actions/grow3dge';

// GET - Fetch sessions (removed all caching logic)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessType = searchParams.get('accessType') || undefined;

    const result = await getSiherLiveSessionsAction(accessType);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Simple response without any caching headers
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('GET /api/siher-live error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new session (removed all caching logic)
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
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Simple response without any caching headers
    return NextResponse.json({
      success: true,
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    console.error('POST /api/siher-live error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
