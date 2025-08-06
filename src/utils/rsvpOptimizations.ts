/**
 * RSVP Performance Optimizations
 * Utilities for optimizing RSVP-related operations
 */

import { QueryClient } from '@tanstack/react-query';
import { IRSVP, RSVPStatus } from '@/types/rsvp';

export class RSVPOptimizations {
  /**
   * Prefetch RSVP data for upcoming sessions
   */
  static prefetchSessionRSVPs(queryClient: QueryClient, sessionIds: string[]) {
    sessionIds.forEach(sessionId => {
      queryClient.prefetchQuery({
        queryKey: ['rsvp', 'event', sessionId],
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    });
  }

  /**
   * Batch update multiple RSVP statuses
   */
  static batchUpdateRSVPs(
    queryClient: QueryClient,
    updates: Array<{ rsvpId: string; status: RSVPStatus }>
  ) {
    updates.forEach(({ rsvpId, status }) => {
      queryClient.setQueryData(['rsvp', rsvpId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            status,
            updatedAt: new Date().toISOString(),
          },
        };
      });
    });
  }

  /**
   * Optimistically update RSVP counts for an event
   */
  static updateEventRSVPCounts(
    queryClient: QueryClient,
    eventId: string,
    oldStatus: RSVPStatus | null,
    newStatus: RSVPStatus
  ) {
    queryClient.setQueryData(['event-stats', eventId], (oldData: any) => {
      if (!oldData?.data) return oldData;

      const stats = { ...oldData.data };

      // Decrement old status count
      if (oldStatus) {
        switch (oldStatus) {
          case RSVPStatus.ATTENDING:
            stats.attendingCount = Math.max(0, stats.attendingCount - 1);
            break;
          case RSVPStatus.MAYBE:
            stats.maybeCount = Math.max(0, stats.maybeCount - 1);
            break;
          case RSVPStatus.NOT_ATTENDING:
            stats.notAttendingCount = Math.max(0, stats.notAttendingCount - 1);
            break;
          case RSVPStatus.WAITLISTED:
            stats.waitlistCount = Math.max(0, stats.waitlistCount - 1);
            break;
        }
      }

      // Increment new status count
      switch (newStatus) {
        case RSVPStatus.ATTENDING:
          stats.attendingCount += 1;
          break;
        case RSVPStatus.MAYBE:
          stats.maybeCount += 1;
          break;
        case RSVPStatus.NOT_ATTENDING:
          stats.notAttendingCount += 1;
          break;
        case RSVPStatus.WAITLISTED:
          stats.waitlistCount += 1;
          break;
      }

      // Update total RSVPs
      if (!oldStatus) {
        stats.totalRSVPs += 1;
      }

      return {
        ...oldData,
        data: stats,
      };
    });
  }

  /**
   * Debounce RSVP status updates to prevent rapid API calls
   */
  static debounceRSVPUpdate = (() => {
    const timeouts = new Map<string, NodeJS.Timeout>();

    return (
      key: string,
      updateFn: () => void,
      delay: number = 500
    ) => {
      // Clear existing timeout for this key
      const existingTimeout = timeouts.get(key);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Set new timeout
      const timeout = setTimeout(() => {
        updateFn();
        timeouts.delete(key);
      }, delay);

      timeouts.set(key, timeout);
    };
  })();

  /**
   * Cache calendar event data to avoid regeneration
   */
  static memoizeCalendarEvent = (() => {
    const cache = new Map<string, any>();

    return (sessionId: string, session: any, generator: () => any) => {
      const cacheKey = `${sessionId}-${JSON.stringify({
        title: session.title,
        date: session.date,
        endDate: session.endDate,
        location: session.location,
      })}`;

      if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
      }

      const result = generator();
      cache.set(cacheKey, result);

      // Clean up old cache entries (keep last 50)
      if (cache.size > 50) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }

      return result;
    };
  })();

  /**
   * Preload critical RSVP components
   */
  static preloadComponents() {
    // Dynamically import components that might be needed
    return Promise.all([
      import('@/components/molecules/forms/RSVPForm'),
      import('@/components/molecules/modals/RSVPModal'),
      import('@/components/molecules/calendar/CalendarIntegrationCard'),
    ]);
  }

  /**
   * Optimize image loading for session cards
   */
  static optimizeSessionImages(sessions: any[]) {
    // Preload images for visible sessions
    sessions.slice(0, 6).forEach(session => {
      if (session.guideImage?.asset?.url) {
        const img = new Image();
        img.src = session.guideImage.asset.url;
      }
      if (session.partner?.logo?.asset?.url) {
        const img = new Image();
        img.src = session.partner.logo.asset.url;
      }
    });
  }

  /**
   * Cleanup stale RSVP data from cache
   */
  static cleanupStaleData(queryClient: QueryClient) {
    const now = Date.now();
    const staleThreshold = 30 * 60 * 1000; // 30 minutes

    queryClient.getQueryCache().getAll().forEach(query => {
      if (
        query.queryKey[0] === 'rsvp' &&
        query.state.dataUpdatedAt &&
        now - query.state.dataUpdatedAt > staleThreshold
      ) {
        queryClient.removeQueries({ queryKey: query.queryKey });
      }
    });
  }

  /**
   * Batch invalidate related queries after RSVP operations
   */
  static invalidateRelatedQueries(
    queryClient: QueryClient,
    eventId: string,
    userId?: string
  ) {
    const invalidations = [
      ['rsvp', 'event', eventId],
      ['event-stats', eventId],
      ['event-availability', eventId],
    ];

    if (userId) {
      invalidations.push(['user-rsvps']);
    }

    invalidations.forEach(queryKey => {
      queryClient.invalidateQueries({ queryKey });
    });
  }

  /**
   * Optimize form validation by memoizing validation results
   */
  static memoizeValidation = (() => {
    const cache = new Map<string, any>();

    return (formData: any, validator: (data: any) => any) => {
      const cacheKey = JSON.stringify(formData);
      
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
      }

      const result = validator(formData);
      cache.set(cacheKey, result);

      // Limit cache size
      if (cache.size > 100) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }

      return result;
    };
  })();

  /**
   * Performance monitoring for RSVP operations
   */
  static measurePerformance(operation: string, fn: () => Promise<any>) {
    const start = performance.now();
    
    return fn().finally(() => {
      const duration = performance.now() - start;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`RSVP ${operation} took ${duration.toFixed(2)}ms`);
      }

      // Report to analytics in production
      if (process.env.NODE_ENV === 'production' && duration > 1000) {
        // Report slow operations
        console.warn(`Slow RSVP operation: ${operation} took ${duration.toFixed(2)}ms`);
      }
    });
  }
}
