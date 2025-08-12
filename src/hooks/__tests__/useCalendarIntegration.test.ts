import { renderHook } from '@testing-library/react'
import { useCalendarIntegration } from '../useCalendarIntegration'
import { CalendarIntegration } from '@/utils/calendarIntegration'
import { ErrorHandler } from '@/utils/errorHandler'
import {
  mockSession,
  mockCalendarEvent,
  mockGoogleCalendarUrl,
  mockOutlookCalendarUrl,
  mockICSContent,
} from '@/test-utils/mockData'

// Mock the dependencies
jest.mock('@/utils/calendarIntegration')
jest.mock('@/utils/errorHandler')

const mockCalendarIntegration = CalendarIntegration as jest.Mocked<typeof CalendarIntegration>
const mockErrorHandler = ErrorHandler as jest.Mocked<typeof ErrorHandler>

describe('useCalendarIntegration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup default mocks
    mockCalendarIntegration.sessionToCalendarEvent.mockReturnValue(mockCalendarEvent)
    mockCalendarIntegration.generateGoogleCalendarUrl.mockReturnValue(mockGoogleCalendarUrl)
    mockCalendarIntegration.generateOutlookCalendarUrl.mockReturnValue(mockOutlookCalendarUrl)
    mockCalendarIntegration.downloadICSFile.mockImplementation(() => {})
    mockCalendarIntegration.getCalendarLinks.mockReturnValue({
      google: mockGoogleCalendarUrl,
      outlook: mockOutlookCalendarUrl,
      downloadICS: jest.fn(),
      icsContent: mockICSContent,
    })

    // Mock window.open
    window.open = jest.fn()
    
    // Mock navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn(() => Promise.resolve()),
      },
      configurable: true,
    })
  })

  describe('Google Calendar Integration', () => {
    it('opens Google Calendar with correct URL', () => {
      const { result } = renderHook(() => useCalendarIntegration(mockSession))

      result.current.addToGoogleCalendar()

      expect(mockCalendarIntegration.sessionToCalendarEvent).toHaveBeenCalledWith(mockSession)
      expect(mockCalendarIntegration.generateGoogleCalendarUrl).toHaveBeenCalledWith(mockCalendarEvent)
      expect(window.open).toHaveBeenCalledWith(mockGoogleCalendarUrl, '_blank', 'noopener,noreferrer')
      expect(mockErrorHandler.showSuccess).toHaveBeenCalledWith('Opening Google Calendar...')
    })

    it('handles Google Calendar errors', () => {
      const error = new Error('Google Calendar error')
      mockCalendarIntegration.sessionToCalendarEvent.mockImplementation(() => {
        throw error
      })

      const { result } = renderHook(() => useCalendarIntegration(mockSession))

      result.current.addToGoogleCalendar()

      expect(mockErrorHandler.handle).toHaveBeenCalledWith(error, 'Google Calendar integration')
    })
  })

  describe('Outlook Calendar Integration', () => {
    it('opens Outlook Calendar with correct URL', () => {
      const { result } = renderHook(() => useCalendarIntegration(mockSession))

      result.current.addToOutlookCalendar()

      expect(mockCalendarIntegration.sessionToCalendarEvent).toHaveBeenCalledWith(mockSession)
      expect(mockCalendarIntegration.generateOutlookCalendarUrl).toHaveBeenCalledWith(mockCalendarEvent)
      expect(window.open).toHaveBeenCalledWith(mockOutlookCalendarUrl, '_blank', 'noopener,noreferrer')
      expect(mockErrorHandler.showSuccess).toHaveBeenCalledWith('Opening Outlook Calendar...')
    })

    it('handles Outlook Calendar errors', () => {
      const error = new Error('Outlook Calendar error')
      mockCalendarIntegration.generateOutlookCalendarUrl.mockImplementation(() => {
        throw error
      })

      const { result } = renderHook(() => useCalendarIntegration(mockSession))

      result.current.addToOutlookCalendar()

      expect(mockErrorHandler.handle).toHaveBeenCalledWith(error, 'Outlook Calendar integration')
    })
  })

  describe('Apple Calendar Integration', () => {
    it('downloads ICS file for Apple Calendar', () => {
      const { result } = renderHook(() => useCalendarIntegration(mockSession))

      result.current.addToAppleCalendar()

      expect(mockCalendarIntegration.sessionToCalendarEvent).toHaveBeenCalledWith(mockSession)
      expect(mockCalendarIntegration.downloadICSFile).toHaveBeenCalledWith(mockCalendarEvent)
      expect(mockErrorHandler.showSuccess).toHaveBeenCalledWith(
        'Calendar file downloaded! Double-click the .ics file to open it in Apple Calendar.'
      )
    })

    it('handles Apple Calendar errors', () => {
      const error = new Error('Apple Calendar error')
      mockCalendarIntegration.downloadICSFile.mockImplementation(() => {
        throw error
      })

      const { result } = renderHook(() => useCalendarIntegration(mockSession))

      result.current.addToAppleCalendar()

      expect(mockErrorHandler.handle).toHaveBeenCalledWith(error, 'Apple Calendar integration')
    })
  })

  describe('ICS File Download', () => {
    it('downloads ICS file successfully', () => {
      const { result } = renderHook(() => useCalendarIntegration(mockSession))

      result.current.downloadICSFile()

      expect(mockCalendarIntegration.sessionToCalendarEvent).toHaveBeenCalledWith(mockSession)
      expect(mockCalendarIntegration.downloadICSFile).toHaveBeenCalledWith(mockCalendarEvent)
      expect(mockErrorHandler.showSuccess).toHaveBeenCalledWith(
        'Calendar file downloaded! Double-click the file to add it to your calendar app.'
      )
    })

    it('handles ICS download errors', () => {
      const error = new Error('ICS download error')
      mockCalendarIntegration.sessionToCalendarEvent.mockImplementation(() => {
        throw error
      })

      const { result } = renderHook(() => useCalendarIntegration(mockSession))

      result.current.downloadICSFile()

      expect(mockErrorHandler.handle).toHaveBeenCalledWith(error, 'ICS file download')
    })
  })

  describe('Calendar Links', () => {
    it('gets calendar links successfully', () => {
      const { result } = renderHook(() => useCalendarIntegration(mockSession))

      const links = result.current.getCalendarLinks()

      expect(mockCalendarIntegration.getCalendarLinks).toHaveBeenCalledWith(mockSession)
      expect(links).toEqual({
        google: mockGoogleCalendarUrl,
        outlook: mockOutlookCalendarUrl,
        downloadICS: expect.any(Function),
        icsContent: mockICSContent,
      })
    })

    it('handles calendar links errors', () => {
      const error = new Error('Calendar links error')
      mockCalendarIntegration.getCalendarLinks.mockImplementation(() => {
        throw error
      })

      const { result } = renderHook(() => useCalendarIntegration(mockSession))

      const links = result.current.getCalendarLinks()

      expect(mockErrorHandler.handle).toHaveBeenCalledWith(error, 'Calendar links generation')
      expect(links).toBeNull()
    })
  })

  describe('Copy Calendar Link', () => {
    it('copies Google Calendar link to clipboard', async () => {
      const { result } = renderHook(() => useCalendarIntegration(mockSession))

      await result.current.copyCalendarLink('google')

      expect(mockCalendarIntegration.sessionToCalendarEvent).toHaveBeenCalledWith(mockSession)
      expect(mockCalendarIntegration.generateGoogleCalendarUrl).toHaveBeenCalledWith(mockCalendarEvent)
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockGoogleCalendarUrl)
      expect(mockErrorHandler.showSuccess).toHaveBeenCalledWith(
        'Google Calendar link copied to clipboard!'
      )
    })

    it('copies Outlook Calendar link to clipboard', async () => {
      const { result } = renderHook(() => useCalendarIntegration(mockSession))

      await result.current.copyCalendarLink('outlook')

      expect(mockCalendarIntegration.sessionToCalendarEvent).toHaveBeenCalledWith(mockSession)
      expect(mockCalendarIntegration.generateOutlookCalendarUrl).toHaveBeenCalledWith(mockCalendarEvent)
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockOutlookCalendarUrl)
      expect(mockErrorHandler.showSuccess).toHaveBeenCalledWith(
        'Outlook Calendar link copied to clipboard!'
      )
    })

    it('handles copy calendar link errors', async () => {
      const error = new Error('Copy error')
      ;(navigator.clipboard.writeText as jest.Mock).mockRejectedValue(error)

      const { result } = renderHook(() => useCalendarIntegration(mockSession))

      await result.current.copyCalendarLink('google')

      expect(mockErrorHandler.handle).toHaveBeenCalledWith(error, 'Copy calendar link')
    })
  })

  describe('Session Data Handling', () => {
    it('handles session with minimal data', () => {
      const minimalSession = {
        ...mockSession,
        location: undefined,
        rsvpChannelLink: undefined,
      }

      const { result } = renderHook(() => useCalendarIntegration(minimalSession))

      result.current.addToGoogleCalendar()

      expect(mockCalendarIntegration.sessionToCalendarEvent).toHaveBeenCalledWith(minimalSession)
    })

    it('handles session with different location types', () => {
      const physicalLocationSession = {
        ...mockSession,
        location: {
          type: 'physical' as const,
          address: '123 Main St, City, State',
        },
      }

      const { result } = renderHook(() => useCalendarIntegration(physicalLocationSession))

      result.current.addToGoogleCalendar()

      expect(mockCalendarIntegration.sessionToCalendarEvent).toHaveBeenCalledWith(physicalLocationSession)
    })
  })

  describe('Memoization', () => {
    it('memoizes calendar functions correctly', () => {
      const { result, rerender } = renderHook(() => useCalendarIntegration(mockSession))

      const firstGoogleFunction = result.current.addToGoogleCalendar
      const firstAppleFunction = result.current.addToAppleCalendar
      const firstICSFunction = result.current.downloadICSFile

      rerender()

      expect(result.current.addToGoogleCalendar).toBe(firstGoogleFunction)
      expect(result.current.addToAppleCalendar).toBe(firstAppleFunction)
      expect(result.current.downloadICSFile).toBe(firstICSFunction)
    })

    it('updates functions when session changes', () => {
      const { result, rerender } = renderHook(
        ({ session }) => useCalendarIntegration(session),
        { initialProps: { session: mockSession } }
      )

      const firstGoogleFunction = result.current.addToGoogleCalendar

      const newSession = { ...mockSession, title: 'New Session Title' }
      rerender({ session: newSession })

      expect(result.current.addToGoogleCalendar).not.toBe(firstGoogleFunction)
    })
  })
})
