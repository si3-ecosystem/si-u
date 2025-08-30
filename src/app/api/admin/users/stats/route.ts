
// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { generateMockUsers } from '../route';

export async function GET(request: NextRequest) {
  try {
    // Mock authentication check
    // const user = await getCurrentUser(request);
    // if (!user || !user.roles.includes('admin')) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    console.log('[Admin Users Stats API] Fetching user statistics...');

    // Generate mock users data (in real app, this would be from database)
    const users = generateMockUsers();

    // Calculate overview statistics
    const totalUsers = users.length;
    const verifiedUsers = users.filter(u => u.isVerified).length;
    const unverifiedUsers = totalUsers - verifiedUsers;
    
    // Calculate wallet statistics
    const usersWithWallets = users.filter(u => 
      u.wallet_address || u.walletInfo?.address || u.email?.includes('@wallet.temp')
    ).length;
    const usersWithoutWallets = totalUsers - usersWithWallets;
    
    // Calculate wallet verified users (users with actual wallet addresses, not temp emails)
    const walletVerifiedUsers = users.filter(u => 
      (u.wallet_address || u.walletInfo?.address) && !u.email?.includes('@wallet.temp')
    ).length;
    
    // Calculate newsletter subscribers
    const subscribedToNewsletter = users.filter(u => u.newsletter).length;

    // Calculate role distribution
    const roleDistribution = users.reduce((acc, user) => {
      const role = user.roles[0] || 'scholar'; // Take first role or default to scholar
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate role breakdown with percentages
    const roleBreakdown = Object.entries(roleDistribution)
      .map(([role, count]) => ({
        role,
        count,
        percentage: Math.round((count / totalUsers) * 100)
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending

    // Calculate activity statistics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentRegistrations = users.filter(u => {
      const createdAt = new Date(u.createdAt);
      return createdAt >= thirtyDaysAgo;
    }).length;

    // Mock active users (users who logged in within last 30 days)
    const activeUsers = Math.floor(totalUsers * 0.45); // 45% active rate
    const activeUserPercentage = Math.round((activeUsers / totalUsers) * 100);

    const response = {
      status: "success",
      cached: false,
      data: {
        overview: {
          totalUsers,
          verifiedUsers,
          walletVerifiedUsers,
          usersWithWallets,
          subscribedToNewsletter
        },
        verification: {
          total: totalUsers,
          verified: verifiedUsers,
          unverified: unverifiedUsers,
          walletVerified: walletVerifiedUsers
        },
        wallets: {
          total: totalUsers,
          withWallet: usersWithWallets,
          withoutWallet: usersWithoutWallets
        },
        roleDistribution,
        roleSummary: {
          totalRoles: Object.keys(roleDistribution).length,
          totalUsersFromRoles: totalUsers,
          averageUsersPerRole: Math.round(totalUsers / Object.keys(roleDistribution).length),
          roleBreakdown
        },
        activity: {
          recentRegistrations,
          activeUsers,
          activeUserPercentage
        },
        generatedAt: new Date().toISOString()
      }
    };

    console.log('[Admin Users Stats API] Response:', {
      totalUsers,
      verifiedUsers,
      walletVerifiedUsers,
      usersWithWallets,
      roleDistribution
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching admin user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user statistics' },
      { status: 500 }
    );
  }
}
