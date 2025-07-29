import { NextRequest, NextResponse } from 'next/server';
import { AdminRSVPData } from '@/types/admin';

// Mock data - replace with actual database queries
const generateMockRSVPs = (): AdminRSVPData[] => {
  const statuses = ['attending', 'maybe', 'not_attending'] as const;
  const sessions = [
    { id: '1', title: 'React Best Practices', startTime: '2024-02-15T10:00:00Z', endTime: '2024-02-15T12:00:00Z', location: 'Online' },
    { id: '2', title: 'TypeScript Deep Dive', startTime: '2024-02-16T14:00:00Z', endTime: '2024-02-16T16:00:00Z', location: 'Conference Room A' },
    { id: '3', title: 'Next.js 14 Features', startTime: '2024-02-17T09:00:00Z', endTime: '2024-02-17T11:00:00Z', location: 'Online' },
  ];

  return Array.from({ length: 25 }, (_, i) => {
    const session = sessions[i % sessions.length];
    return {
      id: `rsvp-${i + 1}`,
      sessionId: session.id,
      userId: `user-${i + 1}`,
      status: statuses[i % statuses.length],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: `user-${i + 1}`,
        email: `user${i + 1}@example.com`,
        firstName: `User`,
        lastName: `${i + 1}`,
        roles: ['scholar'],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      },
      session,
    };
  });
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Mock authentication check
    // const user = await getCurrentUser(request);
    // if (!user || !user.roles.includes('admin')) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    let rsvps = generateMockRSVPs();

    // Apply filters
    if (sessionId) {
      rsvps = rsvps.filter(rsvp => rsvp.sessionId === sessionId);
    }
    if (status) {
      rsvps = rsvps.filter(rsvp => rsvp.status === status);
    }

    // Pagination
    const total = rsvps.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRSVPs = rsvps.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedRSVPs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: endIndex < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching admin RSVPs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSVPs' },
      { status: 500 }
    );
  }
}
