import { NextRequest, NextResponse } from 'next/server';
import { RSVPStatus } from '@/types/rsvp';

// Mock data store (replace with actual database)
const mockRSVPs = new Map<string, { userId: string; status: RSVPStatus; sessionId: string }>();

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    const { userId, status }: { userId: string; status: RSVPStatus } = await request.json();

    if (!sessionId || !userId) {
      return NextResponse.json(
        { error: 'Session ID and User ID are required' },
        { status: 400 }
      );
    }

    const rsvpKey = `${sessionId}-${userId}`;
    
    if (status === null) {
      // Remove RSVP
      mockRSVPs.delete(rsvpKey);
    } else {
      // Add or update RSVP
      mockRSVPs.set(rsvpKey, {
        userId,
        status,
        sessionId,
      });
    }

    const rsvpData = mockRSVPs.get(rsvpKey);

    return NextResponse.json({
      success: true,
      rsvp: rsvpData ? {
        ...rsvpData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } : null,
    });
  } catch (error) {
    console.error('RSVP API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop(); // Get userId from URL

    if (!sessionId || !userId) {
      return NextResponse.json(
        { error: 'Session ID and User ID are required' },
        { status: 400 }
      );
    }

    const rsvpKey = `${sessionId}-${userId}`;
    const rsvpData = mockRSVPs.get(rsvpKey);

    if (!rsvpData) {
      return NextResponse.json(
        { error: 'RSVP not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      rsvp: {
        ...rsvpData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Get RSVP API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
