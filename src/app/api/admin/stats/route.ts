import {  NextResponse } from 'next/server';
import { AdminDashboardStats, CronJobStatus } from '@/types/admin';

export async function GET() {
  try {
    // Mock authentication check
    // const user = await getCurrentUser(request);
    // if (!user || !user.roles.includes('admin')) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Mock dashboard stats - replace with actual database queries
    const stats: AdminDashboardStats = {
      totalSessions: Math.floor(Math.random() * 50) + 20,
      totalRSVPs: Math.floor(Math.random() * 500) + 200,
      upcomingSessions: Math.floor(Math.random() * 15) + 5,
      activeUsers: Math.floor(Math.random() * 100) + 50,
      remindersSentToday: Math.floor(Math.random() * 30) + 10,
      systemHealth: Math.random() > 0.8 ? 'warning' : 'healthy',
      lastCronRun: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
    };

    // Mock cron job statuses
    const cronJobs: CronJobStatus[] = [
      {
        name: 'Process Notifications',
        lastRun: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        status: 'success',
        nextRun: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        message: 'Processed 15 notifications',
      },
      {
        name: 'Send Reminders',
        lastRun: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        status: 'success',
        nextRun: new Date(Date.now() + 21 * 60 * 60 * 1000).toISOString(),
        message: 'Sent 8 reminders',
      },
      {
        name: 'Cleanup Expired RSVPs',
        lastRun: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'success',
        nextRun: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        message: 'Cleaned 3 expired entries',
      },
      {
        name: 'Health Check',
        lastRun: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: Math.random() > 0.9 ? 'failed' : 'success',
        nextRun: new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString(),
        message: 'System healthy',
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        stats,
        cronJobs,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
