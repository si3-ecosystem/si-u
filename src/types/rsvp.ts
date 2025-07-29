/**
 * RSVP Types and Interfaces
 */

export type RSVPStatus = 'attending' | 'not_attending' | 'maybe' | null;

export interface RSVPData {
  sessionId: string;
  userId: string;
  status: RSVPStatus;
  createdAt: string;
  updatedAt: string;
}

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

export interface SessionWithRSVP {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  maxAttendees?: number;
  currentAttendees: number;
  userRSVP?: RSVPData;
  rsvpCounts: {
    attending: number;
    not_attending: number;
    maybe: number;
  };
}
