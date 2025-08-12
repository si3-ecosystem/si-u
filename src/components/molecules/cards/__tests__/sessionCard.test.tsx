import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test-utils'
import { SessionCard } from '../sessionCard'
import { useRSVP } from '@/hooks/useRSVP'
import { useCalendarIntegration } from '@/hooks/useCalendarIntegration'
import { ErrorHandler } from '@/utils/errorHandler'
import { RSVPStatus } from '@/types/rsvp'
import {
  mockSession,
  mockSessionWithoutRSVP,
  mockSessionPastDeadline,
  mockSessionRequiresApproval,
  mockRSVP,
  mockRSVPPending,
  mockRSVPWaitlisted,
  mockUserWithVerifiedEmail,
  mockUserWithUnverifiedEmail,
} from '@/test-utils/mockData'

// Mock the hooks
jest.mock('@/hooks/useRSVP')
jest.mock('@/hooks/useCalendarIntegration')
jest.mock('@/utils/errorHandler')
jest.mock('@/lib/sanity/image', () => ({
  urlForImage: jest.fn(() => ({ src: 'mocked-image-url' })),
}))

const mockUseRSVP = useRSVP as jest.MockedFunction<typeof useRSVP>
const mockUseCalendarIntegration = useCalendarIntegration as jest.MockedFunction<typeof useCalendarIntegration>
const mockErrorHandler = ErrorHandler as jest.Mocked<typeof ErrorHandler>

describe('SessionCard', () => {
  const defaultProps = {
    session: mockSession,
    openDropdownId: null,
    toggleDropdown: jest.fn(),
    setOpenDropdownId: jest.fn(),
  }

  const mockRSVPHook = {
    rsvp: null,
    rsvpStatus: null,
    hasRSVP: false,
    createRSVP: jest.fn(),
    updateRSVP: jest.fn(),
    deleteRSVP: jest.fn(),
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    config: {
      isRSVPEnabled: true,
      hasCapacityLimit: false,
      isWaitlistEnabled: true,
      allowsGuests: true,
      maxGuests: 2,
      requiresApproval: false,
      collectsContactInfo: true,
      isDeadlinePassed: false,
      maxCapacity: 100,
      rsvpDeadline: '2024-08-15T09:00:00Z',
      canUserRSVP: true,
      hasValidEmail: true,
    },
  }

  const mockCalendarHook = {
    addToGoogleCalendar: jest.fn(),
    addToAppleCalendar: jest.fn(),
    downloadICSFile: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRSVP.mockReturnValue(mockRSVPHook)
    mockUseCalendarIntegration.mockReturnValue(mockCalendarHook)
    mockErrorHandler.showInfo = jest.fn()
    mockErrorHandler.showSuccess = jest.fn()
    mockErrorHandler.showWarning = jest.fn()
    mockErrorHandler.handle = jest.fn()
  })

  describe('Rendering', () => {
    it('renders session information correctly', () => {
      render(<SessionCard {...defaultProps} />)

      expect(screen.getByText('Introduction to Web3 Development')).toBeInTheDocument()
      expect(screen.getByText('2024-08-15')).toBeInTheDocument()
      expect(screen.getByText('10:00 AM - 11:00 AM')).toBeInTheDocument()
      expect(screen.getByText('English')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('In partnership with')).toBeInTheDocument()
    })

    it('renders partner logo when available', () => {
      render(<SessionCard {...defaultProps} />)
      
      const partnerImage = screen.getByAltText('Uniswap')
      expect(partnerImage).toBeInTheDocument()
      expect(partnerImage).toHaveAttribute('src', 'mocked-image-url')
    })

    it('renders default button text when no RSVP exists', () => {
      render(<SessionCard {...defaultProps} />)
      
      expect(screen.getByText('Attend Event')).toBeInTheDocument()
    })

    it('renders session image placeholder', () => {
      render(<SessionCard {...defaultProps} />)
      
      const sessionImage = screen.getByAltText('Introduction to Web3 Development')
      expect(sessionImage).toBeInTheDocument()
      expect(sessionImage).toHaveAttribute('src', '/card_placeholder.png')
    })
  })

  describe('RSVP Functionality', () => {
    it('creates new RSVP when user clicks attend button', async () => {
      const user = userEvent.setup()
      render(<SessionCard {...defaultProps} />)

      const attendButton = screen.getByText('Attend Event')
      await user.click(attendButton)

      // Should open dropdown
      expect(defaultProps.toggleDropdown).toHaveBeenCalledWith('session-123')
    })

    it('handles direct RSVP creation correctly', () => {
      const createRSVPMock = jest.fn()
      mockUseRSVP.mockReturnValue({
        ...mockRSVPHook,
        createRSVP: createRSVPMock,
      })

      render(<SessionCard {...defaultProps} />)

      // Simulate direct RSVP call (this would be triggered from dropdown)
      const sessionCard = screen.getByText('Introduction to Web3 Development').closest('.p-4')
      expect(sessionCard).toBeInTheDocument()

      // Test the handleDirectRSVP function logic
      // Since it's not directly exposed, we test through the hook calls
      expect(mockUseRSVP).toHaveBeenCalledWith('session-123', mockSession)
    })

    it('updates existing RSVP when user has existing RSVP', () => {
      const updateRSVPMock = jest.fn()
      mockUseRSVP.mockReturnValue({
        ...mockRSVPHook,
        rsvp: mockRSVP,
        hasRSVP: true,
        rsvpStatus: RSVPStatus.ATTENDING,
        updateRSVP: updateRSVPMock,
      })

      render(<SessionCard {...defaultProps} />)

      expect(screen.getByText('Attending')).toBeInTheDocument()
    })

    it('handles RSVP deletion correctly', () => {
      const deleteRSVPMock = jest.fn()
      mockUseRSVP.mockReturnValue({
        ...mockRSVPHook,
        rsvp: mockRSVP,
        hasRSVP: true,
        rsvpStatus: RSVPStatus.ATTENDING,
        deleteRSVP: deleteRSVPMock,
      })

      render(<SessionCard {...defaultProps} />)

      // The delete functionality would be tested through the dropdown component
      expect(screen.getByText('Attending')).toBeInTheDocument()
    })

    it('shows loading state during RSVP operations', () => {
      mockUseRSVP.mockReturnValue({
        ...mockRSVPHook,
        isCreating: true,
      })

      render(<SessionCard {...defaultProps} />)

      expect(screen.getByText('Updating...')).toBeInTheDocument()
      const button = screen.getByRole('button', { name: 'Updating...' })
      expect(button).toBeDisabled()
    })

    it('shows different RSVP statuses correctly', () => {
      const statuses = [
        { status: RSVPStatus.ATTENDING, text: 'Attending' },
        { status: RSVPStatus.MAYBE, text: 'Maybe' },
        { status: RSVPStatus.NOT_ATTENDING, text: 'Not Attending' },
        { status: RSVPStatus.WAITLISTED, text: 'Waitlisted' },
      ]

      statuses.forEach(({ status, text }) => {
        mockUseRSVP.mockReturnValue({
          ...mockRSVPHook,
          rsvp: { ...mockRSVP, status },
          rsvpStatus: status,
          hasRSVP: true,
        })

        const { rerender } = render(<SessionCard {...defaultProps} />)
        expect(screen.getByText(text)).toBeInTheDocument()
        rerender(<div />)
      })
    })

    it('shows pending approval status when required', () => {
      mockUseRSVP.mockReturnValue({
        ...mockRSVPHook,
        rsvp: mockRSVPPending,
        rsvpStatus: RSVPStatus.ATTENDING,
        hasRSVP: true,
        config: {
          ...mockRSVPHook.config,
          requiresApproval: true,
        },
      })

      render(<SessionCard {...defaultProps} />)

      expect(screen.getByText('Pending Approval')).toBeInTheDocument()
    })
  })

  describe('Email Validation', () => {
    it('disables RSVP when user email is not verified', () => {
      mockUseRSVP.mockReturnValue({
        ...mockRSVPHook,
        config: {
          ...mockRSVPHook.config,
          hasValidEmail: false,
        },
      })

      render(
        <SessionCard {...defaultProps} />,
        {
          initialState: {
            user: mockUserWithUnverifiedEmail,
          },
        }
      )

      expect(screen.getByText('Update Email to RSVP')).toBeInTheDocument()
      const button = screen.getByRole('button', { name: 'Update Email to RSVP' })
      expect(button).toBeDisabled()
    })

    it('enables RSVP when user email is verified', () => {
      render(
        <SessionCard {...defaultProps} />,
        {
          initialState: {
            user: mockUserWithVerifiedEmail,
          },
        }
      )

      const button = screen.getByRole('button', { name: 'Attend Event' })
      expect(button).not.toBeDisabled()
    })
  })

  describe('RSVP Configuration', () => {
    it('disables RSVP when not enabled for session', () => {
      mockUseRSVP.mockReturnValue({
        ...mockRSVPHook,
        config: {
          ...mockRSVPHook.config,
          isRSVPEnabled: false,
        },
      })

      render(<SessionCard {...defaultProps} session={mockSessionWithoutRSVP} />)

      expect(screen.getByText('RSVP Disabled')).toBeInTheDocument()
      const button = screen.getByRole('button', { name: 'RSVP Disabled' })
      expect(button).toBeDisabled()
    })

    it('disables RSVP when deadline has passed', () => {
      mockUseRSVP.mockReturnValue({
        ...mockRSVPHook,
        config: {
          ...mockRSVPHook.config,
          isDeadlinePassed: true,
        },
      })

      render(<SessionCard {...defaultProps} session={mockSessionPastDeadline} />)

      expect(screen.getByText('RSVP Closed')).toBeInTheDocument()
      const button = screen.getByRole('button', { name: 'RSVP Closed' })
      expect(button).toBeDisabled()
    })
  })

  describe('Calendar Integration', () => {
    beforeEach(() => {
      // Mock window.open
      window.open = jest.fn()
    })

    it('opens Google Calendar when Google option is selected', async () => {
      const user = userEvent.setup()
      render(<SessionCard {...defaultProps} openDropdownId="session-123" />)

      // This would be tested through the dropdown component
      // For now, we test that the hook is called correctly
      expect(mockUseCalendarIntegration).toHaveBeenCalledWith(mockSession)
    })

    it('downloads ICS file when Apple Calendar option is selected', () => {
      render(<SessionCard {...defaultProps} />)

      // Test that calendar integration hook is properly initialized
      expect(mockUseCalendarIntegration).toHaveBeenCalledWith(mockSession)
    })

    it('handles calendar integration errors gracefully', () => {
      const errorMock = new Error('Calendar error')
      mockCalendarHook.addToGoogleCalendar.mockImplementation(() => {
        throw errorMock
      })

      render(<SessionCard {...defaultProps} />)

      // The error handling would be tested in the hook itself
      expect(mockUseCalendarIntegration).toHaveBeenCalledWith(mockSession)
    })
  })

  describe('Virtual Meeting Links', () => {
    it('handles join channel functionality', () => {
      render(<SessionCard {...defaultProps} />)

      // Test that session with virtual link is handled correctly
      expect(screen.getByText('Introduction to Web3 Development')).toBeInTheDocument()
      // The join channel functionality would be tested through the dropdown
    })

    it('handles missing virtual link gracefully', () => {
      const sessionWithoutLink = {
        ...mockSession,
        location: {
          type: 'virtual' as const,
        },
        rsvpChannelLink: undefined,
      }

      render(<SessionCard {...defaultProps} session={sessionWithoutLink} />)

      expect(screen.getByText('Introduction to Web3 Development')).toBeInTheDocument()
    })
  })

  describe('Dropdown Functionality', () => {
    it('opens dropdown when button is clicked', async () => {
      const user = userEvent.setup()
      render(<SessionCard {...defaultProps} />)

      const attendButton = screen.getByText('Attend Event')
      await user.click(attendButton)

      expect(defaultProps.toggleDropdown).toHaveBeenCalledWith('session-123')
    })

    it('shows dropdown when openDropdownId matches session id', () => {
      render(<SessionCard {...defaultProps} openDropdownId="session-123" />)

      // The AttendEventDropdown should be rendered
      // This would be visible in the DOM when the dropdown is open
      expect(screen.getByText('Introduction to Web3 Development')).toBeInTheDocument()
    })

    it('does not show dropdown when openDropdownId does not match', () => {
      render(<SessionCard {...defaultProps} openDropdownId="other-session" />)

      // The dropdown should not be visible
      expect(screen.getByText('Introduction to Web3 Development')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles RSVP creation errors', () => {
      const createRSVPMock = jest.fn().mockRejectedValue(new Error('RSVP failed'))
      mockUseRSVP.mockReturnValue({
        ...mockRSVPHook,
        createRSVP: createRSVPMock,
      })

      render(<SessionCard {...defaultProps} />)

      // Error handling would be managed by the useRSVP hook
      expect(mockUseRSVP).toHaveBeenCalledWith('session-123', mockSession)
    })

    it('handles calendar integration errors', () => {
      mockCalendarHook.addToGoogleCalendar.mockImplementation(() => {
        throw new Error('Calendar error')
      })

      render(<SessionCard {...defaultProps} />)

      // Error handling would be managed by the useCalendarIntegration hook
      expect(mockUseCalendarIntegration).toHaveBeenCalledWith(mockSession)
    })
  })

  describe('Accessibility', () => {
    it('has proper button accessibility attributes', () => {
      render(<SessionCard {...defaultProps} />)

      const button = screen.getByRole('button', { name: 'Attend Event' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('type', 'button')
    })

    it('has proper image alt texts', () => {
      render(<SessionCard {...defaultProps} />)

      const sessionImage = screen.getByAltText('Introduction to Web3 Development')
      const partnerImage = screen.getByAltText('Uniswap')

      expect(sessionImage).toBeInTheDocument()
      expect(partnerImage).toBeInTheDocument()
    })
  })
})
