/**
 * Calendar Integration Utilities
 * Handles calendar event creation for Google Calendar, Apple iCal, and ICS downloads
 */

import { GuidesSession } from '@/types/siherguides/session';

export interface CalendarEvent {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  url?: string;
  organizer?: {
    name: string;
    email: string;
  };
}

export class CalendarIntegration {
  /**
   * Convert GuidesSession to CalendarEvent
   */
  static sessionToCalendarEvent(session: GuidesSession): CalendarEvent {
    const startDate = session.date ? new Date(session.date) : new Date();
    const endDate = session.endDate ? new Date(session.endDate) : new Date(startDate.getTime() + 60 * 60 * 1000); // Default 1 hour duration

    const location = this.getSessionLocation(session);
    const description = this.buildEventDescription(session);

    // Get meeting URL from multiple possible sources
    const meetingUrl = session.location?.virtualLink || session.videoUrl || session.rsvpChannelLink;

    return {
      title: session.title,
      description,
      startDate,
      endDate,
      location,
      url: meetingUrl,
      organizer: session.organizer ? {
        name: session.organizer.name,
        email: session.organizer.email
      } : {
        name: 'SI3 Team',
        email: 'guides@si3.space'
      }
    };
  }

  /**
   * Get session location string
   */
  private static getSessionLocation(session: GuidesSession): string {
    if (session.location) {
      switch (session.location.type) {
        case 'virtual':
          return session.location.venue || 'Virtual Session';
        case 'physical':
          return session.location.address || session.location.venue || 'Physical Location';
        case 'hybrid':
          return `${session.location.venue || 'Hybrid Session'}${session.location.address ? ` - ${session.location.address}` : ''}`;
        default:
          return 'Online';
      }
    }
    // Fallback for legacy sessions without location object
    return 'Online';
  }

  /**
   * Build event description
   */
  private static buildEventDescription(session: GuidesSession): string {
    let description = session.description || '';

    if (session.guideName) {
      description += `\n\nGuided by: ${session.guideName}`;
    }

    if (session.partner?.title) {
      description += `\nIn partnership with: ${session.partner.title}`;
    }

    if (session.language) {
      description += `\nLanguage: ${session.language}`;
    }

    // Add meeting link prominently in description
    const meetingLink = session.location?.virtualLink || session.videoUrl;
    if (meetingLink) {
      description += `\n\n🔗 JOIN MEETING: ${meetingLink}`;
    }

    if (session.location?.accessInstructions) {
      description += `\n\nAccess Instructions:\n${session.location.accessInstructions}`;
    }

    return description;
  }

  /**
   * Generate Google Calendar URL
   */
  static generateGoogleCalendarUrl(event: CalendarEvent): string {
    let details = event.description;

    // Ensure meeting URL is prominently displayed
    if (event.url) {
      details = `${event.description}\n\n🔗 JOIN MEETING: ${event.url}`;
    }

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${this.formatDateForGoogle(event.startDate)}/${this.formatDateForGoogle(event.endDate)}`,
      details: details,
      location: event.location || (event.url ? 'Online Meeting' : ''),
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  /**
   * Generate Outlook Calendar URL
   */
  static generateOutlookCalendarUrl(event: CalendarEvent): string {
    const params = new URLSearchParams({
      subject: event.title,
      startdt: event.startDate.toISOString(),
      enddt: event.endDate.toISOString(),
      body: event.description,
      location: event.location || '',
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  }

  /**
   * Generate ICS file content
   */
  static generateICSContent(event: CalendarEvent): string {
    const now = new Date();
    const uid = `${now.getTime()}@si3.space`;
    const dtstamp = this.formatDateForICS(now);
    const dtstart = this.formatDateForICS(event.startDate);
    const dtend = this.formatDateForICS(event.endDate);

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SI3//RSVP System//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${dtstart}`,
      `DTEND:${dtend}`,
      `SUMMARY:${this.escapeICSText(event.title)}`,
      `DESCRIPTION:${this.escapeICSText(event.description)}`,
    ];

    if (event.location) {
      icsContent.push(`LOCATION:${this.escapeICSText(event.location)}`);
    }

    if (event.url) {
      icsContent.push(`URL:${event.url}`);
    }

    if (event.organizer) {
      icsContent.push(`ORGANIZER;CN=${this.escapeICSText(event.organizer.name)}:MAILTO:${event.organizer.email}`);
    }

    icsContent.push('STATUS:CONFIRMED');
    icsContent.push('TRANSP:OPAQUE');
    icsContent.push('END:VEVENT');
    icsContent.push('END:VCALENDAR');

    return icsContent.join('\r\n');
  }

  /**
   * Download ICS file
   */
  static downloadICSFile(event: CalendarEvent, filename?: string): void {
    const icsContent = this.generateICSContent(event);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Format date for Google Calendar (YYYYMMDDTHHMMSSZ)
   */
  private static formatDateForGoogle(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  /**
   * Format date for ICS (YYYYMMDDTHHMMSSZ)
   */
  private static formatDateForICS(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  /**
   * Escape text for ICS format
   */
  private static escapeICSText(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '');
  }

  /**
   * Get all calendar links for a session
   */
  static getCalendarLinks(session: GuidesSession) {
    const event = this.sessionToCalendarEvent(session);
    
    return {
      google: this.generateGoogleCalendarUrl(event),
      outlook: this.generateOutlookCalendarUrl(event),
      downloadICS: () => this.downloadICSFile(event),
      icsContent: this.generateICSContent(event)
    };
  }
}
