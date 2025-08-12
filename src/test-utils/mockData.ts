import { GuidesSession } from '@/types/siherguides/session'
import { IRSVP, RSVPStatus } from '@/types/rsvp'

// Mock session data
export const mockSession: GuidesSession = {
  _id: 'session-123',
  title: 'Introduction to Web3 Development',
  description: 'Learn the basics of Web3 development with practical examples.',
  date: '2024-08-15T10:00:00Z',
  endDate: '2024-08-15T11:00:00Z',
  time: '10:00 AM - 11:00 AM',
  language: 'English',
  guideName: 'John Doe',
  partner: {
    _id: 'partner-1',
    title: 'Uniswap',
    logo: {
      _type: 'image',
      asset: {
        _ref: 'image-ref',
        _type: 'reference',
      },
    },
  },
  location: {
    type: 'virtual',
    virtualLink: 'https://zoom.us/j/123456789',
  },
  rsvpSettings: {
    enabled: true,
    maxCapacity: 100,
    waitlistEnabled: true,
    rsvpDeadline: '2024-08-15T09:00:00Z',
    allowGuests: true,
    maxGuestsPerRSVP: 2,
    requiresApproval: false,
    collectContactInfo: true,
  },
  emailSettings: {
    sendConfirmation: true,
    reminderSchedule: [
      { timing: '24_hours' },
      { timing: '2_hours' },
    ],
  },
}

// Mock session with different configurations
export const mockSessionWithoutRSVP: GuidesSession = {
  ...mockSession,
  _id: 'session-no-rsvp',
  rsvpSettings: {
    ...mockSession.rsvpSettings!,
    enabled: false,
  },
}

export const mockSessionPastDeadline: GuidesSession = {
  ...mockSession,
  _id: 'session-past-deadline',
  rsvpSettings: {
    ...mockSession.rsvpSettings!,
    rsvpDeadline: '2024-08-10T09:00:00Z', // Past deadline
  },
}

export const mockSessionRequiresApproval: GuidesSession = {
  ...mockSession,
  _id: 'session-approval',
  rsvpSettings: {
    ...mockSession.rsvpSettings!,
    requiresApproval: true,
  },
}

// Mock RSVP data
export const mockRSVP: IRSVP = {
  _id: 'rsvp-123',
  eventId: 'session-123',
  userId: 'test-user-id',
  status: RSVPStatus.ATTENDING,
  guestCount: 1,
  approvalStatus: 'approved',
  confirmationEmailSent: true,
  reminderEmailsSent: [],
  createdAt: '2024-08-10T10:00:00Z',
  updatedAt: '2024-08-10T10:00:00Z',
}

export const mockRSVPPending: IRSVP = {
  ...mockRSVP,
  _id: 'rsvp-pending',
  approvalStatus: 'pending',
}

export const mockRSVPWaitlisted: IRSVP = {
  ...mockRSVP,
  _id: 'rsvp-waitlisted',
  status: RSVPStatus.WAITLISTED,
  waitlistPosition: 5,
  waitlistJoinedAt: '2024-08-10T10:00:00Z',
}

// Mock user states
export const mockUserWithVerifiedEmail = {
  _id: 'test-user-id',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  isEmailVerified: true,
  roles: ['scholar'],
}

export const mockUserWithUnverifiedEmail = {
  ...mockUserWithVerifiedEmail,
  isEmailVerified: false,
}

export const mockUserWithoutEmail = {
  ...mockUserWithVerifiedEmail,
  email: '',
  isEmailVerified: false,
}

// Mock API responses
export const mockCreateRSVPResponse = {
  status: 'success' as const,
  data: mockRSVP,
}

export const mockUpdateRSVPResponse = {
  status: 'success' as const,
  data: { ...mockRSVP, status: RSVPStatus.MAYBE },
}

export const mockDeleteRSVPResponse = {
  status: 'success' as const,
  data: null,
}

// Mock error responses
export const mockAPIError = {
  statusCode: 400,
  message: 'Bad Request',
  details: ['Invalid request data'],
}

export const mockNetworkError = new Error('Network Error')

// Calendar integration mocks
export const mockCalendarEvent = {
  title: 'Introduction to Web3 Development',
  description: 'Learn the basics of Web3 development with practical examples.',
  startDate: new Date('2024-08-15T10:00:00Z'),
  endDate: new Date('2024-08-15T11:00:00Z'),
  location: 'Online Meeting: https://zoom.us/j/123456789',
  url: 'https://zoom.us/j/123456789',
}

export const mockGoogleCalendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Introduction%20to%20Web3%20Development'
export const mockOutlookCalendarUrl = 'https://outlook.live.com/calendar/0/deeplink/compose?subject=Introduction%20to%20Web3%20Development'
export const mockICSContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SI3//RSVP System//EN'
