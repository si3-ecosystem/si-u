/**
 * RSVP Integration Tests
 * Tests the complete RSVP flow from session display to calendar integration
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionCard } from '@/components/molecules/cards/sessionCard';
import { RSVPForm } from '@/components/molecules/forms/RSVPForm';
import { CalendarIntegration } from '@/utils/calendarIntegration';
import { RSVPService } from '@/services/rsvpService';
import { RSVPStatus } from '@/types/rsvp';
import { GuidesSession } from '@/types/siherguides/session';

// Mock the services
jest.mock('@/services/rsvpService');
jest.mock('@/utils/errorHandler');

const mockRSVPService = RSVPService as jest.Mocked<typeof RSVPService>;

// Test data
const mockSession: GuidesSession = {
  _id: 'test-session-1',
  title: 'Test Session',
  description: 'A test session for RSVP functionality',
  date: '2024-12-01T10:00:00Z',
  endDate: '2024-12-01T11:00:00Z',
  time: '10:00 AM',
  guideName: 'Test Guide',
  language: 'English',
  rsvpSettings: {
    enabled: true,
    maxCapacity: 50,
    waitlistEnabled: true,
    allowGuests: true,
    maxGuestsPerRSVP: 3,
    requiresApproval: false,
    collectContactInfo: true,
  },
  location: {
    type: 'virtual',
    venue: 'Zoom Meeting',
    virtualLink: 'https://zoom.us/j/123456789',
  },
  organizer: {
    name: 'SI3 Team',
    email: 'guides@si3.space',
  },
};

const mockRSVP = {
  _id: 'test-rsvp-1',
  eventId: 'test-session-1',
  userId: 'test-user-1',
  status: RSVPStatus.ATTENDING,
  guestCount: 2,
  dietaryRestrictions: 'Vegetarian',
  specialRequests: 'Wheelchair accessible',
  contactInfo: {
    phone: '+1234567890',
    emergencyContact: 'John Doe',
    emergencyPhone: '+0987654321',
  },
  approvalStatus: 'approved' as const,
  confirmationEmailSent: true,
  reminderEmailsSent: [],
  createdAt: '2024-11-01T10:00:00Z',
  updatedAt: '2024-11-01T10:00:00Z',
};

// Test wrapper with QueryClient
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('RSVP Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('SessionCard RSVP Functionality', () => {
    it('should display session information correctly', () => {
      const mockProps = {
        session: mockSession,
        openDropdownId: null,
        toggleDropdown: jest.fn(),
        setOpenDropdownId: jest.fn(),
      };

      render(
        <TestWrapper>
          <SessionCard {...mockProps} />
        </TestWrapper>
      );

      expect(screen.getByText('Test Session')).toBeInTheDocument();
      expect(screen.getByText('Test Guide')).toBeInTheDocument();
      expect(screen.getByText('Attend Event')).toBeInTheDocument();
    });

    it('should handle RSVP status changes', async () => {
      mockRSVPService.getUserRSVPForEvent.mockResolvedValue({
        status: 'success',
        data: null,
      });

      mockRSVPService.createRSVP.mockResolvedValue({
        status: 'success',
        data: mockRSVP,
      });

      const mockProps = {
        session: mockSession,
        openDropdownId: mockSession._id,
        toggleDropdown: jest.fn(),
        setOpenDropdownId: jest.fn(),
      };

      render(
        <TestWrapper>
          <SessionCard {...mockProps} />
        </TestWrapper>
      );

      // Wait for the dropdown to appear
      await waitFor(() => {
        expect(screen.getByText("I'm Attending")).toBeInTheDocument();
      });

      // Click on "I'm Attending"
      fireEvent.click(screen.getByText("I'm Attending"));

      await waitFor(() => {
        expect(mockRSVPService.createRSVP).toHaveBeenCalledWith({
          eventId: mockSession._id,
          status: RSVPStatus.ATTENDING,
          guestCount: 1,
        });
      });
    });

    it('should disable RSVP when not enabled', () => {
      const disabledSession = {
        ...mockSession,
        rsvpSettings: {
          ...mockSession.rsvpSettings!,
          enabled: false,
        },
      };

      const mockProps = {
        session: disabledSession,
        openDropdownId: null,
        toggleDropdown: jest.fn(),
        setOpenDropdownId: jest.fn(),
      };

      render(
        <TestWrapper>
          <SessionCard {...mockProps} />
        </TestWrapper>
      );

      const button = screen.getByText('RSVP Disabled');
      expect(button).toBeDisabled();
    });
  });

  describe('RSVPForm Component', () => {
    it('should render form fields correctly', () => {
      render(
        <TestWrapper>
          <RSVPForm session={mockSession} />
        </TestWrapper>
      );

      expect(screen.getByText('Will you attend this session?')).toBeInTheDocument();
      expect(screen.getByText("I'll attend")).toBeInTheDocument();
      expect(screen.getByText('Maybe')).toBeInTheDocument();
      expect(screen.getByText("Can't attend")).toBeInTheDocument();
    });

    it('should show guest count field when guests are allowed', async () => {
      render(
        <TestWrapper>
          <RSVPForm session={mockSession} />
        </TestWrapper>
      );

      // Select "I'll attend"
      fireEvent.click(screen.getByLabelText("I'll attend"));

      await waitFor(() => {
        expect(screen.getByText('Number of Guests (including yourself)')).toBeInTheDocument();
      });
    });

    it('should show contact info fields when enabled', async () => {
      render(
        <TestWrapper>
          <RSVPForm session={mockSession} />
        </TestWrapper>
      );

      // Select "I'll attend"
      fireEvent.click(screen.getByLabelText("I'll attend"));

      await waitFor(() => {
        expect(screen.getByText('Contact Information')).toBeInTheDocument();
        expect(screen.getByLabelText('Phone Number (Optional)')).toBeInTheDocument();
      });
    });

    it('should submit RSVP correctly', async () => {
      mockRSVPService.createRSVP.mockResolvedValue({
        status: 'success',
        data: mockRSVP,
      });

      const onSuccess = jest.fn();

      render(
        <TestWrapper>
          <RSVPForm session={mockSession} onSuccess={onSuccess} />
        </TestWrapper>
      );

      // Fill out the form
      fireEvent.click(screen.getByLabelText("I'll attend"));
      
      await waitFor(() => {
        const guestCountInput = screen.getByLabelText('Number of Guests (including yourself)');
        fireEvent.change(guestCountInput, { target: { value: '2' } });
      });

      // Submit the form
      fireEvent.click(screen.getByText('Submit RSVP'));

      await waitFor(() => {
        expect(mockRSVPService.createRSVP).toHaveBeenCalledWith({
          eventId: mockSession._id,
          status: RSVPStatus.ATTENDING,
          guestCount: 2,
          contactInfo: expect.any(Object),
        });
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Calendar Integration', () => {
    it('should generate correct Google Calendar URL', () => {
      const event = CalendarIntegration.sessionToCalendarEvent(mockSession);
      const url = CalendarIntegration.generateGoogleCalendarUrl(event);

      expect(url).toContain('calendar.google.com');
      expect(url).toContain('Test%20Session');
    });

    it('should generate correct ICS content', () => {
      const event = CalendarIntegration.sessionToCalendarEvent(mockSession);
      const icsContent = CalendarIntegration.generateICSContent(event);

      expect(icsContent).toContain('BEGIN:VCALENDAR');
      expect(icsContent).toContain('SUMMARY:Test Session');
      expect(icsContent).toContain('ORGANIZER;CN=SI3 Team:MAILTO:guides@si3.space');
      expect(icsContent).toContain('END:VCALENDAR');
    });

    it('should handle virtual session location correctly', () => {
      const event = CalendarIntegration.sessionToCalendarEvent(mockSession);
      
      expect(event.location).toBe('Zoom Meeting');
      expect(event.url).toBe('https://zoom.us/j/123456789');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      mockRSVPService.createRSVP.mockRejectedValue(new Error('API Error'));

      render(
        <TestWrapper>
          <RSVPForm session={mockSession} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByLabelText("I'll attend"));
      fireEvent.click(screen.getByText('Submit RSVP'));

      // Error should be handled by ErrorHandler
      await waitFor(() => {
        expect(mockRSVPService.createRSVP).toHaveBeenCalled();
      });
    });

    it('should validate form inputs', async () => {
      render(
        <TestWrapper>
          <RSVPForm session={mockSession} />
        </TestWrapper>
      );

      // Try to submit without selecting status
      fireEvent.click(screen.getByText('Submit RSVP'));

      // Form validation should prevent submission
      expect(mockRSVPService.createRSVP).not.toHaveBeenCalled();
    });
  });

  describe('Performance Optimizations', () => {
    it('should use optimistic updates for RSVP changes', async () => {
      mockRSVPService.getUserRSVPForEvent.mockResolvedValue({
        status: 'success',
        data: null,
      });

      mockRSVPService.createRSVP.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          status: 'success',
          data: mockRSVP,
        }), 1000))
      );

      const mockProps = {
        session: mockSession,
        openDropdownId: mockSession._id,
        toggleDropdown: jest.fn(),
        setOpenDropdownId: jest.fn(),
      };

      render(
        <TestWrapper>
          <SessionCard {...mockProps} />
        </TestWrapper>
      );

      // The UI should update optimistically before the API call completes
      await waitFor(() => {
        expect(screen.getByText("I'm Attending")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("I'm Attending"));

      // Button should show updating state
      await waitFor(() => {
        expect(screen.getByText('Updating...')).toBeInTheDocument();
      });
    });
  });
});
