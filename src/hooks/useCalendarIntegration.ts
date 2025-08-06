"use client";

import { useCallback } from 'react';
import { CalendarIntegration } from '@/utils/calendarIntegration';
import { GuidesSession } from '@/types/siherguides/session';
import { ErrorHandler } from '@/utils/errorHandler';

/**
 * Hook for calendar integration functionality
 */
export function useCalendarIntegration(session: GuidesSession) {
  const addToGoogleCalendar = useCallback(() => {
    try {
      const event = CalendarIntegration.sessionToCalendarEvent(session);
      const url = CalendarIntegration.generateGoogleCalendarUrl(event);
      window.open(url, '_blank', 'noopener,noreferrer');
      ErrorHandler.showSuccess('Opening Google Calendar...');
    } catch (error) {
      ErrorHandler.handle(error, 'Google Calendar integration');
    }
  }, [session]);

  const addToOutlookCalendar = useCallback(() => {
    try {
      const event = CalendarIntegration.sessionToCalendarEvent(session);
      const url = CalendarIntegration.generateOutlookCalendarUrl(event);
      window.open(url, '_blank', 'noopener,noreferrer');
      ErrorHandler.showSuccess('Opening Outlook Calendar...');
    } catch (error) {
      ErrorHandler.handle(error, 'Outlook Calendar integration');
    }
  }, [session]);

  const downloadICSFile = useCallback(() => {
    try {
      const event = CalendarIntegration.sessionToCalendarEvent(session);
      CalendarIntegration.downloadICSFile(event);
      ErrorHandler.showSuccess('Calendar file downloaded!');
    } catch (error) {
      ErrorHandler.handle(error, 'ICS file download');
    }
  }, [session]);

  const addToAppleCalendar = useCallback(() => {
    // Apple Calendar uses ICS files
    downloadICSFile();
  }, [downloadICSFile]);

  const getCalendarLinks = useCallback(() => {
    try {
      return CalendarIntegration.getCalendarLinks(session);
    } catch (error) {
      ErrorHandler.handle(error, 'Calendar links generation');
      return null;
    }
  }, [session]);

  const copyCalendarLink = useCallback(async (type: 'google' | 'outlook') => {
    try {
      const event = CalendarIntegration.sessionToCalendarEvent(session);
      const url = type === 'google' 
        ? CalendarIntegration.generateGoogleCalendarUrl(event)
        : CalendarIntegration.generateOutlookCalendarUrl(event);
      
      await navigator.clipboard.writeText(url);
      ErrorHandler.showSuccess(`${type === 'google' ? 'Google' : 'Outlook'} Calendar link copied to clipboard!`);
    } catch (error) {
      ErrorHandler.handle(error, 'Copy calendar link');
    }
  }, [session]);

  return {
    addToGoogleCalendar,
    addToOutlookCalendar,
    addToAppleCalendar,
    downloadICSFile,
    getCalendarLinks,
    copyCalendarLink,
  };
}
