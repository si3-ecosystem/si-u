/**
 * RSVP Types and Interfaces
 * Based on SI3 RSVP API Integration Guide
 */

// RSVP Status Enum
export enum RSVPStatus {
  ATTENDING = 'attending',
  NOT_ATTENDING = 'not_attending',
  MAYBE = 'maybe',
  WAITLISTED = 'waitlisted'
}

// User Roles
export enum UserRole {
  ADMIN = 'admin',
  GUIDE = 'guide',
  SCHOLAR = 'scholar',
  PARTNER = 'partner'
}

// Contact Information
export interface IContactInfo {
  phone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

// Digital Link
export interface IDigitalLink {
  platform: 'github' | 'twitter' | 'website' | 'linkedin' | 'facebook' | 'instagram' | 'portfolio' | 'other';
  url: string;
}

// Notification Settings Interface
export interface INotificationSettings {
  emailUpdates: boolean;
  sessionReminder: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
  eventAnnouncements: boolean;
}

// Wallet Information Interface
export interface IWalletInfo {
  address?: string;
  connectedWallet?: 'Zerion' | 'MetaMask' | 'WalletConnect' | 'Other';
  network?: 'Mainnet' | 'Polygon' | 'Arbitrum' | 'Base' | 'Optimism';
  connectedAt?: string;
  lastUsed?: string;
}

// User Interface
export interface IUser {
  _id: string;
  email: string;
  username?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  lastLogin?: string;
  details?: string;
  roles: UserRole[];
  isVerified: boolean;
  newsletter: boolean;
  interests: string[];
  companyName?: string;
  wallet_address?: string; // Legacy field - use walletInfo.address instead
  personalValues: string[];
  companyAffiliation?: string;
  digitalLinks: IDigitalLink[];
  createdAt: string;
  updatedAt: string;
  // New fields from backend implementation
  notificationSettings?: INotificationSettings;
  walletInfo?: IWalletInfo;
  settingsUpdatedAt?: string;
}

// RSVP Interface
export interface IRSVP {
  _id: string;
  eventId: string;
  userId: string;
  status: RSVPStatus;
  guestCount: number;
  dietaryRestrictions?: string;
  specialRequests?: string;
  contactInfo?: IContactInfo;
  waitlistPosition?: number;
  waitlistJoinedAt?: string;
  adminNotes?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  confirmationEmailSent: boolean;
  reminderEmailsSent: string[];
  createdAt: string;
  updatedAt: string;
  user?: IUser; // Populated user data
}

// Request/Response Types

// Create RSVP Request
export interface CreateRSVPRequest {
  eventId: string;
  status: RSVPStatus;
  guestCount: number;
  specialRequests?: string;
  contactInfo?: IContactInfo;
}

// Update RSVP Request
export interface UpdateRSVPRequest {
  status?: RSVPStatus;
  guestCount?: number;
  dietaryRestrictions?: string;
  specialRequests?: string;
  contactInfo?: IContactInfo;
  adminNotes?: string;
}

// Join Waitlist Request
export interface JoinWaitlistRequest {
  eventId: string;
  guestCount: number;
  notes?: string;
}

// API Response Wrapper
export interface ApiResponse<T = any> {
  status: 'success' | 'fail' | 'error';
  message?: string;
  data?: T;
  results?: number;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalComments?: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Error Response
export interface ApiError {
  status: 'fail' | 'error';
  error: {
    message: string;
    statusCode: number;
    errorCode: string;
    timestamp: string;
    details?: string[];
  };
}

// Event Stats Response
export interface EventStatsResponse {
  totalRSVPs: number;
  totalGuests: number;
  attendingCount: number;
  notAttendingCount: number;
  maybeCount: number;
  waitlistCount: number;
  pendingApprovalCount: number;
  capacityInfo: {
    maxCapacity?: number;
    availableSpots?: number;
    isAtCapacity: boolean;
  };
}

// User RSVPs Query Parameters
export interface GetUserRSVPsParams {
  page?: number;
  limit?: number;
  status?: RSVPStatus;
}

// Auth Token Payload
export interface TokenPayload {
  _id: string;
  email: string;
  roles: UserRole[];
  iat?: number;
  exp?: number;
}

// Login Response
export interface LoginResponse {
  status: 'success';
  message: string;
  data: {
    token: string;
    user: IUser;
  };
}

// Session with RSVP data (for UI components)
export interface SessionWithRSVP {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  maxAttendees?: number;
  currentAttendees: number;
  userRSVP?: IRSVP;
  rsvpCounts: {
    attending: number;
    not_attending: number;
    maybe: number;
    waitlisted?: number;
  };
}

// Legacy types for backward compatibility
export type RSVPData = IRSVP;
export interface RSVPResponse {
  success: boolean;
  data?: RSVPData;
  message?: string;
  error?: string;
}

export interface RSVPMutationData {
  sessionId: string;
  status: RSVPStatus;
}
