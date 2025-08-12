import { CalendarIntegration, CalendarEvent } from '../calendarIntegration'
import { mockSession } from '@/test-utils/mockData'

// Mock document.createElement for download functionality
const mockAnchorElement = {
  href: '',
  download: '',
  click: jest.fn(),
  style: {},
}

const originalCreateElement = document.createElement
document.createElement = jest.fn((tagName) => {
  if (tagName === 'a') {
    return mockAnchorElement as any
  }
  return originalCreateElement.call(document, tagName)
})

// Mock document.body.appendChild and removeChild
document.body.appendChild = jest.fn()
document.body.removeChild = jest.fn()

// Mock URL.createObjectURL and revokeObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: jest.fn(() => 'mocked-blob-url'),
})

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: jest.fn(),
})

describe('CalendarIntegration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('sessionToCalendarEvent', () => {
    it('converts session to calendar event correctly', () => {
      const event = CalendarIntegration.sessionToCalendarEvent(mockSession)

      expect(event.title).toBe('Introduction to Web3 Development')
      expect(event.description).toContain('Learn the basics of Web3 development')
      expect(event.startDate).toEqual(new Date('2024-08-15T10:00:00Z'))
      expect(event.endDate).toEqual(new Date('2024-08-15T11:00:00Z'))
      expect(event.url).toBe('https://zoom.us/j/123456789')
    })

    it('handles session without end date', () => {
      const sessionWithoutEndDate = {
        ...mockSession,
        endDate: undefined,
      }

      const event = CalendarIntegration.sessionToCalendarEvent(sessionWithoutEndDate)

      expect(event.startDate).toEqual(new Date('2024-08-15T10:00:00Z'))
      // Should default to 1 hour after start time
      expect(event.endDate.getTime() - event.startDate.getTime()).toBe(60 * 60 * 1000)
    })

    it('handles session with physical location', () => {
      const sessionWithPhysicalLocation = {
        ...mockSession,
        location: {
          type: 'physical' as const,
          address: '123 Main St, City, State',
        },
      }

      const event = CalendarIntegration.sessionToCalendarEvent(sessionWithPhysicalLocation)

      expect(event.location).toBe('123 Main St, City, State')
    })

    it('handles session with legacy rsvpChannelLink', () => {
      const sessionWithLegacyLink = {
        ...mockSession,
        location: undefined,
        rsvpChannelLink: 'https://legacy-link.com',
      }

      const event = CalendarIntegration.sessionToCalendarEvent(sessionWithLegacyLink)

      expect(event.url).toBe('https://legacy-link.com')
    })

    it('handles session with minimal data', () => {
      const minimalSession = {
        ...mockSession,
        description: undefined,
        location: undefined,
        partner: undefined,
        guideName: undefined,
      }

      const event = CalendarIntegration.sessionToCalendarEvent(minimalSession)

      expect(event.title).toBe('Introduction to Web3 Development')
      expect(event.description).toBeDefined()
      expect(event.startDate).toEqual(new Date('2024-08-15T10:00:00Z'))
    })
  })

  describe('generateGoogleCalendarUrl', () => {
    const mockEvent: CalendarEvent = {
      title: 'Test Event',
      description: 'Test Description',
      startDate: new Date('2024-08-15T10:00:00Z'),
      endDate: new Date('2024-08-15T11:00:00Z'),
      location: 'Test Location',
      url: 'https://test-meeting.com',
    }

    it('generates correct Google Calendar URL', () => {
      const url = CalendarIntegration.generateGoogleCalendarUrl(mockEvent)

      expect(url).toContain('https://calendar.google.com/calendar/render')
      expect(url).toContain('action=TEMPLATE')
      expect(url).toContain('text=Test%20Event')
      expect(url).toContain('dates=20240815T100000Z%2F20240815T110000Z')
      expect(url).toContain('details=')
      expect(url).toContain('location=')
    })

    it('includes meeting URL in description and location', () => {
      const url = CalendarIntegration.generateGoogleCalendarUrl(mockEvent)

      expect(url).toContain('https%3A%2F%2Ftest-meeting.com')
    })

    it('handles event without URL', () => {
      const eventWithoutUrl = { ...mockEvent, url: undefined }
      const url = CalendarIntegration.generateGoogleCalendarUrl(eventWithoutUrl)

      expect(url).toContain('https://calendar.google.com/calendar/render')
      expect(url).toContain('text=Test%20Event')
    })

    it('handles virtual meeting location correctly', () => {
      const virtualEvent = {
        ...mockEvent,
        location: 'Online',
        url: 'https://zoom.us/j/123456789',
      }

      const url = CalendarIntegration.generateGoogleCalendarUrl(virtualEvent)

      expect(url).toContain('location=Online%20Meeting%3A%20https%3A%2F%2Fzoom.us%2Fj%2F123456789')
    })
  })

  describe('generateOutlookCalendarUrl', () => {
    const mockEvent: CalendarEvent = {
      title: 'Test Event',
      description: 'Test Description',
      startDate: new Date('2024-08-15T10:00:00Z'),
      endDate: new Date('2024-08-15T11:00:00Z'),
      location: 'Test Location',
    }

    it('generates correct Outlook Calendar URL', () => {
      const url = CalendarIntegration.generateOutlookCalendarUrl(mockEvent)

      expect(url).toContain('https://outlook.live.com/calendar/0/deeplink/compose')
      expect(url).toContain('subject=Test%20Event')
      expect(url).toContain('startdt=2024-08-15T10%3A00%3A00.000Z')
      expect(url).toContain('enddt=2024-08-15T11%3A00%3A00.000Z')
      expect(url).toContain('body=Test%20Description')
      expect(url).toContain('location=Test%20Location')
    })

    it('handles event without location', () => {
      const eventWithoutLocation = { ...mockEvent, location: undefined }
      const url = CalendarIntegration.generateOutlookCalendarUrl(eventWithoutLocation)

      expect(url).toContain('location=')
    })
  })

  describe('generateICSContent', () => {
    const mockEvent: CalendarEvent = {
      title: 'Test Event',
      description: 'Test Description',
      startDate: new Date('2024-08-15T10:00:00Z'),
      endDate: new Date('2024-08-15T11:00:00Z'),
      location: 'Test Location',
      url: 'https://test-meeting.com',
      organizer: {
        name: 'Test Organizer',
        email: 'organizer@test.com',
      },
    }

    it('generates valid ICS content', () => {
      const icsContent = CalendarIntegration.generateICSContent(mockEvent)

      expect(icsContent).toContain('BEGIN:VCALENDAR')
      expect(icsContent).toContain('VERSION:2.0')
      expect(icsContent).toContain('PRODID:-//SI3//RSVP System//EN')
      expect(icsContent).toContain('BEGIN:VEVENT')
      expect(icsContent).toContain('SUMMARY:Test Event')
      expect(icsContent).toContain('DESCRIPTION:JOIN MEETING: https://test-meeting.com')
      expect(icsContent).toContain('LOCATION:Test Location')
      expect(icsContent).toContain('URL:https://test-meeting.com')
      expect(icsContent).toContain('ORGANIZER;CN=Test Organizer:MAILTO:organizer@test.com')
      expect(icsContent).toContain('END:VEVENT')
      expect(icsContent).toContain('END:VCALENDAR')
    })

    it('handles event without optional fields', () => {
      const minimalEvent = {
        title: 'Minimal Event',
        description: 'Minimal Description',
        startDate: new Date('2024-08-15T10:00:00Z'),
        endDate: new Date('2024-08-15T11:00:00Z'),
      }

      const icsContent = CalendarIntegration.generateICSContent(minimalEvent)

      expect(icsContent).toContain('SUMMARY:Minimal Event')
      expect(icsContent).toContain('DESCRIPTION:Minimal Description')
      expect(icsContent).not.toContain('LOCATION:')
      expect(icsContent).not.toContain('URL:')
      expect(icsContent).not.toContain('ORGANIZER:')
    })

    it('escapes special characters in ICS text', () => {
      const eventWithSpecialChars = {
        ...mockEvent,
        title: 'Event with "quotes" and \\backslashes',
        description: 'Description with\nline breaks and, commas',
      }

      const icsContent = CalendarIntegration.generateICSContent(eventWithSpecialChars)

      expect(icsContent).toContain('SUMMARY:Event with \\"quotes\\" and \\\\backslashes')
      expect(icsContent).toContain('DESCRIPTION:')
    })
  })

  describe('downloadICSFile', () => {
    const mockEvent: CalendarEvent = {
      title: 'Test Event',
      description: 'Test Description',
      startDate: new Date('2024-08-15T10:00:00Z'),
      endDate: new Date('2024-08-15T11:00:00Z'),
    }

    it('creates and downloads ICS file', () => {
      CalendarIntegration.downloadICSFile(mockEvent)

      expect(document.createElement).toHaveBeenCalledWith('a')
      expect(URL.createObjectURL).toHaveBeenCalled()
      expect(mockAnchorElement.click).toHaveBeenCalled()
      expect(document.body.appendChild).toHaveBeenCalledWith(mockAnchorElement)
      expect(document.body.removeChild).toHaveBeenCalledWith(mockAnchorElement)
      expect(URL.revokeObjectURL).toHaveBeenCalled()
    })

    it('sets correct filename for ICS file', () => {
      CalendarIntegration.downloadICSFile(mockEvent)

      expect(mockAnchorElement.download).toBe('test-event.ics')
    })

    it('handles event titles with special characters in filename', () => {
      const eventWithSpecialTitle = {
        ...mockEvent,
        title: 'Event with / \\ : * ? " < > | characters',
      }

      CalendarIntegration.downloadICSFile(eventWithSpecialTitle)

      expect(mockAnchorElement.download).toBe('event-with-characters.ics')
    })
  })

  describe('getCalendarLinks', () => {
    it('returns all calendar links and functions', () => {
      const links = CalendarIntegration.getCalendarLinks(mockSession)

      expect(links).toHaveProperty('google')
      expect(links).toHaveProperty('outlook')
      expect(links).toHaveProperty('downloadICS')
      expect(links).toHaveProperty('icsContent')
      expect(typeof links.google).toBe('string')
      expect(typeof links.outlook).toBe('string')
      expect(typeof links.downloadICS).toBe('function')
      expect(typeof links.icsContent).toBe('string')
    })

    it('downloadICS function works correctly', () => {
      const links = CalendarIntegration.getCalendarLinks(mockSession)

      links.downloadICS()

      expect(mockAnchorElement.click).toHaveBeenCalled()
    })
  })

  describe('Date Formatting', () => {
    it('formats dates correctly for Google Calendar', () => {
      const testDate = new Date('2024-08-15T10:30:45Z')
      const formatted = CalendarIntegration['formatDateForGoogle'](testDate)

      expect(formatted).toBe('20240815T103045Z')
    })

    it('formats dates correctly for ICS', () => {
      const testDate = new Date('2024-08-15T10:30:45Z')
      const formatted = CalendarIntegration['formatDateForICS'](testDate)

      expect(formatted).toBe('20240815T103045Z')
    })
  })

  describe('Text Escaping', () => {
    it('escapes ICS text correctly', () => {
      const testText = 'Text with "quotes", \\backslashes, and\nline breaks'
      const escaped = CalendarIntegration['escapeICSText'](testText)

      expect(escaped).toBe('Text with \\"quotes\\", \\\\backslashes\\, and\\nline breaks')
    })

    it('handles empty and null text', () => {
      expect(CalendarIntegration['escapeICSText']('')).toBe('')
      expect(CalendarIntegration['escapeICSText'](null as any)).toBe('')
      expect(CalendarIntegration['escapeICSText'](undefined as any)).toBe('')
    })
  })
})
