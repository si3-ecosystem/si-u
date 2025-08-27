import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/types/api';

// Extended User interface for admin table
export interface AdminUserData {
  _id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  roles: UserRole[];
  isVerified: boolean;
  newsletter: boolean;
  interests: string[];
  companyName?: string;
  companyAffiliation?: string;
  wallet_address?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  personalValues: string[];
  digitalLinks: Array<{
    platform: string;
    url: string;
  }>;
  walletInfo?: {
    address?: string;
    connectedWallet?: 'Zerion' | 'MetaMask' | 'WalletConnect' | 'Other';
    network?: 'Mainnet' | 'Polygon' | 'Arbitrum' | 'Base' | 'Optimism';
    connectedAt?: string;
    lastUsed?: string;
  };
}

// Generate mock users data with comprehensive information
function generateMockUsers(): AdminUserData[] {
  const roles: UserRole[] = ['admin', 'guide', 'scholar', 'partner'];
  const companies = ['Tech Corp', 'StartupXYZ', 'Innovation Lab', 'Digital Agency', 'Freelancer', null];
  const wallets = ['MetaMask', 'Zerion', 'WalletConnect', 'Other', null];
  const networks = ['Mainnet', 'Polygon', 'Arbitrum', 'Base', 'Optimism'];
  const interests = ['AI', 'Blockchain', 'Web3', 'DeFi', 'NFTs', 'Smart Contracts', 'Cryptocurrency', 'Decentralization'];
  const values = ['Innovation', 'Transparency', 'Community', 'Education', 'Sustainability', 'Inclusivity'];

  const users: AdminUserData[] = [];

  for (let i = 1; i <= 150; i++) {
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const randomWallet = wallets[Math.floor(Math.random() * wallets.length)];
    const randomNetwork = networks[Math.floor(Math.random() * networks.length)];
    const randomInterests = interests.slice(0, Math.floor(Math.random() * 4) + 1);
    const randomValues = values.slice(0, Math.floor(Math.random() * 3) + 1);
    
    const user: AdminUserData = {
      _id: `user-${i.toString().padStart(3, '0')}`,
      email: `user${i}@example.com`,
      username: `user${i}`,
      firstName: `First${i}`,
      lastName: `Last${i}`,
      name: `First${i} Last${i}`,
      roles: [randomRole],
      isVerified: Math.random() > 0.3,
      newsletter: Math.random() > 0.5,
      interests: randomInterests,
      companyName: randomCompany || undefined,
      companyAffiliation: randomCompany || undefined,
      wallet_address: randomWallet ? `0x${Math.random().toString(16).substr(2, 40)}` : undefined,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      personalValues: randomValues,
      digitalLinks: [
        { platform: 'github', url: `https://github.com/user${i}` },
        { platform: 'linkedin', url: `https://linkedin.com/in/user${i}` },
      ],
      walletInfo: randomWallet ? {
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        connectedWallet: randomWallet as 'Zerion' | 'MetaMask' | 'WalletConnect' | 'Other',
        network: randomNetwork as 'Mainnet' | 'Polygon' | 'Arbitrum' | 'Base' | 'Optimism',
        connectedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      } : undefined,
    };
    
    users.push(user);
  }

  return users;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '40');
    
    // Filtering parameters
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const isVerified = searchParams.get('isVerified');
    const hasWallet = searchParams.get('hasWallet');
    const newsletter = searchParams.get('newsletter');
    
    // Sorting parameters
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Mock authentication check
    // const user = await getCurrentUser(request);
    // if (!user || !user.roles.includes('admin')) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    console.log('[Admin Users API] Request params:', {
      page,
      limit,
      search,
      role,
      isVerified,
      hasWallet,
      newsletter,
      sortBy,
      sortOrder
    });

    let users = generateMockUsers();

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(user => 
        user.email.toLowerCase().includes(searchLower) ||
        user.firstName?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower) ||
        user.username?.toLowerCase().includes(searchLower) ||
        user.companyName?.toLowerCase().includes(searchLower)
      );
    }

    // Apply role filter
    if (role && role !== 'all') {
      users = users.filter(user => user.roles.includes(role as UserRole));
    }

    // Apply verification filter
    if (isVerified !== null && isVerified !== undefined && isVerified !== '') {
      users = users.filter(user => user.isVerified === (isVerified === 'true'));
    }

    // Apply wallet filter
    if (hasWallet !== null && hasWallet !== undefined && hasWallet !== '') {
      users = users.filter(user => {
        const hasWalletAddress = Boolean(user.wallet_address || user.walletInfo?.address);
        return hasWalletAddress === (hasWallet === 'true');
      });
    }

    // Apply newsletter filter
    if (newsletter !== null && newsletter !== undefined && newsletter !== '') {
      users = users.filter(user => user.newsletter === (newsletter === 'true'));
    }

    // Apply sorting
    users.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'name':
          aValue = `${a.firstName || ''} ${a.lastName || ''}`.trim();
          bValue = `${b.firstName || ''} ${b.lastName || ''}`.trim();
          break;
        case 'role':
          aValue = a.roles[0] || '';
          bValue = b.roles[0] || '';
          break;
        case 'isVerified':
          aValue = a.isVerified;
          bValue = b.isVerified;
          break;
        case 'lastLogin':
          aValue = a.lastLogin || '1970-01-01T00:00:00.000Z';
          bValue = b.lastLogin || '1970-01-01T00:00:00.000Z';
          break;
        case 'createdAt':
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        if (aValue === bValue) return 0;
        const comparison = aValue ? 1 : -1;
        return sortOrder === 'asc' ? comparison : -comparison;
      }

      return 0;
    });

    // Calculate pagination
    const total = users.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = users.slice(startIndex, endIndex);

    // Generate role statistics
    const roleStats = users.reduce((acc, user) => {
      const role = user.roles[0] || 'unknown';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const response = {
      status: "success",
      results: paginatedUsers.length,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers: total,
        limit,
        hasNextPage: endIndex < total,
        hasPreviousPage: page > 1,
      },
      data: {
        users: paginatedUsers,
      },
      totals: {
        totalUsers: total,
        totalPages,
        currentPage: page,
      },
      cached: false,
    };

    console.log('[Admin Users API] Response:', {
      totalUsers: total,
      returnedUsers: paginatedUsers.length,
      page,
      totalPages
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Admin Users API] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch users',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}